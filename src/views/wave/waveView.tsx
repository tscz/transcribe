import Log from "components/log/log";
import React, { Component } from "react";
import {
  OVERVIEW_CONTAINER,
  ZOOMVIEW_CONTAINER
} from "states/middleware/peaksConfig";

export default class WaveView extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    Log.info("render", WaveView.name);
    return (
      <div id="waveform-container">
        <div id={ZOOMVIEW_CONTAINER}></div>
        <div id={OVERVIEW_CONTAINER}></div>
      </div>
    );
  }
}
