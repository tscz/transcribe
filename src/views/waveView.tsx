import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Wave from "../components/wave/wave";
export default class WaveView extends Component<
  {
    url: string;
  },
  {}
> {
  render() {
    console.log("this.props.src=" + this.props.url);
    return (
      <div>
        <Wave url={this.props.url} />
      </div>
    );
  }
}
