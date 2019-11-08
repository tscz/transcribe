import Peaks, { PeaksInstance, SegmentAddOptions } from "peaks.js";
import React, { Component } from "react";
import { connect } from "react-redux";
import { initPeaks } from "../../redux/actions";
import WaveView from "./waveView";

class WaveContainer extends Component<
  {
    url: string;
    peaksInstance?: PeaksInstance;
    initPeaks: (instance: PeaksInstance) => void;
    segments?: SegmentAddOptions[];
  },
  {}
> {
  componentDidMount() {
    this.initWave();
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.url !== this.props.url) {
      if (
        this.props.peaksInstance !== null &&
        this.props.peaksInstance !== undefined
      )
        this.props.peaksInstance.destroy();
      this.initWave();
    }

    if (this.props.segments && this.props.peaksInstance) {
      this.props.peaksInstance.segments.removeAll();
      this.props.peaksInstance.segments.add(this.props.segments);
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

    let savePeaksInstanceInGlobalState = (instance: PeaksInstance) => {
      this.props.initPeaks(instance);
    };

    Peaks.init(options, function(err, peaksInstance) {
      if (peaksInstance !== undefined)
        savePeaksInstanceInGlobalState(peaksInstance);
    });
  }
}

const mapStateToProps = (state: any) => {
  return {
    peaksInstance: state.peaks,
    segments: state.segments
  };
};

const mapDispatchToProps = {
  initPeaks
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WaveContainer);
