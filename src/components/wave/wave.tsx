import Peaks, { PeaksInstance } from "peaks.js";
import React, { Component } from "react";
import Button from "react-bootstrap/Button";
export default class Wave extends Component<{ url: string }, {}> {
  componentDidUpdate() {
    console.log("initWave()");
    this.initWave();
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return nextProps.url !== this.props.url;
  }

  render() {
    console.log("this.props.src=" + this.props.url);
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
    Peaks.init(options, function(err, peaksInstance) {
      console.log("Peaks instance ready");
    });
  }
}
