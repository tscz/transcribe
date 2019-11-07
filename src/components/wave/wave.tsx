import Peaks, { PeaksInstance } from "peaks.js";
import React, { Component } from "react";
import { connect } from "react-redux";
import { initPeaks } from "../../redux/actions";

class Wave extends Component<
  { url: string; initPeaks: (instance: PeaksInstance) => void },
  {}
> {
  componentDidMount() {
    console.log("mountWave()");
    this.initWave();
  }

  componentDidUpdate() {
    console.log("initWave()");
    this.initWave();
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return nextProps.url !== this.props.url;
  }

  render() {
    console.log("renderWave()");
    return (
      <div>
        <div id="waveform-container">
          <div id="zoomview-container"></div>
          <div id="overview-container"></div>
        </div>
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
      console.log("initPeaks=" + this.props.initPeaks);
      this.props.initPeaks(instance);
    };

    Peaks.init(options, function(err, peaksInstance) {
      console.log("Peaks instance ready");
      if (peaksInstance !== undefined)
        savePeaksInstanceInGlobalState(peaksInstance);
    });
  }
}

const mapStateToProps = (state: any) => {
  return {
    peaksInstance: state.peaksInstance
  };
};

const mapDispatchToProps = {
  initPeaks
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wave);
