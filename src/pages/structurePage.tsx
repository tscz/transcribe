import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { connect } from "react-redux";

import WaveContainer from "../components/wave/waveContainer";
import { addSection, setRhythm } from "../store/analysis/actions";
import {
  Section,
  SectionType,
  TimeSignatureType
} from "../store/analysis/types";
import { endInit, startInit, zoomIn, zoomOut } from "../store/audio/actions";
import { LoadingStatus } from "../store/audio/types";
import { ApplicationState } from "../store/store";
import View from "../views/view";
import WaveControlView from "../views/waveControlView";
import ContentLayout from "./contentLayout";

interface PropsFromState {
  sections: Section[];
  zoom: number;
  status: LoadingStatus;
}

interface PropsFromDispatch {
  addSection: typeof addSection;
  zoomIn: typeof zoomIn;
  zoomOut: typeof zoomOut;
  startInit: typeof startInit;
  endInit: typeof endInit;
  setRhythm: typeof setRhythm;
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
                <IconButton onClick={this.props.zoomOut}>
                  <AddIcon className="fa-pull-right" />
                </IconButton>
                <IconButton onClick={this.props.zoomIn}>
                  <AddIcon />
                </IconButton>

                <IconButton
                  onClick={() => {
                    this.props.setRhythm({
                      firstMeasureStart: 8.42,
                      timeSignatureType: TimeSignatureType.FOUR_FOUR,
                      bpm: 97
                    });
                  }}
                >
                  <AddIcon className="fa-pull-right" />
                </IconButton>
                <IconButton
                  onClick={() => {
                    this.props.addSection({
                      startTime: 0,
                      endTime: 10,
                      editable: true,
                      color: "rgba(255, 161, 39, 1)",
                      labelText: "This is a section created via Redux",
                      type: SectionType.INTRO
                    });
                  }}
                >
                  <AddIcon className="fa-pull-right" />
                </IconButton>
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

const mapStateToProps = ({ analysis, audio }: ApplicationState) => {
  return {
    sections: analysis.sections,
    zoom: audio.zoom,
    status: audio.status
  };
};

const mapDispatchToProps = {
  addSection,
  zoomIn,
  zoomOut,
  startInit,
  endInit,
  setRhythm
};
export default connect(mapStateToProps, mapDispatchToProps)(StructurePage);
