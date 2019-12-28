import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import React, { Component, ReactElement } from "react";

interface Props {
  body: ReactElement;
}

class View extends Component<Props> {
  render() {
    return (
      <Card style={{ height: "100%" }}>
        <CardContent>{this.props.body}</CardContent>
      </Card>
    );
  }
}

export default View;
