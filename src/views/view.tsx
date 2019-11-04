import React, { Component, ReactElement } from "react";

import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchPlus, faSearchMinus } from "@fortawesome/free-solid-svg-icons";

class View extends Component<
  { header: ReactElement | String; body: ReactElement },
  {}
> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
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
