import {
  Button,
  ButtonGroup,
  createStyles,
  Grid,
  Typography,
  WithStyles,
  withStyles
} from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Measure, Section, SectionType } from "states/analysis/analysisSlice";
import { updatedLoopSettings } from "states/audio/audioSlice";
import { ApplicationState, NormalizedObjects } from "states/store";
import { getColor } from "styles/theme";

interface PropsFromState {
  sections: NormalizedObjects<Section>;
  measures: NormalizedObjects<Measure>;
}

interface PropsFromDispatch {
  updatedLoopSettings: typeof updatedLoopSettings;
}

interface Props {}

type AllProps = PropsFromState &
  PropsFromDispatch &
  Props &
  WithStyles<typeof styles>;

const styles = () =>
  createStyles({
    mainGrid: {
      marginBottom: "5px"
    },
    section: {}
  });

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
                    className={this.props.classes.mainGrid}
                  >
                    {generateMatrix(sections.byId[sectionId].measures, 8).map(
                      (row) => (
                        <ButtonGroup
                          key={sectionId + "_buttonGroup_" + row[0]}
                          orientation="horizontal"
                          size="small"
                          className={this.props.classes.section}
                        >
                          {row.map((measureId) => {
                            const measure: Measure = measures.byId[measureId];
                            const nextMeasure: Measure =
                              measures.byId[Number(measureId) + 1];
                            return (
                              <Square
                                key={measure.id}
                                value={measure.id}
                                sectionType={sections.byId[sectionId].type}
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

const squareStyles = () =>
  createStyles({
    root: {
      backgroundColor: (props: SquareProps) => getColor(props.sectionType),
      minWidth: "12%",
      minHeight: "15px",
      padding: "0px",
      marginLeft: "2px",
      marginBottom: "2px"
    }
  });

interface SquareProps {
  value: string;
  sectionType: SectionType;
  onClick: () => void;
}

type SquarePropsWithStyle = SquareProps & WithStyles<typeof squareStyles>;

const Square = withStyles(squareStyles)((props: SquarePropsWithStyle) => {
  return (
    <Button
      {...props}
      onClick={() => props.onClick()}
      className={props.classes.root}
    >
      {props.value}
    </Button>
  );
});

const mapStateToProps = ({ analysis }: ApplicationState) => {
  return {
    sections: analysis.sections,
    measures: analysis.measures
  };
};

const mapDispatchToProps = { updatedLoopSettings };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(SectionOverview));
