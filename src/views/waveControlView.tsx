import {
  Box,
  FormControl,
  Input,
  InputLabel,
  NativeSelect,
  Tooltip
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import Slider from "@material-ui/core/Slider";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import ToggleButton from "@material-ui/lab/ToggleButton";
import React, { Component } from "react";
import { connect } from "react-redux";

import { ApplicationState } from "../app/store";
import { updatedPlaybackSettings } from "../features/audio/audioSlice";
import { enabledSyncFirstMeasureStart } from "../features/project/projectSlice";
import { setRhythm } from "../store/analysis/actions";
import { TimeSignatureType } from "../store/analysis/types";

interface PropsFromState {
  readonly firstMeasureStart: number;
  readonly timeSignature: TimeSignatureType;
  readonly bpm: number;
  readonly syncFirstMeasureStart: boolean;
  readonly detune: number;
  readonly playbackRate: number;
}

interface PropsFromDispatch {
  setRhythm: typeof setRhythm;
  enabledSyncFirstMeasureStart: typeof enabledSyncFirstMeasureStart;
  updatedPlaybackSettings: typeof updatedPlaybackSettings;
}

type AllProps = PropsFromState & PropsFromDispatch;

class WaveControlView extends Component<AllProps> {
  handleTimeSignatureChange = (e: any) => {
    this.props.setRhythm({ timeSignatureType: e.target.value });
  };

  handleBpmChange = (e: any, bpm: number | number[]) => {
    if (!Array.isArray(bpm)) {
      this.props.setRhythm({ bpm: bpm });
    }
  };

  handleDetuneChange = (e: any, detune: number | number[]) => {
    if (!Array.isArray(detune)) {
      this.props.updatedPlaybackSettings({ detune: detune });
    }
  };

  handlePlaybackRateChange = (e: any, playbackRate: number | number[]) => {
    if (!Array.isArray(playbackRate)) {
      this.props.updatedPlaybackSettings({ playbackRate: playbackRate });
    }
  };

  render() {
    return (
      <>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <FormControl>
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
            <FormControl style={{ width: "100%" }}>
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

const mapStateToProps = ({ project, analysis, audio }: ApplicationState) => {
  return {
    firstMeasureStart: analysis.firstMeasureStart,
    bpm: analysis.bpm,
    timeSignature: analysis.timeSignature,
    syncFirstMeasureStart: project.syncFirstMeasureStart,
    detune: audio.detune,
    playbackRate: audio.playbackRate
  };
};

const mapDispatchToProps = {
  setRhythm,
  enabledSyncFirstMeasureStart,
  updatedPlaybackSettings
};
export default connect(mapStateToProps, mapDispatchToProps)(WaveControlView);
