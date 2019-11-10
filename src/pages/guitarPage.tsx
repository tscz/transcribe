import React from "react";

import View from "../views/view";

class GuitarPage extends React.Component {
  render() {
    return (
      <View
        header="Strumming"
        body={
          <p>
            In this section you'll be able to transcribe the guitar part. Please
            come back later.
          </p>
        }
      ></View>
    );
  }
}

export default GuitarPage;
