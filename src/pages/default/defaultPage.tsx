import View from "components/view/view";
import React, { Component } from "react";

class DefaultPage extends Component {
  render(): JSX.Element {
    return (
      <View
        title="Info"
        body={
          <>
            <p>No Transcription started!!</p>
            <p>Please create a new Transcription or open an existing one.</p>
          </>
        }
      ></View>
    );
  }
}

export default DefaultPage;
