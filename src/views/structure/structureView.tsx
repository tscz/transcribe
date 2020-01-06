import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import React, { Component } from "react";
import { connect } from "react-redux";

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

interface PropsFromState {
  readonly sections: NormalizedObjects<Section>;
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
    if (after.firstMeasure >= after.lastMeasure) return;

    this.props.updatedSection({ before: id, after });
  };

  handleRemoveSection = (id: string) => {
    this.props.removedSection(id);
  };

  render() {
    return (
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
            console.log("render with " + JSON.stringify(this.props.sections));
            return (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  <IconButton onClick={() => this.handleRemoveSection(id)}>
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
                    value={section.firstMeasure}
                    min={0}
                    max={99}
                    onChange={measure =>
                      this.handleUpdatedSection(id, section, {
                        ...section,
                        firstMeasure: measure
                      })
                    }
                  />
                </TableCell>
                <TableCell>
                  <MeasureSelect
                    value={section.lastMeasure}
                    min={0}
                    max={99}
                    onChange={measure =>
                      this.handleUpdatedSection(id, section, {
                        ...section,
                        lastMeasure: measure
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
                    firstMeasure: 1,
                    lastMeasure: 4
                  });
                }}
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
    );
  }
}

const mapStateToProps = ({ analysis }: ApplicationState) => {
  return {
    sections: analysis.sections
  };
};

const mapDispatchToProps = {
  addedSection,
  updatedSection,
  removedSection
};
export default connect(mapStateToProps, mapDispatchToProps)(StructureView);
