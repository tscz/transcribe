import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  NativeSelect,
  Popover,
  Tooltip
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import BorderLeftIcon from "@material-ui/icons/BorderLeft";
import LoopIcon from "@material-ui/icons/Loop";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SpeedIcon from "@material-ui/icons/Speed";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import TimerIcon from "@material-ui/icons/Timer";
import ToggleButton from "@material-ui/lab/ToggleButton";
import React, { ReactElement } from "react";
import { connect } from "react-redux";

import ContentLayout from "../../components/contentLayout/contentLayout";
import Log from "../../components/log/log";
import SliderInput from "../../components/sliderInput/sliderInput";
import View from "../../components/view/view";
import {
  TimeSignatureType,
  updatedRhythm
} from "../../states/analysis/analysisSlice";
import { toTimeSignatureType } from "../../states/analysis/analysisUtil";
import {
  triggeredPause,
  triggeredPlay,
  updatedPlaybackSettings
} from "../../states/audio/audioSlice";
import { DialogType, openedDialog } from "../../states/dialog/dialogsSlice";
import {
  enabledSyncFirstMeasureStart,
  LoadingStatus
} from "../../states/project/projectSlice";
import { ApplicationState } from "../../states/store";
import StructureView from "../../views/structure/structureView";
import StructureNavigationView from "../../views/structureNavigation/structureNavigationView";
import WaveContainer from "../../views/wave/waveContainer";

interface PropsFromState {
  readonly loaded: boolean;
  readonly isPlaying: boolean;
  readonly syncFirstMeasureStart: boolean;
  readonly firstMeasureStart: number;
  readonly timeSignature: TimeSignatureType;
  readonly bpm: number;
  readonly detune: number;
  readonly playbackRate: number;
}

interface PropsFromDispatch {
  triggeredPlay: typeof triggeredPlay;
  triggeredPause: typeof triggeredPause;
  enabledSyncFirstMeasureStart: typeof enabledSyncFirstMeasureStart;
  updatedRhythm: typeof updatedRhythm;
  updatedPlaybackSettings: typeof updatedPlaybackSettings;
  openedDialog: typeof openedDialog;
}

interface Props {}

type AllProps = PropsFromState & PropsFromDispatch & Props;

interface State {
  anchorEl: HTMLButtonElement | null;
  activePopover: PopoverType;
}

enum PopoverType {
  RHYTHM,
  PLAYBACKRATE,
  DETUNE,
  STARTMEASURE,
  NONE
}

class StructurePage extends React.Component<AllProps, State> {
  state: State = {
    anchorEl: null,
    activePopover: PopoverType.NONE
  };

  handlePopoverOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    type: PopoverType
  ) => {
    this.setState({ anchorEl: event.currentTarget, activePopover: type });
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null, activePopover: PopoverType.NONE });
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

                <WaveformControlButton
                  title="Loop"
                  icon={<LoopIcon />}
                  disabled={true}
                />
                <WaveformControlButton
                  title="Rhythm & Metronome"
                  icon={<TimerIcon />}
                  onClick={(e) => this.handlePopoverOpen(e, PopoverType.RHYTHM)}
                  disabled={false}
                />
                <WaveformControlButton
                  title="Playback Rate"
                  icon={<SpeedIcon />}
                  onClick={(e) =>
                    this.handlePopoverOpen(e, PopoverType.PLAYBACKRATE)
                  }
                  disabled={false}
                />
                <WaveformControlButton
                  title="Detune"
                  icon={<MusicNoteIcon />}
                  onClick={(e) => this.handlePopoverOpen(e, PopoverType.DETUNE)}
                  disabled={false}
                />
                <Popover
                  style={{ height: "400px" }}
                  open={this.state.activePopover !== PopoverType.NONE}
                  anchorEl={this.state.anchorEl}
                  onClose={() => this.handlePopoverClose()}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                  }}
                  anchorPosition={{ top: 50, left: 0 }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                  }}
                >
                  {this.state.activePopover !== PopoverType.NONE && (
                    <div
                      style={{
                        width: "200px",
                        minHeight: "50px",
                        margin: "10px",
                        marginTop: "20px"
                      }}
                    >
                      {PopoverContent(this.state.activePopover, this.props)}
                    </div>
                  )}
                </Popover>
              </>
            }
          ></View>
        }
        topRight={
          <View title="Song Measures" body={<StructureNavigationView />}></View>
        }
        bottom={
          <View
            title="Song Structure"
            action={
              <>
                <WaveformControlButton
                  title="Start Measure 0"
                  icon={<BorderLeftIcon />}
                  onClick={(e) =>
                    this.handlePopoverOpen(e, PopoverType.STARTMEASURE)
                  }
                  disabled={false}
                />
                <WaveformControlButton
                  title="Add section"
                  icon={<AddIcon />}
                  onClick={() =>
                    this.props.openedDialog(DialogType.ADD_SECTION)
                  }
                />
              </>
            }
            body={<StructureView />}
          ></View>
        }
      ></ContentLayout>
    );
  }
}

