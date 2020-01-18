import Peaks, { PeaksInstance } from "peaks.js";
import React from "react";
import { connect } from "react-redux";
import Tone from "tone";

import PersistenceApi from "../../api/persistenceApi";
import {
  Measure,
  Section,
  updatedRhythm
} from "../../states/analysis/analysisSlice";
import { triggeredPause } from "../../states/audio/audioSlice";
import {
  initializedProject,
  LoadingStatus
} from "../../states/project/projectSlice";
import { ApplicationState, NormalizedObjects } from "../../states/store";
import Log from "../log/log";
import AudioPlayer from "./audioPlayer";
import PeaksConfig, {
  AUDIO_DOM_ELEMENT,
  ZOOMVIEW_CONTAINER
} from "./peaksConfig";

interface PropsFromState {
  audioUrl: string;
  status: LoadingStatus;
  sections: NormalizedObjects<Section>;
  measures: NormalizedObjects<Measure>;
  zoomLevel: number;
  syncFirstMeasureStart: boolean;
  isPlaying: boolean;
  detune: number;
  playbackRate: number;
  secondsPerMeasure: number;
  audioSampleRate: number;
}

interface PropsFromDispatch {
  initializedProject: typeof initializedProject;
  updatedRhythm: typeof updatedRhythm;
  triggeredPause: typeof triggeredPause;
}

interface Props {}

type AllProps = PropsFromState & PropsFromDispatch & Props;

class AudioManagement extends React.Component<AllProps> {
  peaks: Peaks.PeaksInstance | undefined;
  player: AudioPlayer | undefined;

  private getPeaks = () => this.peaks;
  private getPlayer = () => this.player;

  componentDidUpdate(prevProps: AllProps) {
    Log.info(
      "componentDidUpdate with status " +
        prevProps.status +
        " -> " +
        this.props.status,
      AudioManagement.name
    );

    // Early return if there is no audio file initialized yet.
    if (this.props.status === LoadingStatus.NOT_INITIALIZED) return;

    // Early return if an initialization is still in progress
    if (
      prevProps.status === this.props.status &&
      this.props.status === LoadingStatus.INITIALIZING
    )
      return;

    // Initialize audio management if status changed to init
    if (
      prevProps.status !== this.props.status &&
      this.props.status === LoadingStatus.INITIALIZING
    ) {
      Log.info("initialize audio engine", AudioManagement.name);
      if (prevProps.audioUrl !== this.props.audioUrl) {
        Log.info(
          "switch from " + prevProps.audioUrl + " to " + this.props.audioUrl,
          AudioManagement.name
        );
        PersistenceApi.revokeLocalFile(prevProps.audioUrl);
      }
      this.init();
      return;
    }

    if (
      prevProps.status !== this.props.status &&
      this.props.status === LoadingStatus.INITIALIZED
    ) {
      this.recomputeZoomlevels(
        this.props.secondsPerMeasure,
        this.props.audioSampleRate,
        this.props.measures.allIds.length
      );
      this.repaintWaveform(
        this.props.sections,
        this.props.measures,
        this.props.zoomLevel,
        this.props.secondsPerMeasure
      );
    }

    if (
      prevProps.secondsPerMeasure !== this.props.secondsPerMeasure ||
      prevProps.audioSampleRate !== this.props.audioSampleRate ||
      prevProps.measures.allIds.length !== this.props.measures.allIds.length
    ) {
      this.recomputeZoomlevels(
        this.props.secondsPerMeasure,
        this.props.audioSampleRate,
        this.props.measures.allIds.length
      );
    }

    if (
      prevProps.sections !== this.props.sections ||
      prevProps.measures !== this.props.measures ||
      prevProps.zoomLevel !== this.props.zoomLevel
    ) {
      this.repaintWaveform(
        this.props.sections,
        this.props.measures,
        this.props.zoomLevel,
        this.props.secondsPerMeasure
      );
    }

    if (prevProps.playbackRate !== this.props.playbackRate) {
      this.getPlayer()?.setPlaybackRate(this.props.playbackRate);
    }

    if (prevProps.detune !== this.props.detune) {
      this.getPlayer()?.setDetune(this.props.detune);
    }

    if (prevProps.isPlaying !== this.props.isPlaying) {
      if (this.props.isPlaying) {
        this.getPlayer()?.play();
      } else {
        this.getPlayer()?.pause();
      }
    }
  }

