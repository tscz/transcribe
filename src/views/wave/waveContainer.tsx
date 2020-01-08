import CircularProgress from "@material-ui/core/CircularProgress";
import React, { Component } from "react";
import { connect } from "react-redux";

import { LoadingStatus } from "../../states/projectSlice";
import { ApplicationState } from "../../states/store";
import WaveView from "./waveView";

interface PropsFromState {
  audioLoaded: LoadingStatus;
  audioUrl: string;
}

interface PropsFromDispatch {}

interface Props {}

type AllProps = PropsFromState & PropsFromDispatch & Props;

class WaveContainer extends Component<AllProps> {
  render() {
    console.log(
      "render waveContainer  with props=" + JSON.stringify(this.props)
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WaveContainer);
