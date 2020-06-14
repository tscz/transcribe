import {
  Button,
  ButtonGroup,
  createStyles,
  Grid,
  Typography,
  WithStyles,
  withStyles
} from "@material-ui/core";
import clsx from "clsx";
import { Measure, Measures, Sections, SectionType } from "model/model";
import React from "react";
import { connect } from "react-redux";
import { getMeasureEnd } from "states/analysis/analysisUtil";
import { updatedLoopSettings } from "states/audio/audioSlice";
import { ApplicationState } from "states/store";
import { getColor } from "styles/theme";

enum Area {
  OUTSIDE,
  LEFT,
  RIGHT,
  INSIDE,
  LEFT_AND_RIGHT
}

interface PropsFromState {
  sections: Sections;
  measures: Measures;
}

interface PropsFromDispatch {
  updatedLoopSettings: typeof updatedLoopSettings;
}

interface Props {}

type AllProps = PropsFromState &
  PropsFromDispatch &
  Props &
  WithStyles<typeof styles>;

interface State {
  start: number;
  end: number;
}

const styles = () =>
  createStyles({
    mainGrid: {
      marginBottom: "5px"
    },
    section: {}
  });

class SectionOverview extends React.Component<AllProps, State> {
  state: State = {
    start: 0,
    end: 0
  };

  getArea(measure: number) {
    if (this.state.start > measure || this.state.end < measure)
      return Area.OUTSIDE;

    if (measure === this.state.start && measure === this.state.end)
      return Area.LEFT_AND_RIGHT;

    if (measure === this.state.start) return Area.LEFT;

    if (measure === this.state.end) return Area.RIGHT;

    return Area.INSIDE;
  }

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
                            const position = Number(measureId);
                            return (
                              <Square
                                key={measure.id}
                                value={measure.id}
                                sectiontype={sections.byId[sectionId].type}
                                onClick={() => {
                                  if (position <= this.state.end) {
                                    this.setState(() => ({
                                      start: position,
                                      end: position
                                    }));
                                    this.props.updatedLoopSettings({
                                      start: measures.byId[position].time,
                                      end: getMeasureEnd(position, measures)
                                    });
                                  } else {
                                    this.setState(() => ({
                                      end: position
                                    }));
                                    this.props.updatedLoopSettings({
                                      end: getMeasureEnd(position, measures)
                                    });
                                  }
                                }}
                                position={this.getArea(position)}
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
      backgroundColor: (props: SquareProps) => getColor(props.sectiontype),
      minWidth: "12%",
      minHeight: "15px",
      padding: "0px",
      marginLeft: "2px",
      marginBottom: "2px",
      opacity: "0.7"
    },
    selected: {
      opacity: "1",
      borderTopColor: "#000000",
      borderBottomColor: "#000000"
    },
    selectedLeft: {
      borderLeftWidth: "4px",
      borderLeftColor: "#000000"
    },
    selectedRight: {
      borderRightWidth: "4px",
      borderRightColor: "#000000"
    }
  });

interface SquareProps {
  value: string;
  sectiontype: SectionType;
  onClick: () => void;
  position: Area;
}

type SquarePropsWithStyle = SquareProps & WithStyles<typeof squareStyles>;

const getCssClass = (props: SquarePropsWithStyle) => {
  switch (props.position) {
    case Area.OUTSIDE:
      return clsx(props.classes.root);
    case Area.INSIDE:
      return clsx(props.classes.root, props.classes.selected);
    case Area.LEFT:
      return clsx(
        props.classes.root,
        props.classes.selected,
        props.classes.selectedLeft
      );
    case Area.RIGHT:
      return clsx(
        props.classes.root,
        props.classes.selected,
        props.classes.selectedRight
      );
    case Area.LEFT_AND_RIGHT:
      return clsx(
        props.classes.root,
        props.classes.selected,
        props.classes.selectedLeft,
        props.classes.selectedRight
      );
  }
};

const Square = withStyles(squareStyles)((props: SquarePropsWithStyle) => {
  // Do not override the css classes from parent element
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { classes, ...other } = props;

  return (
    <Button
      {...other}
      onClick={() => props.onClick()}
      className={getCssClass(props)}
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
