import React from "react";

import View from "../../components/view/view";

class DefaultPage extends React.Component {
  render() {
    return (
      <View
        header="No Transcription started"
        body={<p>Please create a new Transcription or open an existing one.</p>}
      ></View>
    );
  }
}

export default DefaultPage;
