import React from "react";
import View from "../views/view";
import WaveView from "../views/waveView";
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

class StructurePage extends React.Component<{ url: string }, {}> {
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
                    onClick={() => alert("This is a test")}
                  />
                  <FontAwesomeIcon
                    className="fa-pull-right"
                    icon={faSearchPlus}
                  />
                  <FontAwesomeIcon className="fa-pull-right" icon={faMinus} />
                  <FontAwesomeIcon className="fa-pull-right" icon={faPlus} />
                </>
              }
              body={this.props.url ? <WaveView url={this.props.url} /> : <></>}
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

export default StructurePage;
