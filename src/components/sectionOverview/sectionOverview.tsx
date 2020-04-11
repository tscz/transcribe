import { Button, ButtonGroup, Grid, Typography } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";

import { Measure, Section } from "../../states/analysis/analysisSlice";
import { updatedLoopSettings } from "../../states/audio/audioSlice";
import { ApplicationState, NormalizedObjects } from "../../states/store";
import PeaksConfig from "../audioManagement/peaksConfig";

interface PropsFromState {
  sections: NormalizedObjects<Section>;
  measures: NormalizedObjects<Measure>;
}

interface PropsFromDispatch {
  updatedLoopSettings: typeof updatedLoopSettings;
}

interface Props {}

type AllProps = PropsFromState & PropsFromDispatch & Props;

class SectionOverview extends React.Component<AllProps> {
  render() {
    const { sections, measures } = this.props;

    const generateMatrix = (arr: string[], size: number) => {
      const res = [];
      for (let i = 0; i < arr.length; i = i + size)
        res.push(arr.slice(i, i + size));
      return res;
    };

    return (
      <>
        <Grid container direction="column">
          {sections.allIds.map((sectionId) => (
            <Grid item key={sectionId}>
              <Grid container direction="column">
                <Grid item key={sectionId + "_caption"}>
                  <Typography variant="caption">
                    {sections.byId[sectionId].type.toLowerCase()}
                  </Typography>
                </Grid>
                <Grid item key={sectionId + "_body"}>
                  <Grid
                    container
                    direction="column"
                    style={{ marginBottom: "5px" }}
                  >
                    {generateMatrix(sections.byId[sectionId].measures, 8).map(
                      (row) => (
                        <ButtonGroup
                          key={sectionId + "_buttonGroup_" + row[0]}
                          orientation="horizontal"
                          size="small"
                          style={{
                            height: "15px",
                            width: "10px",
                            padding: "0px"
                          }}
                        >
                          {row.map((measureId) => {
                            const measure: Measure = measures.byId[measureId];
                            const nextMeasure: Measure =
                              measures.byId[Number(measureId) + 1];
                            return (
                              <Square
                                key={measure.id}
                                value={measure.id}
                                bg={PeaksConfig.getColor(
                                  sections.byId[sectionId].type
                                )}
                                onClick={() =>
                                  this.props.updatedLoopSettings({
                                    start: measure.time,
                                    end: nextMeasure.time
                                  })
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
  onClick: () => void;
}> {
  render() {
    return (
      <Button
        {...this.props}
        style={{
          backgroundColor: this.props.bg
        }}
        onClick={() => this.props.onClick()}
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

const mapDispatchToProps = { updatedLoopSettings };
export default connect(mapStateToProps, mapDispatchToProps)(SectionOverview);
