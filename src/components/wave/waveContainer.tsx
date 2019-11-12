import Peaks, { PeaksInstance } from "peaks.js";
import React, { Component } from "react";
import Spinner from "react-bootstrap/Spinner";
import { connect } from "react-redux";

import { Measure, Section } from "../../store/analysis/types";
import { ApplicationState } from "../../store/store";
import { LoadingStatus, ZOOMLEVELS } from "../../store/structure/types";
import WaveView from "./waveView";

interface PropsFromState {
  audioUrl: string;
  sections: Section[];
  measures: Measure[];
}

interface PropsFromDispatch {}

interface Props {
  onLoad: (peaks: PeaksInstance) => void;
  onLoadStart: () => void;
  zoomLevel: number;
  status: LoadingStatus;
}

type AllProps = PropsFromState & PropsFromDispatch & Props;

interface State {
  peaks: PeaksInstance | null;
}

class WaveContainer extends Component<AllProps, State> {
  constructor(props: AllProps) {
    super(props);

    this.state = {
      peaks: null
    };
  }

  componentDidMount() {
    this.initWave();
  }

  componentDidUpdate(prevProps: AllProps) {
    console.log("props=" + JSON.stringify(this.props));

    if (prevProps.audioUrl !== this.props.audioUrl) {
      if (this.state.peaks) this.state.peaks.destroy();
      this.initWave();
    }

    if (this.props.sections && this.state.peaks) {
      this.state.peaks.segments.removeAll();
      this.state.peaks.segments.add(this.props.sections);

      this.state.peaks.points.removeAll();
      this.state.peaks.points.add(this.props.measures);

      this.state.peaks.zoom.setZoom(this.props.zoomLevel);
    }
  }

  render() {
    console.log("render waveContainer");
    return (
      <div>
        {this.props.status !== LoadingStatus.INITIALIZED && (
          <Spinner animation="border" />
        )}
        <WaveView url={this.props.audioUrl} />
      </div>
    );
  }

  initWave() {
    // Create AudioContext dummy class for iOS audiocontext support
    var AudioContext =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    var audioContext = new AudioContext();

    var audioElement: Element = document!.getElementById("audio")!;
    (audioElement as HTMLAudioElement).src = this.props.audioUrl;

    var options = {
      containers: {
        zoomview: document!.getElementById("zoomview-container")!,
        overview: document!.getElementById("overview-container")!
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

    let onLoadHandler = (instance: PeaksInstance) => {
      this.props.onLoad(instance);
    };

    let setPeaksInstance = (instance: PeaksInstance) => {
      this.setState({ peaks: instance });
    };

    this.props.onLoadStart();
    Peaks.init(options, function(err, peaks) {
      //TODO: Error handling
      if (peaks !== undefined) {
        onLoadHandler(peaks);
        setPeaksInstance(peaks);
      }
    });
  }
}

const mapStateToProps = ({ project, analysis }: ApplicationState) => {
  return {
    audioUrl: project.audioUrl,
    sections: analysis.sections,
    measures: analysis.measures
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WaveContainer);
