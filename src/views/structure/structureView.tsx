/* eslint-disable react/display-name */
import {
  createStyles,
  Snackbar,
  SnackbarContent,
  WithStyles,
  withStyles
} from "@material-ui/core";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import MaterialTable, {
  Column,
  Icons,
  MaterialTableProps
} from "material-table";
import React, { Component, forwardRef } from "react";
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

const tableIcons: Icons = {
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />)
};

interface Props {
  setClick: (a: () => void) => void;
}

interface PropsFromState {
  readonly sections: NormalizedObjects<Section>;
  readonly measuresCount: string[];
}

interface PropsFromDispatch {
  addedSection: typeof addedSection;
  updatedSection: typeof updatedSection;
  removedSection: typeof removedSection;
}

type AllProps = Props &
  PropsFromState &
  PropsFromDispatch &
  WithStyles<typeof styles>;

interface SectionConfig {
  type: SectionType;
  start: number;
  end: number;
}

const toSectionConfig: (
  sections: NormalizedObjects<Section>
) => SectionConfig[] = (sections) => {
  const result: SectionConfig[] = [];

  console.log("Sections=" + JSON.stringify(sections));

  sections.allIds.forEach((id) => {
    const section = sections.byId[id];

    result.push({
      type: section.type,
      start: parseInt(section.measures[0]),
      end: parseInt(section.measures[section.measures.length - 1])
    });
  });

  return result;
};

class StructureView extends Component<AllProps> {
  generateColumns: () => Column<SectionConfig>[] = () => {
    return [
      {
        title: "Section",
        field: "type",
        lookup: SectionType,
        initialEditValue: SectionType.UNDEFINED,
        sorting: false
      },
      {
        title: "Start",
        field: "start",
        lookup: this.props.measuresCount,
        initialEditValue: 1,
        defaultSort: "asc"
      },
      {
        title: "End",
        field: "end",
        lookup: this.props.measuresCount,
        initialEditValue: 1,
        sorting: false
      }
    ];
  };

  state: MaterialTableProps<SectionConfig> & { open: boolean } = {
    open: false,
    columns: this.generateColumns(),
    data: toSectionConfig(this.props.sections)
  };

  componentDidUpdate(prevProps: AllProps) {
    if (this.props.sections !== prevProps.sections) {
      this.setState({ data: toSectionConfig(this.props.sections) });
    }
    if (this.props.measuresCount !== prevProps.measuresCount) {
      this.setState({
        data: toSectionConfig(this.props.sections),
        columns: this.generateColumns()
      });
    }
  }

  componentDidMount() {
    this.props.setClick(this.addFunction);
  }

  handleClose = () => {
    this.setState({ ...this.state, open: false });
  };

  error = () => {
    this.setState({ ...this.state, open: true });
  };

  handleAddSection = (section: Section) => {
    this.props.addedSection(section);
  };

  handleUpdatedSection = (id: string, before: Section, after: Section) => {
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

  addFunction: () => void = () => {
    //
  };

  render() {
    return (
      <>
        <Snackbar
          open={this.state.open}
          autoHideDuration={2000}
          onClose={this.handleClose}
        >
          <SnackbarContent message="An error occured while updating song sections." />
        </Snackbar>
        <MaterialTable
          icons={tableIcons}
          options={{
            actionsColumnIndex: 0,
            search: false,
            toolbar: true,
            paging: false,
            draggable: false
          }}
          localization={{
            header: {
              actions: "Edit/Delete"
            },
            body: {
              editRow: {
                deleteText: "Are you sure you want to delete this section?"
              }
            }
          }}
          columns={this.state.columns}
          data={this.state.data}
          components={{
            Toolbar: (props) => {
              // Do not render a toolbar but extract the onClick handler of the add button for re-use
              this.addFunction = props.actions[0].onClick;
              return <></>;
            },
            Container: (props) => props.children
          }}
          editable={{
            onRowAdd: (newData) => {
              console.log("newData:" + JSON.stringify(newData));

              return new Promise((resolve) => {
                this.props.addedSection({
                  type: newData.type,
                  measures: ArrayUtil.range(newData.start, newData.end)
                });
                resolve();
              });
            },
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  if (newData.end > 5) {
                    reject("Measure End is too large");
                    this.error();
                    return;
                  }
                  {
                    const data2 = [...(this.state.data as SectionConfig[])];
                    const index = data2.indexOf(oldData!);
                    data2[index] = newData;
                    this.setState({ data: data2 }, () => resolve());
                  }
                  resolve();
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  {
                    const data3 = [...(this.state.data as SectionConfig[])];

                    const index = data3.indexOf(oldData);
                    data3.splice(index, 1);
                    this.setState({ data: data3 }, () => resolve());
                  }
                  resolve();
                }, 1000);
              })
          }}
        />
      </>
    );
  }
}

const mapStateToProps = ({ analysis }: ApplicationState) => {
  return {
    sections: analysis.sections,
    measuresCount: ArrayUtil.rangeObject(0, analysis.measures.allIds.length - 1)
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
  //
  mapStateToProps,
  mapDispatchToProps
)(
  //
  withStyles(styles, { withTheme: true })(StructureView)
);
