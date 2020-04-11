import { FormLabel } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import React, { Component, FunctionComponent, useState } from "react";
import { connect } from "react-redux";

import PersistenceApi from "../../api/persistenceApi";
import {
  addedSection,
  initialAnalysisState,
  SectionType
} from "../../states/analysis/analysisSlice";
import { closedDialog, DialogType } from "../../states/dialog/dialogsSlice";
import {
  createdProject,
  initialProjectState,
  Page,
  switchedPage
} from "../../states/project/projectSlice";
import store, { ApplicationState } from "../../states/store";
import ArrayUtil from "../../util/ArrayUtil";
import FileInput, { FileType } from "../fileInput/fileInput";
import MeasureSelect from "../measureSelect/measureSelect";
import ModalDialog, { DialogAction } from "../modalDialog/modalDialog";
import SectionSelect from "../sectionSelect/sectionSelect";

interface PropsFromState {
  type: DialogType;
  audioUrl: string;
  maxMeasure: number;
}

interface PropsFromDispatch {
  switchedPage: typeof switchedPage;
  closedDialog: typeof closedDialog;
  createdProject: typeof createdProject;
  addedSection: typeof addedSection;
}

type AllProps = PropsFromState & PropsFromDispatch;

class DialogManagement extends Component<AllProps> {
  render() {
    switch (this.props.type) {
      case DialogType.NONE:
        return null;
      case DialogType.NEW:
        return (
          <NewDialog
            onCancel={() => this.props.closedDialog()}
            onSubmit={(title: string, audioUrl: string) => {
              this.props.createdProject({
                analysis: initialAnalysisState,
                project: { ...initialProjectState, audioUrl, title }
              });
              this.props.switchedPage(Page.STRUCTURE);
              this.props.closedDialog();
            }}
          ></NewDialog>
        );
      case DialogType.OPEN:
        return (
          <OpenDialog
            onCancel={() => this.props.closedDialog()}
            onSubmit={(zip: File, zipUrl: string) => {
              PersistenceApi.open(zip).then(({ audioBlob, state }) => {
                const audioUrl = PersistenceApi.getLocalFileUrl(audioBlob);
                PersistenceApi.revokeLocalFile(zipUrl);

                this.props.createdProject({
                  analysis: state.analysis,
                  project: { ...state.project, audioUrl }
                });
                this.props.switchedPage(Page.STRUCTURE);
                this.props.closedDialog();
              });
            }}
          ></OpenDialog>
        );
      case DialogType.SAVE:
        return (
          <ModalDialog
            title="Save Transcription"
            subTitle="Please click on 'save' to generate a transcription.zip file. It contains the transcription and the source audio file."
            onCancel={() => this.props.closedDialog()}
            actions={[
              {
                label: "Cancel",
                onClick: () => this.props.closedDialog()
              },
              {
                label: "Save",
                onClick: () => {
                  PersistenceApi.save("transcription.zip", {
                    audioFileUrl: this.props.audioUrl,
                    state: store.getState()
                  });
                  this.props.closedDialog();
                }
              }
            ]}
          ></ModalDialog>
        );
      case DialogType.ADD_SECTION:
        return (
          <AddSectionDialog
            maxMeasure={this.props.maxMeasure}
            onCancel={() => this.props.closedDialog()}
            onSubmit={(sectionType, start, end) => {
              this.props.addedSection({
                measures: ArrayUtil.range(start, end),
                type: sectionType
              });
              this.props.closedDialog();
            }}
          ></AddSectionDialog>
        );
      default:
        throw Error();
    }
  }
}

