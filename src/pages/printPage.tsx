import React from "react";

import View from "../common/view";

class PrintPage extends React.Component {
  render() {
    return (
      <View
        header="Print"
        body={
          <p>
            In this section you'll be able to print the leadsheet. Please come
            back later.
          </p>
        }
      ></View>
    );
  }
}

export default PrintPage;
