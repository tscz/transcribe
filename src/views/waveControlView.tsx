import {
  Box,
  FormControl,
  Input,
  InputLabel,
  NativeSelect
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Slider from "@material-ui/core/Slider";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import React, { Component } from "react";
import { connect } from "react-redux";

import { setRythm } from "../store/analysis/actions";
import { TimeSignatureType } from "../store/analysis/types";
import { ApplicationState } from "../store/store";

interface PropsFromState {
  readonly firstMeasureStart: number;
  readonly timeSignature: TimeSignatureType;
  readonly bpm: number;
}

interface PropsFromDispatch {
  setRythm: typeof setRythm;
}

type AllProps = PropsFromState & PropsFromDispatch;

class WaveControlView extends Component<AllProps> {
  handleTimeSignatureChange = (e: any) => {
    this.props.setRythm(
      this.props.firstMeasureStart,
      e.target.value,
      this.props.bpm
    );
  };

  handleBpmChange = (e: any, bpm: number | number[]) => {
    if (!Array.isArray(bpm)) {
      this.props.setRythm(
        this.props.firstMeasureStart,
        this.props.timeSignature,
        bpm
      );
    }
  };

  handleFirstMeasureStartChange = (e: any, firstMeasureStart: number) => {
    this.props.setRythm(3.4, this.props.timeSignature, this.props.bpm);
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
                defaultValue="00:00:00"
                startAdornment={
                  <InputAdornment position="start">
                    <IconButton>
                      <SyncAltIcon />
                    </IconButton>
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

const mapStateToProps = ({ analysis }: ApplicationState) => {
  return {
    firstMeasureStart: analysis.firstMeasureStart,
    bpm: analysis.bpm,
    timeSignature: analysis.timeSignature
  };
};

const mapDispatchToProps = {
  setRythm
};
export default connect(mapStateToProps, mapDispatchToProps)(WaveControlView);
