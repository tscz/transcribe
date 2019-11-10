import React, { Component } from "react";

interface Props {
  url: string;
}

export default class WaveView extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
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
