import { IconButton, Popover, Tooltip } from "@material-ui/core";
import LoopIcon from "@material-ui/icons/Loop";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import TimerIcon from "@material-ui/icons/Timer";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import React, { ReactElement } from "react";
import { connect } from "react-redux";

import ContentLayout from "../../components/contentLayout/contentLayout";
import Log from "../../components/log/log";
import View from "../../components/view/view";
import { triggeredPause, triggeredPlay } from "../../states/audio/audioSlice";
import { LoadingStatus } from "../../states/project/projectSlice";
import { ApplicationState } from "../../states/store";
import { zoomedIn, zoomedOut } from "../../states/wave/waveSlice";
import StructureView from "../../views/structure/structureView";
import StructureNavigationView from "../../views/structureNavigation/structureNavigationView";
import WaveContainer from "../../views/wave/waveContainer";
import WaveControlView from "../../views/waveControl/waveControlView";

interface PropsFromState {
  readonly loaded: boolean;
  readonly isPlaying: boolean;
}

interface PropsFromDispatch {
  zoomedIn: typeof zoomedIn;
  zoomedOut: typeof zoomedOut;
  triggeredPlay: typeof triggeredPlay;
  triggeredPause: typeof triggeredPause;
}

interface Props {}

type AllProps = PropsFromState & PropsFromDispatch & Props;

interface State {
  anchorEl: HTMLButtonElement | null;
}

class StructurePage extends React.Component<AllProps, State> {
  state: State = {
    anchorEl: null
  };

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    Log.info("render", StructurePage.name);
    return (
      <ContentLayout
        topLeft={
          <View
            title="Song Overview"
            body={<WaveContainer />}
            action={
              <>
                {this.props.isPlaying ? (
                  <WaveformControlButton
                    title="Pause"
                    icon={<PauseIcon />}
                    onClick={() => this.props.triggeredPause()}
                  />
                ) : (
                  <WaveformControlButton
                    title="Play"
                    icon={<PlayArrowIcon />}
                    onClick={() => this.props.triggeredPlay()}
                  />
                )}

                <WaveformControlButton title="Loop" icon={<LoopIcon />} />
                <WaveformControlButton
                  title="Metronome"
                  icon={<TimerIcon />}
                  onClick={e => this.handleClick(e)}
                />
                <Popover
                  style={{ height: "400px" }}
                  open={Boolean(this.state.anchorEl)}
                  anchorEl={this.state.anchorEl}
                  onClose={() => this.handleClose()}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left"
                  }}
                >
                  <WaveControlView></WaveControlView>
                </Popover>
                <WaveformControlButton
                  title="Zoom in"
                  icon={<ZoomInIcon />}
                  onClick={() => this.props.zoomedIn()}
                />
                <WaveformControlButton
                  title="Zoom out"
                  icon={<ZoomOutIcon />}
                  onClick={() => this.props.zoomedOut()}
                />
              </>
            }
          ></View>
        }
        topRight={
          <View title="Song Measures" body={<StructureNavigationView />}></View>
        }
        bottom={<View title="Song Structure" body={<StructureView />}></View>}
      ></ContentLayout>
    );
  }
}

const WaveformControlButton = (props: {
  title: string;
  icon: ReactElement;
  onClick?: (e?: any) => void;
}) => {
  return (
    <Tooltip title={props.title}>
      <IconButton
        onClick={props.onClick}
        size="small"
        style={{ marginTop: "8px", marginRight: "5px" }}
      >
        {props.icon}
      </IconButton>
    </Tooltip>
  );
};

const mapStateToProps = ({ project, audio }: ApplicationState) => {
  return {
    loaded: project.status === LoadingStatus.INITIALIZED,
    isPlaying: audio.isPlaying
  };
};

const mapDispatchToProps = {
  zoomedIn,
  zoomedOut,
  triggeredPlay,
  triggeredPause
};
export default connect(mapStateToProps, mapDispatchToProps)(StructurePage);
