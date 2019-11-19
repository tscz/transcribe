import { MenuItem, Select, Tooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import LoopIcon from "@material-ui/icons/Loop";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SpeedIcon from "@material-ui/icons/Speed";
import TimerIcon from "@material-ui/icons/Timer";
import React, { ReactElement } from "react";
import { connect } from "react-redux";

import WaveContainer from "../components/wave/waveContainer";
import { addSection, setRhythm } from "../store/analysis/actions";
import { Section } from "../store/analysis/types";
import {
  endInit,
  pause,
  play,
  startInit,
  zoomIn,
  zoomOut
} from "../store/audio/actions";
import { LoadingStatus } from "../store/audio/types";
import { ApplicationState } from "../store/store";
import View from "../views/view";
import WaveControlView from "../views/waveControlView";
import ContentLayout from "./contentLayout";

interface PropsFromState {
  sections: Section[];
  zoom: number;
  status: LoadingStatus;
  isPlaying: boolean;
}

interface PropsFromDispatch {
  addSection: typeof addSection;
  zoomIn: typeof zoomIn;
  zoomOut: typeof zoomOut;
  startInit: typeof startInit;
  endInit: typeof endInit;
  setRhythm: typeof setRhythm;
  play: typeof play;
  pause: typeof pause;
}

interface Props {
  url: string;
  audioContext: AudioContext;
}

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
                    onClick={this.props.pause}
                  />
                ) : (
                  <WaveformControlButton
                    title="Play"
                    icon={<PlayArrowIcon />}
                    onClick={this.props.play}
                  />
                )}
                <MeasureSwitch id="startMeasure" />
                <MeasureSwitch id="endMeasure" />
                <WaveformControlButton title="Loop" icon={<LoopIcon />} />
                <WaveformControlButton title="Pitch" icon={<MusicNoteIcon />} />
                <WaveformControlButton title="Speed" icon={<SpeedIcon />} />
                <WaveformControlButton title="Metronome" icon={<TimerIcon />} />
              </>
            }
            body={this.props.url ? <WaveContainer /> : <></>}
          ></View>
        }
        topRight={
          <View
            header={<>Properties</>}
            body={this.props.url ? <WaveControlView /> : <></>}
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

const mapStateToProps = ({ analysis, audio }: ApplicationState) => {
  return {
    sections: analysis.sections,
    zoom: audio.zoom,
    status: audio.status,
    isPlaying: audio.isPlaying
  };
};

const mapDispatchToProps = {
  addSection,
  zoomIn,
  zoomOut,
  startInit,
  endInit,
  setRhythm,
  play,
  pause
};
export default connect(mapStateToProps, mapDispatchToProps)(StructurePage);
