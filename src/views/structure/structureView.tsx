import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import React, { Component } from "react";
import { connect } from "react-redux";

import Log from "../../components/log/log";
import MeasureSelect from "../../components/measureSelect/measureSelect";
import SectionSelect from "../../components/sectionSelect/sectionSelect";
import {
  addedSection,
  removedSection,
  Section,
  SectionType,
  updatedSection
} from "../../states/analysisSlice";
import { ApplicationState, NormalizedObjects } from "../../states/store";
import ArrayUtil from "../../util/ArrayUtil";

interface PropsFromState {
  readonly sections: NormalizedObjects<Section>;
  readonly measuresCount: number;
}

interface PropsFromDispatch {
  addedSection: typeof addedSection;
  updatedSection: typeof updatedSection;
  removedSection: typeof removedSection;
}

type AllProps = PropsFromState & PropsFromDispatch;

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

    if (after.measures[0] > after.measures[after.measures.length - 1]) return;

    this.props.updatedSection({ before: id, after });
  };

  handleRemoveSection = (id: string) => {
    this.props.removedSection(id);
  };

  render() {
    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "10%" }}></TableCell>
              <TableCell style={{ width: "30%" }}>Section</TableCell>
              <TableCell style={{ width: "30%" }}>First Measure</TableCell>
              <TableCell style={{ width: "30%" }}>Last Measure</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.sections.allIds.map((id: string) => {
              let section = this.props.sections.byId[id];
              return (
                <TableRow key={id}>
                  <TableCell component="th" scope="row">
                    <IconButton
                      onClick={() => this.handleRemoveSection(id)}
                      size="small"
                    >
                      <RemoveIcon></RemoveIcon>
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <SectionSelect
                      value={section.type}
                      onChange={sectionType =>
                        this.handleUpdatedSection(id, section, {
                          ...section,
                          type: sectionType
                        })
                      }
                    ></SectionSelect>
                  </TableCell>
                  <TableCell>
                    <MeasureSelect
                      value={parseInt(section.measures[0])}
                      min={0}
                      max={this.props.measuresCount - 1}
                      onChange={measure =>
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
                      value={parseInt(
                        section.measures[section.measures.length - 1]
                      )}
                      min={0}
                      max={this.props.measuresCount - 1}
                      onChange={measure =>
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
            <TableRow key="last">
              <TableCell component="th" scope="row">
                <IconButton
                  onClick={() => {
                    this.handleAddSection({
                      type: SectionType.SOLO,
                      measures: ["1", "2", "3", "4"]
                    });
                  }}
                  size="small"
                >
                  <AddIcon></AddIcon>
                </IconButton>
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
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
export default connect(mapStateToProps, mapDispatchToProps)(StructureView);
