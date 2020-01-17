import CircularProgress from "@material-ui/core/CircularProgress";
import React, { Component } from "react";
import { connect } from "react-redux";

import Log from "../../components/log/log";
import { hotReloaded, LoadingStatus } from "../../states/project/projectSlice";
import { ApplicationState } from "../../states/store";
import WaveView from "./waveView";

interface PropsFromState {
  audioLoaded: LoadingStatus;
  audioUrl: string;
}

interface PropsFromDispatch {
  hotReloaded: typeof hotReloaded;
}

interface Props {}

type AllProps = PropsFromState & PropsFromDispatch & Props;

class WaveContainer extends Component<AllProps> {
  constructor(props: AllProps) {
    super(props);

    if (process.env.NODE_ENV !== "production" && props.audioUrl) {
      Log.info("Hot reload with url=" + props.audioUrl, WaveContainer.name);
      this.props.hotReloaded();
    }
  }

  render() {
    Log.info(
      "render with props=" + JSON.stringify(this.props),
      WaveContainer.name
    );

    return (
      <div>
        {this.props.audioLoaded !== LoadingStatus.INITIALIZED && (
          <CircularProgress />
        )}
        <WaveView url={this.props.audioUrl} />
      </div>
    );
  }
}

const mapStateToProps = ({ project }: ApplicationState) => {
  return {
    audioUrl: project.audioUrl,
    audioLoaded: project.status
  };
};

const mapDispatchToProps = {
  hotReloaded
};

export default connect(mapStateToProps, mapDispatchToProps)(WaveContainer);
