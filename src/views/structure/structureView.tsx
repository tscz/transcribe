import {
  createStyles,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  WithStyles,
  withStyles
} from "@material-ui/core";
import RemoveIcon from "@material-ui/icons/Remove";
import Log from "components/log/log";
import MeasureSelect from "components/measureSelect/measureSelect";
import SectionSelect from "components/sectionSelect/sectionSelect";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  addedSection,
  removedSection,
  Section,
  SectionType,
  updatedSection
} from "states/analysis/analysisSlice";
import { ApplicationState, NormalizedObjects } from "states/store";
import ArrayUtil from "util/ArrayUtil";

interface PropsFromState {
  readonly sections: NormalizedObjects<Section>;
  readonly measuresCount: number;
}

interface PropsFromDispatch {
  addedSection: typeof addedSection;
  updatedSection: typeof updatedSection;
  removedSection: typeof removedSection;
}

type AllProps = PropsFromState & PropsFromDispatch & WithStyles<typeof styles>;

class StructureView extends Component<AllProps> {
  handleAddSection = (section: Section) => {
    this.props.addedSection(section);
  };

  handleUpdatedSection = (id: string, before: Section, after: Section) => {
    Log.info(
      "Change section " +
        id +
        " from " +
        JSON.stringify(before) +
        " to " +
        JSON.stringify(after),
      StructureView.name
    );

    if (
      parseInt(after.measures[0]) >
      parseInt(after.measures[after.measures.length - 1])
    )
      return;

    this.props.updatedSection({ before: id, after });
  };

  handleRemoveSection = (id: string) => {
    this.props.removedSection(id);
  };

  render() {
    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className={this.props.classes.column1}></TableCell>
              <TableCell className={this.props.classes.column2}>
                Section
              </TableCell>
              <TableCell className={this.props.classes.column3}>
                First Measure
              </TableCell>
              <TableCell className={this.props.classes.column4}>
                Last Measure
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.sections.allIds.map((id: string) => {
              const section = this.props.sections.byId[id];
              return (
                <TableRow key={id}>
                  <TableCell component="th" scope="row">
                    {section.type !== SectionType.UNDEFINED && (
                      <IconButton
                        onClick={() => this.handleRemoveSection(id)}
                        size="small"
                      >
                        <RemoveIcon></RemoveIcon>
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>
                    {section.type === SectionType.UNDEFINED ? (
                      "UNDEFINED"
                    ) : (
                      <SectionSelect
                        value={section.type}
                        onChange={(sectionType) =>
                          this.handleUpdatedSection(id, section, {
                            ...section,
                            type: sectionType
                          })
                        }
                      ></SectionSelect>
                    )}
                  </TableCell>
                  <TableCell>
                    <MeasureSelect
                      disabled={section.type === SectionType.UNDEFINED}
                      value={parseInt(section.measures[0])}
                      min={0}
                      max={this.props.measuresCount - 1}
                      onChange={(measure) =>
                        this.handleUpdatedSection(id, section, {
                          ...section,
                          measures: ArrayUtil.range(
                            measure,
                            parseInt(
                              section.measures[section.measures.length - 1]
                            )
                          )
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <MeasureSelect
                      disabled={section.type === SectionType.UNDEFINED}
                      value={parseInt(
                        section.measures[section.measures.length - 1]
                      )}
                      min={0}
                      max={this.props.measuresCount - 1}
                      onChange={(measure) =>
                        this.handleUpdatedSection(id, section, {
                          ...section,
                          measures: ArrayUtil.range(
                            parseInt(section.measures[0]),
                            measure
                          )
                        })
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

const mapStateToProps = ({ analysis }: ApplicationState) => {
  return {
    sections: analysis.sections,
    measuresCount: analysis.measures.allIds.length
  };
};

const mapDispatchToProps = {
  addedSection,
  updatedSection,
  removedSection
};

const styles = () =>
  createStyles({
    column1: {
      width: "10%"
    },
    column2: {
      width: "30%"
    },
    column3: {
      width: "30%"
    },
    column4: {
      width: "30%"
    }
  });
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(StructureView));
