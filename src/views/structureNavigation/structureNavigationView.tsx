/* eslint-disable react/forbid-component-props */
import { Grid } from "@material-ui/core";
import SectionOverview from "components/sectionOverview/sectionOverview";
import React, { Component } from "react";

class StructureNavigationView extends Component {
  public render(): JSX.Element {
    return (
      <Grid
        container
        direction="column"
        justifyContent="center"
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
