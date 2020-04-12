import View from "components/view/view";
import React from "react";

class DrumPage extends React.Component {
  render() {
    return (
      <View
        title="Drums View"
        body={
          <p>
            In this section you&apos;ll be able to transcribe the drum part.
            Please come back later.
          </p>
        }
      ></View>
    );
  }
}

export default DrumPage;
