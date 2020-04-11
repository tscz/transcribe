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
import PeaksConfig, { AUDIO_DOM_ELEMENT } from "./peaksConfig";

interface PropsFromState {
  audioUrl: string;
  status: LoadingStatus;
  sections: NormalizedObjects<Section>;
  measures: NormalizedObjects<Measure>;
  syncFirstMeasureStart: boolean;
  isPlaying: boolean;
  detune: number;
  playbackRate: number;
  secondsPerMeasure: number;
  audioSampleRate: number;
  isLooping: boolean;
  loopStart: number;
  loopEnd: number;
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
      this.repaintWaveform(
        this.props.sections,
        this.props.measures,
        this.props.secondsPerMeasure
      );
    }

    if (
      prevProps.sections !== this.props.sections ||
      prevProps.measures !== this.props.measures
    ) {
      this.repaintWaveform(
        this.props.sections,
        this.props.measures,
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

    if (
      prevProps.loopStart !== this.props.loopStart ||
      prevProps.loopEnd !== this.props.loopEnd
    ) {
      this.setZoom(this.props.loopStart, this.props.loopEnd);
    }
  }

  private repaintWaveform(
    sections: NormalizedObjects<Section>,
    measures: NormalizedObjects<Measure>,
    timePerMeasure: number
  ) {
    this.getPeaks()?.segments.removeAll();
    this.getPeaks()?.segments.add(
      PeaksConfig.sectionsToSegment(sections, measures, timePerMeasure)
    );
    this.getPeaks()?.points.removeAll();
    this.getPeaks()?.points.add(PeaksConfig.measuresToPoints(measures));
  }

  private init = () => {
    const audioCtx: AudioContext = (Tone.context as unknown) as AudioContext;

    this.getPeaks()?.destroy();

    // Load audioFile into audio buffer
    fetch(this.props.audioUrl)
      .then((response) => response.arrayBuffer())
      .then((buffer) => audioCtx.decodeAudioData(buffer))
      .then((audioBuffer) => this.initPeaks(audioBuffer));
  };

  private initPeaks(audioBuffer: AudioBuffer) {
    Log.info("init peaks", AudioManagement.name);

    Peaks.init(PeaksConfig.create(audioBuffer), (err, peaks) => {
      if (err) throw err;
      if (peaks === undefined)
        throw new Error("Peaks instance is not correctly initialized.");

      initPlayer(peaks, audioBuffer);
      replacePlayer(peaks);

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

    const initPlayer = (
      peaks: Peaks.PeaksInstance,
      audioBuffer: AudioBuffer
    ) => {
      this.player = new AudioPlayer(peaks, audioBuffer, () =>
        this.props.triggeredPause()
      );
    };

    const replacePlayer = (peaks: Peaks.PeaksInstance) => {
      ((peaks.player as unknown) as { destroy: () => void }).destroy();
      peaks.player = (this.player as unknown) as PeaksInstance["player"];
    };
  }

  private setZoom(start: number, end: number) {
    const zoomview: Peaks.WaveformView = this.getPeaks()?.views.getView(
      "zoomview"
    )!;
    const duration = end - start;
    zoomview.setZoom({ seconds: duration });
    zoomview.setStartTime(start);
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

const mapStateToProps = ({ project, analysis, audio }: ApplicationState) => {
  return {
    audioUrl: project.audioUrl,
    sections: analysis.sections,
    measures: analysis.measures,
    status: project.status,
    syncFirstMeasureStart: project.syncFirstMeasureStart,
    isPlaying: audio.isPlaying,
    detune: audio.detune,
    playbackRate: audio.playbackRate,
    secondsPerMeasure:
      analysis.measures.byId["1"]?.time - analysis.measures.byId["0"]?.time,
    audioSampleRate: analysis.audioSampleRate,
    isLooping: audio.isLooping,
    loopStart: audio.loopStart,
    loopEnd: audio.loopEnd
  };
};

const mapDispatchToProps = {
  initializedProject,
  updatedRhythm,
  triggeredPause
};
export default connect(mapStateToProps, mapDispatchToProps)(AudioManagement);
