import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import React, { Component, ReactElement } from "react";

interface Props {
  header: ReactElement | String;
  body: ReactElement;
  actions?: ReactElement;
}

class View extends Component<Props> {
  render() {
    return (
      <Card style={{ height: "100%" }}>
        <CardHeader action={this.props.actions} title={this.props.header} />
        <CardContent>{this.props.body}</CardContent>
      </Card>
    );
  }
}

export default View;
