import Peaks, { PeaksInstance } from "peaks.js";
import React from "react";
import { connect } from "react-redux";

import { setLength, setRhythm } from "../store/analysis/actions";
import { Measure, Section } from "../store/analysis/types";
import { endInit, startRender } from "../store/audio/actions";
import { LoadingStatus, ZOOMLEVELS } from "../store/audio/types";
import { ApplicationState } from "../store/store";

interface PropsFromState {
  audioUrl: string;
  status: LoadingStatus;
  sections: Section[];
  measures: Measure[];
  zoomLevel: number;
  firstMeasureStart: number;
  syncFirstMeasureStart: boolean;
  isPlaying: boolean;
}

interface PropsFromDispatch {
  startRender: typeof startRender;
  endInit: typeof endInit;
  setRhythm: typeof setRhythm;
  setLength: typeof setLength;
}

interface Props {
  audioContext: AudioContext;
}

type AllProps = PropsFromState & PropsFromDispatch & Props;

class AudioManagement extends React.Component<AllProps> {
  peaks: Peaks.PeaksInstance | undefined;
  audioBuffer: AudioBuffer | undefined;

  componentDidUpdate(prevProps: AllProps) {
    console.log(
      "AudioManagement.componentDidUpdate with " + JSON.stringify(this.props)
    );

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

    this.repaintWave();

    if (prevProps.isPlaying !== this.props.isPlaying && this.peaks) {
      if (this.props.isPlaying) {
        this.peaks.player.play();
      } else {
        this.peaks.player.pause();
      }
    }

    /*     if (props.events.length) {
      props.events.forEach(this.processEvent.bind(this));

      props.dispatch({
        type: "CLEAR_EVENT_QUEUE"
      });
    } */
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

  processEvent(event: any) {
    switch (event.type) {
      case "NOTE_ON":
        break;
      case "NOTE_OFF":
        break;
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
    var audioElement: Element = document!.getElementById(AUDIO_DOM_ELEMENT)!;
    (audioElement as HTMLAudioElement).src = this.props.audioUrl;

    let audioContext = this.props.audioContext;

    var options = {
      containers: {
        zoomview: document!.getElementById(ZOOMVIEW_CONTAINER)!,
        overview: document!.getElementById(OVERVIEW_CONTAINER)!
      },
      mediaElement: audioElement,
      webAudio: {
        audioContext: audioContext,
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

    Peaks.init(options, function(err, peaks) {
      //TODO: Error handling
      if (peaks !== undefined) {
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
    isPlaying: audio.isPlaying
  };
};

const mapDispatchToProps = {
  startRender,
  endInit,
  setRhythm,
  setLength
};
export default connect(mapStateToProps, mapDispatchToProps)(AudioManagement);

export const AUDIO_DOM_ELEMENT = "audio_dom_element";

export const ZOOMVIEW_CONTAINER = "zoomview-container";
export const OVERVIEW_CONTAINER = "overview-container";
