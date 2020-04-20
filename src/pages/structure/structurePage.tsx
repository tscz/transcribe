import {
  createStyles,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Popover,
  Theme,
  Tooltip,
  WithStyles,
  withStyles
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import BorderLeftIcon from "@material-ui/icons/BorderLeft";
import LoopIcon from "@material-ui/icons/Loop";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SpeedIcon from "@material-ui/icons/Speed";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ContentLayout from "components/contentLayout/contentLayout";
import Log from "components/log/log";
import SliderInput from "components/sliderInput/sliderInput";
import View from "components/view/view";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { updatedRhythm } from "states/analysis/analysisSlice";
import {
  triggeredPause,
  triggeredPlay,
  updatedPlaybackSettings
} from "states/audio/audioSlice";
import { DialogType, openedDialog } from "states/dialog/dialogsSlice";
import {
  enabledSyncFirstMeasureStart,
  LoadingStatus
} from "states/project/projectSlice";
import { ApplicationState } from "states/store";
import PropertiesView from "views/properties/propertiesView";
import StructureView from "views/structure/structureView";
import StructureNavigationView from "views/structureNavigation/structureNavigationView";
import WaveContainer from "views/wave/waveContainer";

interface PropsFromState {
  readonly loaded: boolean;
  readonly isPlaying: boolean;
  readonly syncFirstMeasureStart: boolean;
  readonly firstMeasureStart: number;
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

interface Props extends WithStyles<typeof popoverStyles> {}

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
    event: React.MouseEvent<HTMLButtonElement> | undefined,
    type: PopoverType
  ) => {
    if (event && event.currentTarget)
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
                  className={this.props.classes.popover}
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
                    <div className={this.props.classes.content}>
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
        bottomLeft={
          <View
            title="Song Sections"
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
        bottomRight={
          <View title="Song Properties" body={<PropertiesView />}></View>
        }
      ></ContentLayout>
    );
  }
}

const popoverStyles = (theme: Theme) =>
  createStyles({
    content: {
      width: theme.popover.width,
      minHeight: theme.popover.minHeight,
      margin: theme.popover.margin,
      marginTop: theme.popover.marginTop
    },
    popover: {
      height: "400px"
    }
  });

const waveformControlButtonStyles = () =>
  createStyles({
    root: {
      marginTop: "8px",
      marginRight: "5px"
    }
  });

interface WaveformControlButtonProps {
  title: string;
  icon: ReactElement;
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const WaveformControlButton = withStyles(waveformControlButtonStyles)(
  (
    props: WaveformControlButtonProps &
      WithStyles<typeof waveformControlButtonStyles>
  ) => {
    const button = (
      <IconButton
        className={props.classes.root}
        onClick={props.onClick}
        size="small"
        disabled={props.disabled}
      >
        {props.icon}
      </IconButton>
    );

    if (props.disabled) return button;

    return <Tooltip title={props.title}>{button}</Tooltip>;
  }
);

const PopoverContent = (type: PopoverType, props: AllProps) => {
  switch (type) {
    case PopoverType.DETUNE:
      return <DetunePopover {...props} />;
    case PopoverType.PLAYBACKRATE:
      return <PlaybackRatePopover {...props} />;
    case PopoverType.STARTMEASURE:
      return <StartMeasurePopover {...props} />;
    default:
      throw Error("Popup type undefined: " + type);
  }
};

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

const startMeasurePopoverStyles = () =>
  createStyles({
    toggleButton: {
      width: "15px",
      height: "25px"
    }
  });

interface StartMeasurePopoverProps {
  firstMeasureStart: number;
  syncFirstMeasureStart: boolean;
  enabledSyncFirstMeasureStart: typeof enabledSyncFirstMeasureStart;
}

const StartMeasurePopover = withStyles(startMeasurePopoverStyles)(
  (
    props: StartMeasurePopoverProps &
      WithStyles<typeof startMeasurePopoverStyles>
  ) => (
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
                className={props.classes.toggleButton}
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
  )
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(popoverStyles, { withTheme: true })(StructurePage));
