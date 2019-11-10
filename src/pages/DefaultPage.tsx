import React from "react";

import View from "../views/view";

class DefaultPage extends React.Component {
  render() {
    return (
      <View
        header="No Analysis started"
        body={<p>Please create a new Analysis or open an existing one.</p>}
      ></View>
    );
  }
}

export default DefaultPage;
