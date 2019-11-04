import React from "react";
import Page from "./page";
import WaveView from "../views/waveView";

class SongStructurePage extends React.Component<{ url: string }, {}> {
  render() {
    return (
      <>
        <Page header="Song Structure">
          {this.props.url ? <WaveView url={this.props.url} /> : null}
        </Page>
      </>
    );
  }
}

export default SongStructurePage;
