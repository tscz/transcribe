import React, { Component, ReactElement } from "react";
import Card from "react-bootstrap/Card";

interface Props {
  header: ReactElement | String;
  body: ReactElement;
}

class View extends Component<Props> {
  render() {
    return (
      <Card style={{ margin: "30px" }}>
        <Card.Header as="h5">{this.props.header}</Card.Header>
        <Card.Body>{this.props.body}</Card.Body>
      </Card>
    );
  }
}

export default View;
