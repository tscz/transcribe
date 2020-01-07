import {
  Box,
  FormControl,
  Input,
  InputLabel,
  NativeSelect,
  Tooltip
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Slider from "@material-ui/core/Slider";
import LoopIcon from "@material-ui/icons/Loop";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import TimerIcon from "@material-ui/icons/Timer";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import ToggleButton from "@material-ui/lab/ToggleButton";
import React, { Component, ReactElement } from "react";
import { connect } from "react-redux";

import { TimeSignatureType, updatedRhythm } from "../../states/analysisSlice";
import {
  triggeredPause,
  triggeredPlay,
  updatedPlaybackSettings
} from "../../states/audioSlice";
import { enabledSyncFirstMeasureStart } from "../../states/projectSlice";
import { ApplicationState } from "../../states/store";
import { zoomedIn, zoomedOut } from "../../states/waveSlice";

interface PropsFromState {
  readonly firstMeasureStart: number;
  readonly timeSignature: TimeSignatureType;
  readonly bpm: number;
  readonly syncFirstMeasureStart: boolean;
  readonly detune: number;
  readonly playbackRate: number;
  readonly zoom: number;
  readonly isPlaying: boolean;
}

interface PropsFromDispatch {
  updatedRhythm: typeof updatedRhythm;
  enabledSyncFirstMeasureStart: typeof enabledSyncFirstMeasureStart;
  updatedPlaybackSettings: typeof updatedPlaybackSettings;
  zoomedIn: typeof zoomedIn;
  zoomedOut: typeof zoomedOut;
  triggeredPlay: typeof triggeredPlay;
  triggeredPause: typeof triggeredPause;
}

type AllProps = PropsFromState & PropsFromDispatch;

class WaveControlView extends Component<AllProps> {
  handleTimeSignatureChange = (e: any) => {
    this.props.updatedRhythm({ timeSignatureType: e.target.value });
  };

  handleBpmChange = (e: any, bpm: number | number[]) => {
    if (!Array.isArray(bpm)) {
      this.props.updatedRhythm({ bpm: bpm });
    }
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
    return (
      <>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <InputLabel shrink>Actions</InputLabel>
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
          </Grid>
          <Grid item>
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
          <Grid item>
            <SliderInput
              title="Bpm"
              value={this.props.bpm}
              min={40}
              max={220}
              step={1}
              onChange={this.handleBpmChange}
            ></SliderInput>
          </Grid>
          <Grid item>
            <FormControl fullWidth={true}>
              <InputLabel>Time Signature</InputLabel>
              <NativeSelect
                value={this.props.timeSignature}
                onChange={this.handleTimeSignatureChange}
              >
                <option value={TimeSignatureType.FOUR_FOUR}>4/4</option>
                <option value={TimeSignatureType.THREE_FOUR}>3/4</option>
              </NativeSelect>
            </FormControl>
          </Grid>
          <Grid item>
            <SliderInput
              title="Detune"
              value={this.props.detune}
              min={-12}
              max={12}
              step={0.5}
              onChange={this.handleDetuneChange}
            ></SliderInput>
          </Grid>
          <Grid item>
            <SliderInput
              title="Playback rate"
              value={this.props.playbackRate}
              min={0.4}
              max={1.2}
              step={0.05}
              onChange={this.handlePlaybackRateChange}
            ></SliderInput>
          </Grid>
        </Grid>
      </>
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

const SliderInput = (props: {
  title: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (event: any, value: number | number[]) => void;
}) => {
  return (
    <FormControl style={{ width: "100%" }}>
      <InputLabel shrink>{props.title}</InputLabel>
      <Box mt={2}>
        <Slider
          value={props.value}
          valueLabelDisplay="auto"
          min={props.min}
          max={props.max}
          onChange={props.onChange}
          step={props.step}
        />
      </Box>
    </FormControl>
  );
};

const mapStateToProps = ({
  project,
  analysis,
  audio,
  wave
}: ApplicationState) => {
  return {
    firstMeasureStart: analysis.firstMeasureStart,
    bpm: analysis.bpm,
    timeSignature: analysis.timeSignature,
    syncFirstMeasureStart: project.syncFirstMeasureStart,
    detune: audio.detune,
    playbackRate: audio.playbackRate,
    zoom: wave.zoom,
    status: audio.status,
    isPlaying: audio.isPlaying,
    loaded: project.loaded
  };
};

const mapDispatchToProps = {
  updatedRhythm,
  enabledSyncFirstMeasureStart,
  updatedPlaybackSettings,
  zoomedIn,
  zoomedOut,
  triggeredPlay,
  triggeredPause
};
export default connect(mapStateToProps, mapDispatchToProps)(WaveControlView);
