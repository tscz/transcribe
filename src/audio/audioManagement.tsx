import Peaks, { PeaksInstance } from "peaks.js";
import React from "react";
import { connect } from "react-redux";

import { setRhythm } from "../store/analysis/actions";
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
}

interface PropsFromDispatch {
  startRender: typeof startRender;
  endInit: typeof endInit;
  setRhythm: typeof setRhythm;
}

interface Props {
  audioContext: AudioContext;
}

type AllProps = PropsFromState & PropsFromDispatch & Props;

class AudioManagement extends React.Component<AllProps> {
  peaks: Peaks.PeaksInstance | undefined;

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
        this.initWave();
        break;
    }

    if (this.props.sections && this.peaks) {
      this.peaks.segments.removeAll();
      this.peaks.segments.add(this.props.sections);

      this.peaks.points.removeAll();
      this.peaks.points.add(this.props.measures);

      this.peaks.zoom.setZoom(this.props.zoomLevel);
    }

    /*     if (props.events.length) {
      props.events.forEach(this.processEvent.bind(this));

      props.dispatch({
        type: "CLEAR_EVENT_QUEUE"
      });
    } */
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
        scale: 128,
        multiChannel: false
      },
      keyboard: true,
      pointMarkerColor: "#006eb0",
      showPlayheadTime: true,
      zoomLevels: ZOOMLEVELS
    };

    let finish = () => {
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
    syncFirstMeasureStart: project.syncFirstMeasureStart
  };
};

const mapDispatchToProps = {
  startRender,
  endInit,
  setRhythm
};
export default connect(mapStateToProps, mapDispatchToProps)(AudioManagement);

export const AUDIO_DOM_ELEMENT = "audio_dom_element";

export const ZOOMVIEW_CONTAINER = "zoomview-container";
export const OVERVIEW_CONTAINER = "overview-container";
