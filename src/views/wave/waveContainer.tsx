import CircularProgress from "@material-ui/core/CircularProgress";
import Log from "components/log/log";
import { Measures, Sections } from "model/model";
import React, { Component } from "react";
import { connect } from "react-redux";
import { updateWaveform } from "states/middleware/audioMiddleware";
import { hotReloaded, LoadingStatus } from "states/project/projectSlice";
import { ApplicationState } from "states/store";

import WaveView from "./waveView";

interface PropsFromState {
  status: LoadingStatus;
  sections: Sections;
  measures: Measures;
  audioUrl: string;
}

interface PropsFromDispatch {
  hotReloaded: typeof hotReloaded;
  updateWaveform: typeof updateWaveform;
}

type AllProps = PropsFromState & PropsFromDispatch;

class WaveContainer extends Component<AllProps> {
  constructor(props: AllProps) {
    super(props);

    if (process.env.NODE_ENV !== "production" && props.audioUrl) {
      Log.info("Hot reload with url=" + props.audioUrl, WaveContainer.name);
      this.props.hotReloaded();
    }
  }

  componentDidUpdate(prevProps: AllProps) {
    if (
      prevProps.sections !== this.props.sections ||
      prevProps.measures !== this.props.measures
    ) {
      this.props.updateWaveform({
        sections: this.props.sections,
        measures: this.props.measures
      });
    }
  }

  render() {
    Log.info("render", WaveContainer.name);

    return (
      <div>
        {this.props.status !== LoadingStatus.INITIALIZED && (
          <CircularProgress />
        )}
        <WaveView />
      </div>
    );
  }
}

const mapStateToProps = ({ project, analysis }: ApplicationState) => {
  return {
    status: project.status,
    sections: analysis.sections,
    measures: analysis.measures,
    audioUrl: project.audioUrl
  };
};

const mapDispatchToProps = {
  hotReloaded,
  updateWaveform: updateWaveform
};

export default connect(mapStateToProps, mapDispatchToProps)(WaveContainer);
