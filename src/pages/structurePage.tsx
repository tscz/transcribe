import {
  faMinus,
  faPlus,
  faSearchMinus,
  faSearchPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PeaksInstance } from "peaks.js";
import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { connect } from "react-redux";

import WaveContainer from "../components/wave/waveContainer";
import { addSegment } from "../store/analysis/actions";
import { ApplicationState } from "../store/store";
import View from "../views/view";
import WaveControlView from "../views/waveControlView";

interface PropsFromState {
  peaks: PeaksInstance | null;
}

interface PropsFromDispatch {
  addSegment: typeof addSegment;
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
                    onClick={() => this.props.peaks!.zoom.zoomOut()}
                  />
                  <FontAwesomeIcon
                    className="fa-pull-right"
                    icon={faSearchPlus}
                    onClick={() => this.props.peaks!.zoom.zoomIn()}
                  />
                  <FontAwesomeIcon className="fa-pull-right" icon={faMinus} />
                  <FontAwesomeIcon
                    className="fa-pull-right"
                    icon={faPlus}
                    onClick={() => {
                      this.props.addSegment({
                        startTime: this.props.peaks!.player.getCurrentTime(),
                        endTime: this.props.peaks!.player.getCurrentTime() + 10,
                        editable: true,
                        color: "rgba(255, 161, 39, 1)",
                        labelText: "This is a segment created via Redux"
                      });
                    }}
                  />
                </>
              }
              body={
                this.props.url ? <WaveContainer url={this.props.url} /> : <></>
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

const mapStateToProps = ({ project }: ApplicationState) => {
  return {
    peaks: project.peaks
  };
};

const mapDispatchToProps = {
  addSegment
};
export default connect(mapStateToProps, mapDispatchToProps)(StructurePage);
