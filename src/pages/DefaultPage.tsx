import React from "react";
import Page from "./Page";

class DefaultPage extends React.Component {
  render() {
    return (
      <Page header="No Analysis started">
        <p>Please create a new Analysis or open an existing one.</p>
      </Page>
    );
  }
}

export default DefaultPage;
