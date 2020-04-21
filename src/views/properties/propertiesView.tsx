import {
  createStyles,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  NativeSelect,
  Tooltip,
  WithStyles,
  withStyles
} from "@material-ui/core";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import ToggleButton from "@material-ui/lab/ToggleButton";
import SliderInput from "components/sliderInput/sliderInput";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  TimeSignatureType,
  updatedRhythm
} from "states/analysis/analysisSlice";
import { toTimeSignatureType } from "states/analysis/analysisUtil";
import { enabledSyncFirstMeasureStart } from "states/project/projectSlice";
import { ApplicationState } from "states/store";

interface PropsFromState {
  readonly timeSignature: TimeSignatureType;
  readonly bpm: number;
  readonly syncFirstMeasureStart: boolean;
  readonly firstMeasureStart: number;
}

interface PropsFromDispatch {
  updatedRhythm: typeof updatedRhythm;
  enabledSyncFirstMeasureStart: typeof enabledSyncFirstMeasureStart;
}

const startMeasurePopoverStyles = () =>
  createStyles({
    toggleButton: {
      width: "15px",
      height: "25px"
    }
  });

type AllProps = PropsFromState &
  PropsFromDispatch &
  WithStyles<typeof startMeasurePopoverStyles>;

class PropertiesView extends Component<AllProps> {
  render() {
    return (
      <Grid container direction="column" alignItems="stretch" spacing={2}>
        <Grid item>
          <SliderInput
            title="Bpm"
            value={this.props.bpm}
            min={40}
            max={220}
            step={1}
            onChange={(_e, bpm) => {
              if (!Array.isArray(bpm)) {
                this.props.updatedRhythm({ bpm: bpm });
              }
            }}
          ></SliderInput>
        </Grid>
        <Grid item>
          <FormControl fullWidth={true}>
            <InputLabel>Time Signature</InputLabel>
            <NativeSelect
              value={this.props.timeSignature}
              onChange={(e) =>
                this.props.updatedRhythm({
                  timeSignatureType: toTimeSignatureType(e.target.value)
                })
              }
            >
              <option value={TimeSignatureType.FOUR_FOUR}>4/4</option>
              <option value={TimeSignatureType.THREE_FOUR}>3/4</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl fullWidth={true}>
            <InputLabel>Start Measure 0</InputLabel>
            <Input
              type="text"
              value={this.props.firstMeasureStart}
              startAdornment={
                <InputAdornment position="start">
                  <Tooltip
                    title="Toggle sync with mouse click.
          If enabled, clicking into the waveform will update the start of measure 0 to the selected position."
                  >
                    <ToggleButton
                      className={this.props.classes.toggleButton}
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
      </Grid>
    );
  }
}

const mapStateToProps = ({ project, analysis }: ApplicationState) => {
  return {
    bpm: analysis.bpm,
    timeSignature: analysis.timeSignature,
    syncFirstMeasureStart: project.syncFirstMeasureStart,
    firstMeasureStart: analysis.firstMeasureStart
  };
};

const mapDispatchToProps = {
  updatedRhythm,
  enabledSyncFirstMeasureStart
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(startMeasurePopoverStyles, { withTheme: true })(PropertiesView));
