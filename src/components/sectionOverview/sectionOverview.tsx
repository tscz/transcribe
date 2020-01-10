import { Button, ButtonGroup, Grid, Typography } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";

import { Measure, Section } from "../../states/analysisSlice";
import { ApplicationState, NormalizedObjects } from "../../states/store";
import PeaksConfig from "../audioManagement/peaksConfig";

interface PropsFromState {
  sections: NormalizedObjects<Section>;
  measures: NormalizedObjects<Measure>;
}

interface PropsFromDispatch {}

interface Props {}

type AllProps = PropsFromState & PropsFromDispatch & Props;

class SectionOverview extends React.Component<AllProps> {
  render() {
    let { sections, measures } = this.props;

    let generateMatrix = (arr: string[], size: number) => {
      var res = [];
      for (var i = 0; i < arr.length; i = i + size)
        res.push(arr.slice(i, i + size));
      return res;
    };

    return (
      <>
        <Grid container direction="column">
          {sections.allIds.map(sectionId => (
            <Grid item key={sectionId}>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant="caption">
                    {sections.byId[sectionId].type.toLowerCase()}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    style={{ marginBottom: "5px" }}
                  >
                    {generateMatrix(sections.byId[sectionId].measures, 8).map(
                      row => (
                        <ButtonGroup orientation="horizontal" size="small">
                          {row.map(measureId => {
                            let measure: Measure = measures.byId[measureId];

                            return (
                              <Square
                                key={measure.id}
                                value={measure.id!}
                                bg={
                                  PeaksConfig.SECTIONTYPE_TO_COLOR.get(
                                    sections.byId[sectionId].type
                                  )!
                                }
                              ></Square>
                            );
                          })}
                        </ButtonGroup>
                      )
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </>
    );
  }
}

class Square extends React.Component<{
  value: string;
  bg: string;
}> {
  render() {
    return (
      <Button
        {...this.props}
        style={{
          backgroundColor: this.props.bg
        }}
      >
        {this.props.value}
      </Button>
    );
  }
}

const mapStateToProps = ({ analysis }: ApplicationState) => {
  return {
    sections: analysis.sections,
    measures: analysis.measures
  };
};

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(SectionOverview);
