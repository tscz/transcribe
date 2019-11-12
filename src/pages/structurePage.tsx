import {
  faMinus,
  faPlus,
  faSearchMinus,
  faSearchPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
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
      <Container fluid={true}>
        <Row>
          <Col sm={8}>
            <View
              header={
                <>
                  Song Structure
                  <FontAwesomeIcon
                    className="fa-pull-right"
                    icon={faSearchMinus}
                    onClick={this.props.zoomOut}
                  />
                  <FontAwesomeIcon
                    className="fa-pull-right"
                    icon={faSearchPlus}
                    onClick={this.props.zoomIn}
                  />
                  <FontAwesomeIcon
                    className="fa-pull-right"
                    icon={faMinus}
                    onClick={() => {
                      this.props.setRythm(
                        8.42,
                        { beatUnit: 4, beatsPerMeasure: 4 },
                        97
                      );
                    }}
                  />
                  <FontAwesomeIcon
                    className="fa-pull-right"
                    icon={faPlus}
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
          </Col>
          <Col sm={4}>
            <View
              header={<>Outline</>}
              body={
                this.props.url ? (
                  <WaveControlView url={this.props.url} />
                ) : (
                  <></>
                )
              }
            ></View>
          </Col>
        </Row>
      </Container>
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
