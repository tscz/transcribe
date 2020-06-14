import { FormControl, InputLabel, NativeSelect } from "@material-ui/core";
import SliderInput from "components/sliderInput/sliderInput";
import { TimeSignatureType, toTimeSignatureType } from "model/model";
import React, { Component } from "react";
import { connect } from "react-redux";
import { updatedRhythm } from "states/analysis/analysisSlice";
import { ApplicationState } from "states/store";

interface PropsFromState {
  readonly timeSignature: TimeSignatureType;
  readonly bpm: number;
}

interface PropsFromDispatch {
  updatedRhythm: typeof updatedRhythm;
}

type AllProps = PropsFromState & PropsFromDispatch;

class PropertiesView extends Component<AllProps> {
  render() {
    return (
      <>
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
      </>
    );
  }
}

const mapStateToProps = ({ analysis }: ApplicationState) => {
  return {
    bpm: analysis.bpm,
    timeSignature: analysis.timeSignature
  };
};

const mapDispatchToProps = {
  updatedRhythm
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesView);