const NewDialog: FunctionComponent<{
  onSubmit: (title: string, fileUrl: string) => void;
  onCancel: () => void;
}> = (props) => {
  const [fileUrl, setFileUrl] = useState("");
  const [title, setTitle] = useState("");
  const actions: () => DialogAction[] = () => {
    return [
      {
        label: "Cancel",
        onClick: () => props.onCancel()
      },
      {
        label: "Create",
        onClick: () => props.onSubmit(title, fileUrl),
        disabled: fileUrl === "" || title === ""
      }
    ];
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(event.target.value);

  return (
    <ModalDialog
      title="Create new Transcription"
      subTitle="Please add a project title and select an audio file from your hard disk below."
      actions={actions()}
      onCancel={props.onCancel}
    >
      <FormControl fullWidth>
        <TextField
          id="title"
          label="Project title"
          margin="normal"
          InputProps={{
            readOnly: false
          }}
          variant="outlined"
          onChange={handleTitleChange}
        />
        <FileInput
          fileType={FileType.AUDIO}
          id="audio_file"
          callback={(file, fileUrl) => {
            setFileUrl(fileUrl);
          }}
        ></FileInput>
      </FormControl>
    </ModalDialog>
  );
};

const OpenDialog: FunctionComponent<{
  onSubmit: (file: File, fileUrl: string) => void;
  onCancel: () => void;
}> = (props) => {
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState<File>();
  const actions: () => DialogAction[] = () => {
    return [
      {
        label: "Cancel",
        onClick: () => props.onCancel()
      },
      {
        label: "Open",
        onClick: () => {
          if (!file) throw Error("file undefined");

          props.onSubmit(file, fileUrl);
        },
        disabled: fileUrl === ""
      }
    ];
  };

  return (
    <ModalDialog
      title="Open Transcription"
      subTitle="Please select a project zip file from your hard disk below."
      onCancel={props.onCancel}
      actions={actions()}
    >
      <FormControl fullWidth>
        <FileInput
          fileType={FileType.ZIP}
          id="zip_file"
          callback={(file, fileUrl) => {
            setFileUrl(fileUrl);
            setFile(file);
          }}
        ></FileInput>
      </FormControl>
    </ModalDialog>
  );
};

const AddSectionDialog: FunctionComponent<{
  maxMeasure: number;
  onSubmit: (sectionType: SectionType, start: number, end: number) => void;
  onCancel: () => void;
}> = (props) => {
  const [sectionType, setSectionType] = useState(SectionType.INTRO);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const actions: () => DialogAction[] = () => {
    return [
      {
        label: "Cancel",
        onClick: () => props.onCancel()
      },
      {
        label: "Add",
        onClick: () => props.onSubmit(sectionType, start, end),
        disabled: sectionType === SectionType.UNDEFINED || start > end
      }
    ];
  };

  return (
    <ModalDialog
      title="Add new Section"
      subTitle="Please define section and add it to the song structure."
      actions={actions()}
      onCancel={props.onCancel}
    >
      <FormControl fullWidth style={{ marginBottom: "20px" }}>
        <FormLabel component="legend">Section Type</FormLabel>
        <SectionSelect
          value={sectionType}
          onChange={(sectionType) => setSectionType(sectionType)}
        ></SectionSelect>
      </FormControl>
      <FormControl fullWidth style={{ marginBottom: "20px" }}>
        <FormLabel component="legend">First Measure</FormLabel>
        <MeasureSelect
          value={start}
          min={0}
          max={props.maxMeasure}
          onChange={(value) => setStart(value)}
        />
      </FormControl>
      <FormControl fullWidth style={{ marginBottom: "20px" }}>
        <FormLabel component="legend">Last Measure</FormLabel>
        <MeasureSelect
          value={end}
          min={0}
          max={props.maxMeasure}
          onChange={(value) => setEnd(value)}
        />
      </FormControl>
    </ModalDialog>
  );
};

const mapStateToProps = ({ dialog, project, analysis }: ApplicationState) => {
  return {
    type: dialog.currentDialog,
    audioUrl: project.audioUrl,
    maxMeasure: analysis.measures.allIds.length - 1
  };
};

const mapDispatchToProps = {
  closedDialog,
  switchedPage,
  createdProject,
  addedSection
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogManagement);
