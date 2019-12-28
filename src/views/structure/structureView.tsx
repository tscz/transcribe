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
          {this.props.sections.map(section => (
            <TableRow key={section.id}>
              <TableCell component="th" scope="row">
                <IconButton
                  onClick={() => this.handleRemoveSection(section.id!)}
                >
                  <RemoveIcon></RemoveIcon>
                </IconButton>
              </TableCell>
              <TableCell>{section.type}</TableCell>
              <TableCell>{section.startTime}</TableCell>
              <TableCell>{section.endTime}</TableCell>
            </TableRow>
          ))}
          <TableRow key="last">
            <TableCell component="th" scope="row">
              <IconButton
                onClick={() => {
                  this.handleAddSection({
                    endTime: Math.random(),
                    startTime: 34,
                    type: SectionType.OUTRO,
                    id:
                      Math.random()
                        .toString(36)
                        .substring(2, 15) +
                      Math.random()
                        .toString(36)
                        .substring(2, 15)
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
