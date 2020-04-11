import { CardHeader } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import React, { Component, ReactElement } from "react";

interface Props {
  body: ReactElement;
  title: string;
  action?: ReactElement;
}

class View extends Component<Props> {
  render() {
    return (
      <Card
        style={{
          height: "100%",
          backgroundColor: "#ffffff"
        }}
        raised={false}
      >
        <CardHeader
          titleTypographyProps={{ variant: "subtitle1" }}
          title={this.props.title}
          style={{ backgroundColor: "#f1f4f6", padding: "4px" }}
          action={this.props.action}
        />
        <CardContent>{this.props.body}</CardContent>
      </Card>
    );
  }
}

export default View;