const WaveformControlButton = (props: {
  title: string;
  icon: ReactElement;
  disabled?: boolean;
  onClick?: (e?: any) => void;
}) => {
  const button = (
    <IconButton
      onClick={props.onClick}
      size="small"
      style={{ marginTop: "8px", marginRight: "5px" }}
      disabled={props.disabled}
    >
      {props.icon}
    </IconButton>
  );

  if (props.disabled) return button;

  return <Tooltip title={props.title}>{button}</Tooltip>;
};

const PopoverContent = (type: PopoverType, props: AllProps) => {
  switch (type) {
    case PopoverType.DETUNE:
      return <DetunePopover {...props} />;
    case PopoverType.PLAYBACKRATE:
      return <PlaybackRatePopover {...props} />;
    case PopoverType.RHYTHM:
      return <RhythmPopover {...props} />;
    case PopoverType.STARTMEASURE:
      return <StartMeasurePopover {...props} />;
    default:
      throw Error("Popup type undefined: " + type);
  }
};

const RhythmPopover = (props: AllProps) => (
  <>
    <SliderInput
      title="Bpm"
      value={props.bpm}
      min={40}
      max={220}
      step={1}
      onChange={(e, bpm) => {
        if (!Array.isArray(bpm)) {
          props.updatedRhythm({ bpm: bpm });
        }
      }}
    ></SliderInput>
    <FormControl fullWidth={true}>
      <InputLabel>Time Signature</InputLabel>
      <NativeSelect
        value={props.timeSignature}
        onChange={(e) =>
          props.updatedRhythm({
            timeSignatureType: toTimeSignatureType(e.target.value)
          })
        }
      >
        <option value={TimeSignatureType.FOUR_FOUR}>4/4</option>
        <option value={TimeSignatureType.THREE_FOUR}>3/4</option>
      </NativeSelect>
    </FormControl>
  </>
);
const DetunePopover = (props: AllProps) => (
  <SliderInput
    title="Detune"
    value={props.detune}
    min={-12}
    max={12}
    step={0.5}
    onChange={(e, detune) => {
      if (!Array.isArray(detune) && detune !== props.detune) {
        props.updatedPlaybackSettings({ detune: detune });
      }
    }}
  ></SliderInput>
);
const StartMeasurePopover = (props: {
  firstMeasureStart: number;
  syncFirstMeasureStart: boolean;
  enabledSyncFirstMeasureStart: typeof enabledSyncFirstMeasureStart;
}) => (
  <FormControl fullWidth={true}>
    <InputLabel>Start Measure 1</InputLabel>
    <Input
      type="text"
      id="startMeasure1"
      value={props.firstMeasureStart}
      startAdornment={
        <InputAdornment position="start">
          <Tooltip
            title="Toggle sync with mouse click.
          If enabled, clicking into the waveform will update the start of measure 0 to the selected position."
          >
            <ToggleButton
              style={{ width: "15px", height: "25px" }}
              value="check"
              selected={props.syncFirstMeasureStart}
              onChange={() => {
                props.enabledSyncFirstMeasureStart(
                  !props.syncFirstMeasureStart
                );
              }}
            >
              <SyncAltIcon />
            </ToggleButton>
          </Tooltip>
        </InputAdornment>
      }
    />
  </FormControl>
);
const PlaybackRatePopover = (props: AllProps) => (
  <SliderInput
    title="Playback rate"
    value={props.playbackRate}
    min={0.4}
    max={1.2}
    step={0.05}
    onChange={(e, playbackRate) => {
      if (!Array.isArray(playbackRate) && playbackRate !== props.playbackRate) {
        props.updatedPlaybackSettings({ playbackRate: playbackRate });
      }
    }}
  ></SliderInput>
);

const mapStateToProps = ({ project, audio, analysis }: ApplicationState) => {
  return {
    loaded: project.status === LoadingStatus.INITIALIZED,
    isPlaying: audio.isPlaying,
    firstMeasureStart: analysis.firstMeasureStart,
    syncFirstMeasureStart: project.syncFirstMeasureStart,
    bpm: analysis.bpm,
    timeSignature: analysis.timeSignature,
    detune: audio.detune,
    playbackRate: audio.playbackRate
  };
};

const mapDispatchToProps = {
  triggeredPlay,
  triggeredPause,
  enabledSyncFirstMeasureStart,
  updatedRhythm,
  updatedPlaybackSettings,
  openedDialog
};
export default connect(mapStateToProps, mapDispatchToProps)(StructurePage);
