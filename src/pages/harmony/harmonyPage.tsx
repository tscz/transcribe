import View from "components/view/view";
import React from "react";

class HarmonyPage extends React.Component {
  render() {
    return (
      <View
        title="Harmony"
        body={
          <p>
            In this section you&apos;ll be able to transcribe the harmony.
            Please come back later.
          </p>
        }
      ></View>
    );
  }
}

export default HarmonyPage;
