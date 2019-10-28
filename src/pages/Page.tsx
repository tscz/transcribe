import React, { Component } from "react";

import Card from "react-bootstrap/Card";

class Page extends Component<{ header: string }, {}> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Card style={{ margin: "30px" }}>
        <Card.Header as="h5">{this.props.header}</Card.Header>
        <Card.Body>{this.props.children}</Card.Body>
      </Card>
    );
  }
}

export default Page;