  private recomputeZoomlevels(
    secondsPerMeasure: number,
    audioSampleRate: number,
    measuresCount: number
  ) {
    let newZoomLevels = PeaksConfig.computeZoomLevels(
      secondsPerMeasure,
      audioSampleRate,
      document.getElementById(ZOOMVIEW_CONTAINER)!.clientWidth,
      measuresCount
    );

    //TODO: Used any because setZoomlevel is not API. See https://github.com/bbc/peaks.js/issues/295.
    (this.getPeaks()?.zoom as any).setZoomLevels(newZoomLevels);
  }

  private repaintWaveform(
    sections: NormalizedObjects<Section>,
    measures: NormalizedObjects<Measure>,
    zoomLevel: number,
    timePerMeasure: number
  ) {
    this.getPeaks()?.segments.removeAll();
    this.getPeaks()?.segments.add(
      PeaksConfig.sectionsToSegment(sections, measures, timePerMeasure)
    );
    this.getPeaks()?.points.removeAll();
    this.getPeaks()?.points.add(PeaksConfig.measuresToPoints(measures));
    this.getPeaks()?.zoom.setZoom(zoomLevel);
  }

  private init = () => {
    const audioCtx: AudioContext = (Tone.context as unknown) as AudioContext;

    this.getPeaks()?.destroy();

    let audio = this;

    // Load audioFile into audio buffer
    fetch(this.props.audioUrl)
      .then(function(response) {
        return response.arrayBuffer();
      })
      .then(function(buffer) {
        return audioCtx.decodeAudioData(buffer);
      })
      .then(function(audioBuffer) {
        audio.initPeaks(audioBuffer);
      });
  };

  private initPeaks(audioBuffer: AudioBuffer) {
    Log.info("init peaks", AudioManagement.name);

    Peaks.init(PeaksConfig.create(audioBuffer), (err, peaks) => {
      if (err) throw err;
      if (peaks === undefined)
        throw new Error("Peaks instance is not correctly initialized.");

      initPlayer(peaks, audioBuffer);
      replacePlayer(peaks, audioBuffer);

      peaks.on("player_seek", (time: number) => {
        if (this.props.syncFirstMeasureStart)
          this.props.updatedRhythm({ firstMeasureStart: time });
      });

      this.peaks = peaks;

      this.props.initializedProject({
        audioDuration: audioBuffer.duration,
        audioSampleRate: audioBuffer.sampleRate
      });
    });

    let initPlayer = (peaks: Peaks.PeaksInstance, audioBuffer: AudioBuffer) => {
      this.player = new AudioPlayer(peaks, audioBuffer, () =>
        this.props.triggeredPause()
      );
    };

    let replacePlayer = (
      peaks: Peaks.PeaksInstance,
      audioBuffer: AudioBuffer
    ) => {
      (peaks.player as any).destroy();
      peaks.player = (this.player as unknown) as PeaksInstance["player"];
    };
  }

  render() {
    return (
      <audio id={AUDIO_DOM_ELEMENT} controls hidden>
        {this.props.audioUrl ? (
          <source src={this.props.audioUrl} type="audio/mpeg" />
        ) : null}
        Your browser does not support the audio element.
      </audio>
    );
  }
}

const mapStateToProps = ({
  project,
  analysis,
  audio,
  wave
}: ApplicationState) => {
  return {
    audioUrl: project.audioUrl,
    sections: analysis.sections,
    measures: analysis.measures,
    zoomLevel: wave.zoom,
    status: project.status,
    syncFirstMeasureStart: project.syncFirstMeasureStart,
    isPlaying: audio.isPlaying,
    detune: audio.detune,
    playbackRate: audio.playbackRate,
    secondsPerMeasure:
      analysis.measures.byId["1"]?.time - analysis.measures.byId["0"]?.time,
    audioSampleRate: analysis.audioSampleRate
  };
};

const mapDispatchToProps = {
  initializedProject,
  updatedRhythm,
  triggeredPause
};
export default connect(mapStateToProps, mapDispatchToProps)(AudioManagement);
