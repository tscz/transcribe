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

import { setRhythm } from "../store/analysis/actions";
import { TimeSignatureType } from "../store/analysis/types";
import { setMeasureSyncMode } from "../store/project/actions";
import { ApplicationState } from "../store/store";

interface PropsFromState {
  readonly firstMeasureStart: number;
  readonly timeSignature: TimeSignatureType;
  readonly bpm: number;
  readonly syncFirstMeasureStart: boolean;
}

interface PropsFromDispatch {
  setRhythm: typeof setRhythm;
  setMeasureSyncMode: typeof setMeasureSyncMode;
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
                          this.props.setMeasureSyncMode(
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
            <FormControl style={{ width: "100%" }}>
              <InputLabel shrink>Bpm</InputLabel>
              <Box mt={2}>
                <Slider
                  value={this.props.bpm}
                  valueLabelDisplay="auto"
                  min={40}
                  max={220}
                  onChange={this.handleBpmChange}
                />
              </Box>
            </FormControl>
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
        </Grid>
      </>
    );
  }
}

const mapStateToProps = ({ project, analysis }: ApplicationState) => {
  return {
    firstMeasureStart: analysis.firstMeasureStart,
    bpm: analysis.bpm,
    timeSignature: analysis.timeSignature,
    syncFirstMeasureStart: project.syncFirstMeasureStart
  };
};

const mapDispatchToProps = {
  setRhythm,
  setMeasureSyncMode
};
export default connect(mapStateToProps, mapDispatchToProps)(WaveControlView);
