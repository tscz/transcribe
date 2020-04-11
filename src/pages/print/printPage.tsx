import React from "react";

import View from "../../components/view/view";

class PrintPage extends React.Component {
  render() {
    return (
      <View
        title="Print"
        body={
          <p>
            In this section you&apos;ll be able to print the leadsheet. Please
            come back later.
          </p>
        }
      ></View>
    );
  }
}

export default PrintPage;
