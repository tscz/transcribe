import React from "react";
import View from "../views/view";
import WaveContainer from "../components/wave/waveContainer";
import WaveControlView from "../views/waveControlView";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearchMinus,
  faSearchPlus,
  faPlus,
  faMinus
} from "@fortawesome/free-solid-svg-icons";
import { PeaksInstance, SegmentAddOptions } from "peaks.js";
import { connect } from "react-redux";
import { addSegment } from "../redux/actions";

class StructurePage extends React.Component<
  {
    url: string;
    peaksInstance: PeaksInstance;
    addSegment: (segment: SegmentAddOptions) => void;
  },
  {}
> {
  render() {
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
                    onClick={() => this.props.peaksInstance.zoom.zoomOut()}
                  />
                  <FontAwesomeIcon
                    className="fa-pull-right"
                    icon={faSearchPlus}
                    onClick={() => this.props.peaksInstance.zoom.zoomIn()}
                  />
                  <FontAwesomeIcon className="fa-pull-right" icon={faMinus} />
                  <FontAwesomeIcon
                    className="fa-pull-right"
                    icon={faPlus}
                    onClick={() => {
                      this.props.addSegment({
                        startTime: this.props.peaksInstance.player.getCurrentTime(),
                        endTime:
                          this.props.peaksInstance.player.getCurrentTime() + 10,
                        editable: true,
                        color: "rgba(255, 161, 39, 1)",
                        labelText: "This is a segment created via Redux"
                      });
                      console.log("addSegment");
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

const mapStateToProps = (state: any) => {
  return {
    peaksInstance: state.peaks
  };
};

const mapDispatchToProps = {
  addSegment
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StructurePage);
