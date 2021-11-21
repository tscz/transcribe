import { createStyles, WithStyles, withStyles } from "@material-ui/core";
import Log from "components/log/log";
import React, { Component } from "react";
import {
  OVERVIEW_CONTAINER,
  ZOOMVIEW_CONTAINER
} from "states/middleware/peaksConfig";

const styles = () =>
  createStyles({
    zoomview: {
      height: "150px",
      maxHeight: "400px"
    },
    overview: {
      marginTop: "30px",
      height: "50px"
    }
  });

class WaveView extends Component<WithStyles<typeof styles>> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    Log.info("render", WaveView.name);
    return (
      <div>
        <div id="waveform-container">
          <div
            id={ZOOMVIEW_CONTAINER}
            className={this.props.classes.zoomview}
          ></div>
          <div
            id={OVERVIEW_CONTAINER}
            className={this.props.classes.overview}
          ></div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(WaveView);
