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
        <audio id="audio" controls>
          {this.props.url ? (
            <source src={this.props.url} type="audio/mpeg" />
          ) : null}
          Your browser does not support the audio element.
        </audio>

        <div id="demo-controls">
          <div id="controls">
            <Button variant="dark" data-action="zoom-in">
              Zoom in
            </Button>
            <Button variant="dark" data-action="zoom-out">
              Zoom out
            </Button>
            <Button variant="dark" data-action="add-segment">
              Add a Segment at current time
            </Button>
            <Button variant="dark" data-action="add-point">
              Add a Point at current time
            </Button>
            <Button variant="dark" data-action="log-data">
              Log segments/points
            </Button>
          </div>
        </div>

        <Wave url={this.props.url} />

        <div className="log">
          <div id="segments" className="hide">
            <h2>Segments</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Label</th>
                  <th>Start time</th>
                  <th>End time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>

          <div id="points" className="hide">
            <h2>Points</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Label</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
