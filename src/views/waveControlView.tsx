import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import React, { Component } from "react";
//@ts-ignore
import BootstrapTable from "react-bootstrap-table-next";
//@ts-ignore
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";

export default class WaveControlView extends Component<{ url: string }, {}> {
  columns = [
    {
      dataField: "start",
      text: "Start"
    },
    {
      dataField: "end",
      text: "End"
    },
    {
      dataField: "section",
      text: "section",
      editor: {
        type: Type.SELECT,
        options: [
          {
            value: "Intro",
            label: "Intro"
          },
          {
            value: "Verse",
            label: "Verse"
          },
          {
            value: "Chorus",
            label: "Chorus"
          },
          {
            value: "Solo",
            label: "Solo"
          },
          {
            value: "Chorus",
            label: "Chorus"
          }
        ]
      }
    },
    {
      dataField: "label",
      text: "label"
    }
  ];

  sections = [
    {
      id: "1",
      start: "00:00",
      end: "00:03",
      section: "undefined",
      label: "To be done"
    }
  ];

  render() {
    return (
      <>
        <audio id="audio" controls>
          {this.props.url ? (
            <source src={this.props.url} type="audio/mpeg" />
          ) : null}
          Your browser does not support the audio element.
        </audio>
        <BootstrapTable
          keyField="id"
          data={this.sections}
          columns={this.columns}
          cellEdit={cellEditFactory({ mode: "click", blurToSave: true })}
        />
      </>
    );
  }
}
