import CircularProgress from "@material-ui/core/CircularProgress";
import React, { Component } from "react";
import { connect } from "react-redux";

import { startedInit } from "../../states/audioSlice";
import { ApplicationState } from "../../states/store";
import WaveView from "./waveView";

interface PropsFromState {
  waveformLoaded: boolean;
  audioUrl: string;
}

interface PropsFromDispatch {
  startedInit: typeof startedInit;
}

interface Props {}

type AllProps = PropsFromState & PropsFromDispatch & Props;

class WaveContainer extends Component<AllProps> {
  componentDidMount() {
    this.props.startedInit();
  }

  componentDidUpdate(prevProps: AllProps) {
    console.log(
      "WaveContainer.componentDidUpdate with props=" +
        JSON.stringify(this.props)
    );

    if (prevProps.audioUrl !== this.props.audioUrl) {
      this.props.startedInit();
    }
  }

  render() {
    console.log("render waveContainer");
    return (
      <div>
        {!this.props.waveformLoaded && <CircularProgress />}
        <WaveView url={this.props.audioUrl} />
      </div>
    );
  }
}

const mapStateToProps = ({ project, wave }: ApplicationState) => {
  return {
    audioUrl: project.audioUrl,
    waveformLoaded: wave.isLoaded
  };
};

const mapDispatchToProps = {
  startedInit
};

export default connect(mapStateToProps, mapDispatchToProps)(WaveContainer);
