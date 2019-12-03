import Peaks, { PeaksInstance } from "peaks.js";
import React from "react";
import { connect } from "react-redux";
import Tone from "tone";

import { ApplicationState } from "../../app/store";
import {
  Measure,
  Section,
  updatedRhythm,
  updatedSource
} from "../analysis/analysisSlice";
import { initializedWaveform } from "../wave/waveSlice";
import AudioPlayer from "./audioPlayer";
import {
  computeZoomLevels,
  endedInit,
  LoadingStatus,
  triggeredPause
} from "./audioSlice";
import PeaksOptions, {
  AUDIO_DOM_ELEMENT,
  ZOOMVIEW_CONTAINER
} from "./peaksConfig";

interface PropsFromState {
  audioUrl: string;
  status: LoadingStatus;
  sections: Section[];
  measures: Measure[];
  zoomLevel: number;
  firstMeasureStart: number;
  syncFirstMeasureStart: boolean;
  isPlaying: boolean;
  detune: number;
  playbackRate: number;
  secondsPerMeasure: number;
  audioSampleRate: number;
}

interface PropsFromDispatch {
  endedInit: typeof endedInit;
  updatedRhythm: typeof updatedRhythm;
  updatedSource: typeof updatedSource;
  triggeredPause: typeof triggeredPause;
  initializedWaveform: typeof initializedWaveform;
}

interface Props {}

type AllProps = PropsFromState & PropsFromDispatch & Props;

class AudioManagement extends React.Component<AllProps> {
  peaks: Peaks.PeaksInstance | undefined;
  player: AudioPlayer | undefined;

  componentDidUpdate(prevProps: AllProps) {
    console.log(
      "AudioManagement.componentDidUpdate with status " + this.props.status
    );

    // Initialize audio
    if (prevProps.status !== this.props.status) {
      switch (this.props.status) {
        case LoadingStatus.NOT_INITIALIZED:
          return;
        case LoadingStatus.INITIALIZING:
          console.log("Initialize audio engine.");
          if (this.peaks) this.peaks.destroy();
          this.initAudioManagement(this);
          break;
      }
    }

    this.recomputeZoomlevels();
    this.repaintWaveform();

    if (prevProps.playbackRate !== this.props.playbackRate && this.player) {
      this.player.setPlaybackRate(this.props.playbackRate);
    }

    if (prevProps.detune !== this.props.detune && this.player) {
      this.player.setDetune(this.props.detune);
    }

    if (prevProps.isPlaying !== this.props.isPlaying && this.player) {
      if (this.props.isPlaying) {
        this.player.play();
      } else {
        this.player.pause();
      }
    }
  }

  private recomputeZoomlevels() {
    if (!this.peaks) return;

    //TODO: Ignored because setZoomlevel is not API. See https://github.com/bbc/peaks.js/issues/295.
    //@ts-ignore
    this.peaks.zoom.setZoomLevels(
      computeZoomLevels(
        this.props.secondsPerMeasure,
        this.props.audioSampleRate,
        document.getElementById(ZOOMVIEW_CONTAINER)!.clientWidth,
        this.props.measures.length
      )
    );
  }

  private repaintWaveform() {
    if (this.props.sections && this.peaks) {
      this.peaks.segments.removeAll();
      this.peaks.segments.add(this.props.sections);
      this.peaks.points.removeAll();
      this.peaks.points.add(this.props.measures);
      this.peaks.zoom.setZoom(this.props.zoomLevel);
    }
  }

  private initAudioManagement = (audio: AudioManagement) => {
    const audioCtx: AudioContext = (Tone.context as unknown) as AudioContext;

    // Load mp3 into audio buffer
    fetch(this.props.audioUrl)
      .then(function(response) {
        return response.arrayBuffer();
      })
      .then(function(buffer) {
        return audioCtx.decodeAudioData(buffer);
      })
      .then(function(audioBuffer) {
        audio.props.updatedSource({
          audioLength: audioBuffer.duration,
          audioSampleRate: audioBuffer.sampleRate
        });
        audio.initPeaks(audio, audioBuffer);
      });
  };

  private initPeaks(audio: AudioManagement, audioBuffer: AudioBuffer) {
    console.log("initPeaks()");

    Peaks.init(PeaksOptions.create(audioBuffer), function(err, peaks) {
      //TODO: Error handling
      if (peaks !== undefined) {
        initPlayer(peaks, audioBuffer);
        replacePlayer(peaks, audioBuffer);

        peaks.on("player_seek", (time: number) => {
          if (audio.props.syncFirstMeasureStart)
            audio.props.updatedRhythm({ firstMeasureStart: time });
        });

        audio.peaks = peaks;

        audio.props.updatedRhythm({});
        audio.props.endedInit();
        audio.props.initializedWaveform();
      }
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
      //@ts-ignore
      peaks.player.destroy();
      //@ts-ignore
      peaks.player = this.player;
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
    status: audio.status,
    firstMeasureStart: analysis.firstMeasureStart,
    syncFirstMeasureStart: project.syncFirstMeasureStart,
    isPlaying: audio.isPlaying,
    detune: audio.detune,
    playbackRate: audio.playbackRate,
    secondsPerMeasure: analysis.secondsPerMeasure,
    audioSampleRate: analysis.audioSampleRate
  };
};

const mapDispatchToProps = {
  endedInit,
  updatedRhythm,
  updatedSource,
  triggeredPause,
  initializedWaveform
};
export default connect(mapStateToProps, mapDispatchToProps)(AudioManagement);
