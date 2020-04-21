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
import MaterialTable, { Icons, MaterialTableProps } from "material-table";
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
  readonly measuresCount: number;
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

class StructureView extends Component<AllProps> {
  state: MaterialTableProps<SectionConfig> & { open: boolean } = {
    open: false,
    columns: [
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
        lookup: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6" },
        initialEditValue: 1,
        defaultSort: "asc"
      },
      {
        title: "End",
        field: "end",
        lookup: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6" },
        initialEditValue: 1,
        sorting: false
      }
    ],
    data: [
      {
        type: SectionType.BRIDGE,
        start: 1,
        end: 3
      },
      {
        type: SectionType.CHORUS,
        start: 4,
        end: 5
      }
    ]
  };

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
          <SnackbarContent message="I love snacks." />
        </Snackbar>
        <MaterialTable
          icons={tableIcons}
          options={{
            actionsColumnIndex: 3,
            search: false,
            toolbar: true,
            paging: false,
            draggable: false
          }}
          localization={{
            header: {
              actions: "Edit/Delete"
            }
          }}
          columns={this.state.columns}
          data={this.state.data}
          components={{
            Toolbar: (props) => {
              // Do not render a toolbar but extract the onClick handler of the add button for re-use
              this.addFunction = props.actions[0].onClick;
              return <></>;
            }
          }}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  {
                    const data = [...(this.state.data as SectionConfig[])];
                    data.push(newData);
                    this.setState({ data }, () => resolve());
                  }
                  resolve();
                }, 1000);
              }),
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
  //
  mapStateToProps,
  mapDispatchToProps
)(
  //
  withStyles(styles, { withTheme: true })(StructureView)
);
