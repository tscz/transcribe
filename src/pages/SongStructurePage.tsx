import React from "react";
import Wave from "../components/Wave";
import Page from "./Page";

class SongStructurePage extends React.Component<{ file: string }, {}> {
  render() {
    return (
      <>
        <Page header="Song Structure">
          <Wave src={this.props.file} />
        </Page>
      </>
    );
  }
}

export default SongStructurePage;
