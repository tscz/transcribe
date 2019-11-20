import Peaks, { PeaksInstance } from "peaks.js";
import React from "react";
import { connect } from "react-redux";
import Tone from "tone";

import { setLength, setRhythm } from "../store/analysis/actions";
import { Measure, Section } from "../store/analysis/types";
import { endInit, pause, startRender } from "../store/audio/actions";
import { LoadingStatus, ZOOMLEVELS } from "../store/audio/types";
import { ApplicationState } from "../store/store";
import AudioPlayer from "./audioPlayer";

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
}

interface PropsFromDispatch {
  startRender: typeof startRender;
  endInit: typeof endInit;
  setRhythm: typeof setRhythm;
  setLength: typeof setLength;
  pause: typeof pause;
}

interface Props {
  audioContext: AudioContext;
}

type AllProps = PropsFromState & PropsFromDispatch & Props;

class AudioManagement extends React.Component<AllProps> {
  peaks: Peaks.PeaksInstance | undefined;
  player: AudioPlayer | undefined;
  audioBuffer: AudioBuffer | undefined;
  pitchShift: Tone.PitchShift | undefined;

  componentDidUpdate(prevProps: AllProps) {
    console.log(
      "AudioManagement.componentDidUpdate with status " + this.props.status
    );

    if (prevProps.status !== this.props.status) {
      switch (this.props.status) {
        case LoadingStatus.NOT_INITIALIZED:
        case LoadingStatus.RENDERING:
          return;
        case LoadingStatus.INITIALIZING:
          this.props.startRender();
          if (this.peaks) this.peaks.destroy();
          this.getData();
          break;
      }
    }

    this.repaintWave();

    if (prevProps.playbackRate !== this.props.playbackRate && this.player) {
      this.player.setPlaybackRate(this.props.playbackRate);
    }

    if (prevProps.detune !== this.props.detune && this.player) {
      this.player.setDetune(this.props.detune);
    }

    if (prevProps.isPlaying !== this.props.isPlaying && this.peaks) {
      if (this.props.isPlaying) {
        this.peaks.player.play();
      } else {
        this.peaks.player.pause();
      }
    }
  }

  private repaintWave() {
    if (this.props.sections && this.peaks) {
      this.peaks.segments.removeAll();
      this.peaks.segments.add(this.props.sections);
      this.peaks.points.removeAll();
      this.peaks.points.add(this.props.measures);
      this.peaks.zoom.setZoom(this.props.zoomLevel);
    }
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

  getData = () => {
    const audioCtx = this.props.audioContext;

    //@ts-ignore because setContext is not defined in TS definition of Tone.js
    Tone.setContext(audioCtx);

    const initWave2 = (audioBuffer: AudioBuffer) => {
      this.audioBuffer = audioBuffer;
      this.props.setLength(audioBuffer.duration);
      this.initWave();
    };

    fetch(this.props.audioUrl)
      .then(function(response) {
        return response.arrayBuffer();
      })
      .then(function(buffer) {
        return audioCtx.decodeAudioData(buffer);
      })
      .then(function(audioBuffer) {
        initWave2(audioBuffer);
      });
  };

  initWave() {
    console.log("initWave()");

    let mediaelement = document!.getElementById(
      AUDIO_DOM_ELEMENT
    )! as HTMLAudioElement;
    mediaelement.src = this.props.audioUrl;

    var options = {
      containers: {
        zoomview: document!.getElementById(ZOOMVIEW_CONTAINER)!,
        overview: document!.getElementById(OVERVIEW_CONTAINER)!
      },
      mediaElement: mediaelement,
      webAudio: {
        audioBuffer: this.audioBuffer,
        scale: 128,
        multiChannel: false
      },
      keyboard: true,
      pointMarkerColor: "#006eb0",
      showPlayheadTime: true,
      zoomLevels: ZOOMLEVELS
    };

    let finish = () => {
      this.props.setRhythm({});
      this.props.endInit();
    };

    let setPeaksInstance = (instance: PeaksInstance) => {
      this.peaks = instance;
    };

    let updateFirstMeasureStart = (time: number) => {
      if (this.props.syncFirstMeasureStart)
        this.props.setRhythm({ firstMeasureStart: time });
    };

    let getBuffer = () => {
      return this.audioBuffer;
    };

    let replacePlayer = (peaks: Peaks.PeaksInstance) => {
      this.player = new AudioPlayer(peaks, getBuffer()!, () =>
        this.props.pause()
      );

      //@ts-ignore
      peaks.player.destroy();
      //@ts-ignore
      peaks.player = this.player;
    };

    Peaks.init(options, function(err, peaks) {
      //TODO: Error handling
      if (peaks !== undefined) {
        replacePlayer(peaks);

        peaks.on("player_seek", updateFirstMeasureStart);

        setPeaksInstance(peaks);
        finish();
      }
    });
  }
}

const mapStateToProps = ({ project, analysis, audio }: ApplicationState) => {
  return {
    audioUrl: project.audioUrl,
    sections: analysis.sections,
    measures: analysis.measures,
    zoomLevel: audio.zoom,
    status: audio.status,
    firstMeasureStart: analysis.firstMeasureStart,
    syncFirstMeasureStart: project.syncFirstMeasureStart,
    isPlaying: audio.isPlaying,
    detune: audio.detune,
    playbackRate: audio.playbackRate
  };
};

const mapDispatchToProps = {
  startRender,
  endInit,
  setRhythm,
  setLength,
  pause
};
export default connect(mapStateToProps, mapDispatchToProps)(AudioManagement);

export const AUDIO_DOM_ELEMENT = "audio_dom_element";

export const ZOOMVIEW_CONTAINER = "zoomview-container";
export const OVERVIEW_CONTAINER = "overview-container";
