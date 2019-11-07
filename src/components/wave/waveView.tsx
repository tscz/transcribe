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
