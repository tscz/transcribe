import React from "react";
import Wave from "../components/Wave";
import Page from "./Page";

class SongStructurePage extends React.Component<{ url: string }, {}> {
  render() {
    return (
      <>
        <Page header="Song Structure">
          {this.props.url ? <Wave url={this.props.url} /> : null}
        </Page>
      </>
    );
  }
}

export default SongStructurePage;
