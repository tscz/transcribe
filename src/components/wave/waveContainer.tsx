import Peaks, { PeaksInstance, SegmentAddOptions } from "peaks.js";
import React, { Component } from "react";
import { connect } from "react-redux";

import { initPeaks } from "../../store/project/actions";
import { ApplicationState } from "../../store/store";
import WaveView from "./waveView";

interface PropsFromState {
  peaks: PeaksInstance | null;
  segments: SegmentAddOptions[];
}

interface PropsFromDispatch {
  initPeaks: typeof initPeaks;
}

interface Props {
  url: string;
}

type AllProps = PropsFromState & PropsFromDispatch & Props;

class WaveContainer extends Component<AllProps> {
  componentDidMount() {
    this.initWave();
  }

  componentDidUpdate(prevProps: AllProps) {
    if (prevProps.url !== this.props.url) {
      if (this.props.peaks !== null && this.props.peaks !== undefined)
        this.props.peaks.destroy();
      this.initWave();
    }

    if (this.props.segments && this.props.peaks) {
      this.props.peaks.segments.removeAll();
      this.props.peaks.segments.add(this.props.segments);
    }
  }

  render() {
    console.log("render waveContainer");
    return (
      <div>
        <WaveView url={this.props.url} />
      </div>
    );
  }

  initWave() {
    // Create AudioContext dummy class for iOS audiocontext support
    var AudioContext =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    var audioContext = new AudioContext();

    var audioElement: Element = document!.getElementById("audio")!;
    (audioElement as HTMLAudioElement).src = this.props.url;

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
      zoomLevels: [128, 256, 512, 1024, 2048, 4096]
    };

    let savepeaksInGlobalState = (instance: PeaksInstance) => {
      this.props.initPeaks(instance);
    };

    Peaks.init(options, function(err, peaks) {
      if (peaks !== undefined) savepeaksInGlobalState(peaks);
    });
  }
}

const mapStateToProps = ({ project, analysis }: ApplicationState) => {
  return {
    peaks: project.peaks,
    segments: analysis.segments
  };
};

const mapDispatchToProps = {
  initPeaks
};

export default connect(mapStateToProps, mapDispatchToProps)(WaveContainer);
