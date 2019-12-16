import { MenuItem, Select, Tooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import LoopIcon from "@material-ui/icons/Loop";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import TimerIcon from "@material-ui/icons/Timer";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import React, { ReactElement } from "react";
import { connect } from "react-redux";

import ContentLayout from "../../components/contentLayout/contentLayout";
import View from "../../components/view/view";
import {
  addedSection,
  Section,
  updatedRhythm
} from "../../states/analysisSlice";
import { triggeredPause, triggeredPlay } from "../../states/audioSlice";
import { ApplicationState } from "../../states/store";
import { zoomedIn, zoomedOut } from "../../states/waveSlice";
import WaveContainer from "../../views/wave/waveContainer";
import WaveControlView from "../../views/waveControl/waveControlView";

interface PropsFromState {
  sections: Section[];
  zoom: number;
  isPlaying: boolean;
  loaded: boolean;
}

interface PropsFromDispatch {
  addedSection: typeof addedSection;
  zoomedIn: typeof zoomedIn;
  zoomedOut: typeof zoomedOut;
  updatedRhythm: typeof updatedRhythm;
  triggeredPlay: typeof triggeredPlay;
  triggeredPause: typeof triggeredPause;
}

interface Props {}

type AllProps = PropsFromState & PropsFromDispatch & Props;

class StructurePage extends React.Component<AllProps> {
  render() {
    console.log("render structurePage");
    return (
      <ContentLayout
        topLeft={
          <View
            header="Waveform"
            actions={
              <>
                {this.props.isPlaying ? (
                  <WaveformControlButton
                    title="Pause"
                    icon={<PauseIcon />}
                    onClick={this.props.triggeredPause}
                  />
                ) : (
                  <WaveformControlButton
                    title="Play"
                    icon={<PlayArrowIcon />}
                    onClick={this.props.triggeredPlay}
                  />
                )}
                <MeasureSwitch id="startMeasure" />
                <MeasureSwitch id="endMeasure" />

                <WaveformControlButton
                  title="Zoom in"
                  icon={<ZoomInIcon />}
                  onClick={this.props.zoomedIn}
                />
                <WaveformControlButton
                  title="Zoom out"
                  icon={<ZoomOutIcon />}
                  onClick={this.props.zoomedOut}
                />
                <WaveformControlButton title="Loop" icon={<LoopIcon />} />
                <WaveformControlButton title="Metronome" icon={<TimerIcon />} />
              </>
            }
            body={this.props.loaded ? <WaveContainer /> : <></>}
          ></View>
        }
        topRight={
          <View
            header={<>Properties</>}
            body={this.props.loaded ? <WaveControlView /> : <></>}
          ></View>
        }
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
      <IconButton onClick={props.onClick}>{props.icon}</IconButton>
    </Tooltip>
  );
};

const MeasureSwitch = (props: { id: string }) => {
  return (
    <Select id={props.id} value={0}>
      <MenuItem value={0}>0</MenuItem>
      <MenuItem value={1}>1</MenuItem>
      <MenuItem value={2}>2</MenuItem>
      <MenuItem value={3}>3</MenuItem>
    </Select>
  );
};

const mapStateToProps = ({
  analysis,
  audio,
  project,
  wave
}: ApplicationState) => {
  return {
    sections: analysis.sections,
    zoom: wave.zoom,
    status: audio.status,
    isPlaying: audio.isPlaying,
    loaded: project.loaded
  };
};

const mapDispatchToProps = {
  addedSection,
  zoomedIn,
  zoomedOut,
  updatedRhythm,
  triggeredPlay,
  triggeredPause
};
export default connect(mapStateToProps, mapDispatchToProps)(StructurePage);
