import React from "react";

import View from "../../components/view/view";

class GuitarPage extends React.Component {
  render() {
    return (
      <View
        title="Guitar"
        body={
          <p>
            In this section you&apos;ll be able to transcribe the guitar part.
            Please come back later.
          </p>
        }
      ></View>
    );
  }
}

export default GuitarPage;
