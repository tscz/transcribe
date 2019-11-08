import React, { Component } from "react";

export default class WaveView extends Component<
  {
    url: string;
  },
  {}
> {
  shouldComponentUpdate(nextProps: any, nextState: any) {
    return nextProps.url !== this.props.url;
  }

  render() {
    console.log("render waveView with url=" + this.props.url);
    return (
      <div>
        <div id="waveform-container">
          <div id="zoomview-container"></div>
          <div id="overview-container"></div>
        </div>
      </div>
    );
  }
}
