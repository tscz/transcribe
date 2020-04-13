/* eslint-disable react/forbid-component-props */
import { Grid } from "@material-ui/core";
import SectionOverview from "components/sectionOverview/sectionOverview";
import React, { Component } from "react";

class StructureNavigationView extends Component<{}> {
  render() {
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        alignContent="stretch"
      >
        <Grid style={{ width: "100%" }}>
          <SectionOverview></SectionOverview>
        </Grid>
      </Grid>
    );
  }
}

export default StructureNavigationView;
