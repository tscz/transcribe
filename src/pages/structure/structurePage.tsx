import { IconButton, Tooltip } from "@material-ui/core";
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
import { triggeredPause, triggeredPlay } from "../../states/audioSlice";
import { LoadingStatus } from "../../states/projectSlice";
import { ApplicationState } from "../../states/store";
import { zoomedIn, zoomedOut } from "../../states/waveSlice";
import StructureView from "../../views/structure/structureView";
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

class StructurePage extends React.Component<AllProps> {
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
                <WaveformControlButton title="Metronome" icon={<TimerIcon />} />

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
          <View title="Playback Settings" body={<WaveControlView />}></View>
        }
        bottom={<View title="Song Structure" body={<StructureView />}></View>}
      ></ContentLayout>
    );
  }
}

const WaveformControlButton = (props: {
  title: string;
  icon: ReactElement;
  onClick?: () => void;
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
