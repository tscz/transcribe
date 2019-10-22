import Peaks, { PeaksInstance } from "peaks.js";
import React, { Component } from "react";
import Button from "react-bootstrap/Button";

class Wave extends Component<{ src: string }, {}> {
  state = {};

  componentDidUpdate() {
    console.log("initWave()");
    this.initWave();
  }

  render() {
    console.log("this.props.src=" + this.props.src);
    return (
      <div>
        <div id="demo-controls">
          <audio id="audio" controls>
            <source src={this.props.src} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>

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

        <div id="waveform-container">
          <div id="zoomview-container"></div>
          <div id="overview-container"></div>
        </div>

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

  initWave() {
    var renderSegments = function(peaks: PeaksInstance) {
      var segmentsContainer = document.getElementById("segments");
      var segments = peaks.segments.getSegments();
      var html = "";

      for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];

        var row =
          "<tr>" +
          "<td>" +
          segment.id +
          "</td>" +
          "<td>" +
          segment.labelText +
          "</td>" +
          "<td>" +
          segment.startTime +
          "</td>" +
          "<td>" +
          segment.endTime +
          "</td>" +
          '<td><a href="#' +
          segment.id +
          '" data-action="play-segment" data-id="' +
          segment.id +
          '">Play</a></td>' +
          '<td><a href="#' +
          segment.id +
          '" data-action="remove-segment" data-id="' +
          segment.id +
          '">Remove</a></td></tr>';

        html += row;
      }

      segmentsContainer!.querySelector("tbody")!.innerHTML = html;

      if (html.length) {
        segmentsContainer!.classList.remove("hide");
      }
    };

    var renderPoints = function(peaks: PeaksInstance) {
      var pointsContainer = document.getElementById("points");
      var points = peaks.points.getPoints();
      var html = "";

      for (var i = 0; i < points.length; i++) {
        var point = points[i];

        var row =
          "<tr>" +
          "<td>" +
          point.id +
          "</td>" +
          "<td>" +
          point.labelText +
          "</td>" +
          "<td>" +
          point.time +
          "</td>" +
          '<td><a href="#' +
          point.id +
          '" data-action="remove-point" data-id="' +
          point.id +
          '">Remove</a></td></tr>';

        html += row;
      }

      pointsContainer!.querySelector!("tbody")!.innerHTML = html;

      if (html.length) {
        pointsContainer!.classList.remove("hide");
      }
    };

    var audioContext = new AudioContext();

    var audioElement: Element = document!.getElementById("audio")!;

    (audioElement as HTMLAudioElement).src = this.props.src;

    var options = {
      containers: {
        zoomview: document!.getElementById("zoomview-container")!,
        overview: document!.getElementById("overview-container")!
      },
      mediaElement: audioElement,
      webAudio: {
        audioContext: audioContext,
        scale: 128,
        multiChannel: false
      },
      keyboard: true,
      pointMarkerColor: "#006eb0",
      showPlayheadTime: true,
      zoomLevels: [128, 256, 512, 1024, 2048, 4096]
    };

    Peaks.init(options, function(err, peaksInstance) {
      console.log("Peaks instance ready");

      document!
        .querySelector('[data-action="zoom-in"]')!
        .addEventListener("click", function() {
          peaksInstance!.zoom.zoomIn();
        });

      document!
        .querySelector('[data-action="zoom-out"]')!
        .addEventListener("click", function() {
          peaksInstance!.zoom.zoomOut();
        });

      document!
        .querySelector('button[data-action="add-segment"]')!
        .addEventListener("click", function() {
          // Ignored because of  https://github.com/bbc/peaks.js/issues/281
          // @ts-ignore-start
          peaksInstance!.segments.add({
            startTime: peaksInstance!.player!.getCurrentTime(),
            endTime: peaksInstance!.player!.getCurrentTime() + 10,
            labelText: "Test segment",
            editable: true
          });
          // @ts-ignore-end
        });

      document!
        .querySelector('button[data-action="add-point"]')!
        .addEventListener("click", function() {
          // Ignored because of  https://github.com/bbc/peaks.js/issues/281
          // @ts-ignore-start
          peaksInstance!.points.add({
            time: peaksInstance!.player.getCurrentTime(),
            labelText: "Test point",
            editable: true
          });
          // @ts-ignore-end
        });

      document!
        .querySelector('button[data-action="log-data"]')!
        .addEventListener("click", function(event) {
          renderSegments(peaksInstance!);
          renderPoints(peaksInstance!);
        });

      document!
        .querySelector("body")!
        .addEventListener("click", function(event) {
          var element = event.target as HTMLBodyElement;
          var action = element!.getAttribute("data-action");
          var id = element.getAttribute("data-id");

          if (action === "play-segment") {
            var segment = peaksInstance!.segments.getSegment(id!);
            peaksInstance!.player.playSegment(segment!);
          } else if (action === "remove-point") {
            peaksInstance!.points.removeById(id!);
          } else if (action === "remove-segment") {
            peaksInstance!.segments.removeById(id!);
          }
        });

      // Points mouse events

      peaksInstance!.on("points.mouseenter", function(point) {
        console.log("points.mouseenter:", point);
      });

      peaksInstance!.on("points.mouseleave", function(point) {
        console.log("points.mouseleave:", point);
      });

      peaksInstance!.on("points.dblclick", function(point) {
        console.log("points.dblclick:", point);
      });

      peaksInstance!.on("points.dragstart", function(point) {
        console.log("points.dragstart:", point);
      });

      peaksInstance!.on("points.dragmove", function(point) {
        console.log("points.dragmove:", point);
      });

      peaksInstance!.on("points.dragend", function(point) {
        console.log("points.dragend:", point);
      });
    });
  }
}

export default Wave;
