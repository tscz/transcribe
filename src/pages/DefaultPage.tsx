import React from "react";

import ContentLayout from "../common/contentLayout";
import View from "../common/view";
import WaveControlView from "../components/wave/waveControlView";

class DefaultPage extends React.Component {
  render() {
    return (
      <ContentLayout
        topLeft={
          <View
            header="No Analysis started"
            body={<p>Please create a new Analysis or open an existing one.</p>}
          ></View>
        }
        topRight={
          <View
            header="Properties"
            body={<WaveControlView></WaveControlView>}
          ></View>
        }
      ></ContentLayout>
    );
  }
}

export default DefaultPage;
