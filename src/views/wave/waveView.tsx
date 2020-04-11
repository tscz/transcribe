import React, { Component } from "react";

import {
  OVERVIEW_CONTAINER,
  ZOOMVIEW_CONTAINER
} from "../../components/audioManagement/peaksConfig";
import Log from "../../components/log/log";

interface Props {
  url: string;
}

export default class WaveView extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return nextProps.url !== this.props.url;
  }

  render() {
    Log.info("render with url=" + this.props.url, WaveView.name);
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
