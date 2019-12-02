import React, { Component } from "react";

import {
  OVERVIEW_CONTAINER,
  ZOOMVIEW_CONTAINER
} from "../../features/audio/peaksConfig";

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
          <div id={ZOOMVIEW_CONTAINER}></div>
          <div id={OVERVIEW_CONTAINER}></div>
        </div>
      </div>
    );
  }
}
