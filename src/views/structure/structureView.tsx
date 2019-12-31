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

import SectionSelect from "../../components/sectionSelect/sectionSelect";
import {
  addedSection,
  removedSection,
  Section,
  SectionType,
  updatedSection
} from "../../states/analysisSlice";
import { ApplicationState } from "../../states/store";

interface PropsFromState {
  readonly sections: Section[];
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

  handleUpdatedSection = (before: Section, after: Section) => {
    this.props.updatedSection({ before, after });
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
          {this.props.sections.map((section: Section) => (
            <TableRow key={section.firstMeasure + "-" + section.lastMeasure}>
              <TableCell component="th" scope="row">
                <IconButton
                  onClick={() =>
                    this.handleRemoveSection(
                      section.firstMeasure + "-" + section.lastMeasure
                    )
                  }
                >
                  <RemoveIcon></RemoveIcon>
                </IconButton>
              </TableCell>
              <TableCell>
                <SectionSelect
                  value={section.type}
                  onChange={sectionType => {
                    this.handleUpdatedSection(section, {
                      ...section,
                      type: sectionType
                    });
                  }}
                ></SectionSelect>
              </TableCell>
              <TableCell>{section.firstMeasure}</TableCell>
              <TableCell>{section.lastMeasure}</TableCell>
            </TableRow>
          ))}
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
