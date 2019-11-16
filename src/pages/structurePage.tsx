import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { connect } from "react-redux";

import WaveContainer from "../components/wave/waveContainer";
import { addSection, setRythm } from "../store/analysis/actions";
import { Section, SectionType } from "../store/analysis/types";
import { ApplicationState } from "../store/store";
import {
  endInit,
  startInit,
  zoomIn,
  zoomOut
} from "../store/structure/actions";
import { LoadingStatus } from "../store/structure/types";
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
  setRythm: typeof setRythm;
}

interface Props {
  url: string;
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
                <audio id="audio" controls hidden>
                  {this.props.url ? (
                    <source src={this.props.url} type="audio/mpeg" />
                  ) : null}
                  Your browser does not support the audio element.
                </audio>
                <IconButton>
                  <AddIcon
                    className="fa-pull-right"
                    onClick={this.props.zoomOut}
                  />
                </IconButton>
                <IconButton>
                  <AddIcon onClick={this.props.zoomIn} />
                </IconButton>

                <IconButton>
                  <AddIcon
                    className="fa-pull-right"
                    onClick={() => {
                      this.props.setRythm(
                        8.42,
                        { beatUnit: 4, beatsPerMeasure: 4 },
                        97
                      );
                    }}
                  />
                </IconButton>
                <IconButton>
                  <AddIcon
                    className="fa-pull-right"
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
                  />
                </IconButton>
              </>
            }
            body={
              this.props.url ? (
                <WaveContainer
                  onLoad={peaks => {
                    this.props.endInit();
                  }}
                  onLoadStart={() => this.props.startInit()}
                  zoomLevel={this.props.zoom}
                  status={this.props.status}
                />
              ) : (
                <></>
              )
            }
          ></View>
        }
        topRight={
          <View
            header={<>Properties</>}
            body={
              this.props.url ? <WaveControlView url={this.props.url} /> : <></>
            }
          ></View>
        }
      ></ContentLayout>
    );
  }
}

const mapStateToProps = ({ analysis, structure }: ApplicationState) => {
  return {
    sections: analysis.sections,
    zoom: structure.zoom,
    status: structure.status
  };
};

const mapDispatchToProps = {
  addSection,
  zoomIn,
  zoomOut,
  startInit,
  endInit,
  setRythm
};
export default connect(mapStateToProps, mapDispatchToProps)(StructurePage);
