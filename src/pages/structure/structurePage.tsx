import {
  Divider,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  NativeSelect,
  Popover,
  Tooltip
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import LoopIcon from "@material-ui/icons/Loop";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import TimerIcon from "@material-ui/icons/Timer";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
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
import { zoomedIn, zoomedOut } from "../../states/wave/waveSlice";
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
  zoomedIn: typeof zoomedIn;
  zoomedOut: typeof zoomedOut;
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

  handleBpmChange = (e: any, bpm: number | number[]) => {
    if (!Array.isArray(bpm)) {
      this.props.updatedRhythm({ bpm: bpm });
    }
  };

  handleTimeSignatureChange = (e: any) => {
    this.props.updatedRhythm({ timeSignatureType: e.target.value });
  };

  handleDetuneChange = (e: any, detune: number | number[]) => {
    if (!Array.isArray(detune) && detune !== this.props.detune) {
      this.props.updatedPlaybackSettings({ detune: detune });
    }
  };

  handlePlaybackRateChange = (e: any, playbackRate: number | number[]) => {
    if (
      !Array.isArray(playbackRate) &&
      playbackRate !== this.props.playbackRate
    ) {
      this.props.updatedPlaybackSettings({ playbackRate: playbackRate });
    }
  };

  render() {
    Log.info("render", StructurePage.name);
    return (
      <ContentLayout
        topLeft={
          <View
            title="Song Overview"
            body={
              <>
                <WaveContainer />
                <Divider style={{ marginBottom: "10px" }} />
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={2}>
                    <FormControl fullWidth={true}>
                      <InputLabel>Start Measure 1</InputLabel>
                      <Input
                        type="text"
                        id="startMeasure1"
                        value={this.props.firstMeasureStart}
                        startAdornment={
                          <InputAdornment position="start">
                            <Tooltip title="Sync with play head">
                              <ToggleButton
                                style={{ width: "15px", height: "25px" }}
                                value="check"
                                selected={this.props.syncFirstMeasureStart}
                                onChange={() => {
                                  this.props.enabledSyncFirstMeasureStart(
                                    !this.props.syncFirstMeasureStart
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
                  </Grid>
                  <Grid item xs={2}>
                    <SliderInput
                      title="Bpm"
                      value={this.props.bpm}
                      min={40}
                      max={220}
                      step={1}
                      onChange={this.handleBpmChange}
                    ></SliderInput>{" "}
                  </Grid>
                  <Grid item xs={2}>
                    <FormControl fullWidth={true}>
                      <InputLabel>Time Signature</InputLabel>
                      <NativeSelect
                        value={this.props.timeSignature}
                        onChange={this.handleTimeSignatureChange}
                      >
                        <option value={TimeSignatureType.FOUR_FOUR}>4/4</option>
                        <option value={TimeSignatureType.THREE_FOUR}>
                          3/4
                        </option>
                      </NativeSelect>
                    </FormControl>{" "}
                  </Grid>
                  <Grid item xs={2}>
                    <SliderInput
                      title="Detune"
                      value={this.props.detune}
                      min={-12}
                      max={12}
                      step={0.5}
                      onChange={this.handleDetuneChange}
                    ></SliderInput>{" "}
                  </Grid>
                  <Grid item xs={2}>
                    <SliderInput
                      title="Playback rate"
                      value={this.props.playbackRate}
                      min={0.4}
                      max={1.2}
                      step={0.05}
                      onChange={this.handlePlaybackRateChange}
                    ></SliderInput>{" "}
                  </Grid>
                </Grid>
              </>
            }
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
                  title="Metronome"
                  icon={<TimerIcon />}
                  onClick={e => this.handleClick(e)}
                  disabled={true}
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
                  TODO
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
        bottom={
          <View
            title="Song Structure"
            action={
              <>
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
  return (
    <Tooltip title={props.title}>
      <>
        <IconButton
          onClick={props.onClick}
          size="small"
          style={{ marginTop: "8px", marginRight: "5px" }}
          disabled={props.disabled}
        >
          {props.icon}
        </IconButton>
      </>
    </Tooltip>
  );
};

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
  zoomedIn,
  zoomedOut,
  triggeredPlay,
  triggeredPause,
  enabledSyncFirstMeasureStart,
  updatedRhythm,
  updatedPlaybackSettings,
  openedDialog
};
export default connect(mapStateToProps, mapDispatchToProps)(StructurePage);
