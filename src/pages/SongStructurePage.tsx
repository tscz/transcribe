import React from "react";
import Wave from "../components/Wave";

class SongStructurePage extends React.Component<{ file: string }, {}> {
  render() {
    return <Wave src={this.props.file} />;
  }
}

export default SongStructurePage;
