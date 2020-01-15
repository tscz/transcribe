import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import React, { Component, FunctionComponent, useState } from "react";
import { connect } from "react-redux";

import PersistenceApi from "../../api/persistenceApi";
import { initialAnalysisState } from "../../states/analysisSlice";
import { closedDialog, DialogType } from "../../states/dialogsSlice";
import {
  createdProject,
  initialProjectState,
  Page,
  switchedPage
} from "../../states/projectSlice";
import store, { ApplicationState } from "../../states/store";
import FileInput, { FileType } from "../fileInput/fileInput";
import ModalDialog, { DialogAction } from "../modalDialog/modalDialog";

interface PropsFromState {
  type: DialogType;
  audioUrl: string;
}

interface PropsFromDispatch {
  switchedPage: typeof switchedPage;
  closedDialog: typeof closedDialog;
  createdProject: typeof createdProject;
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
                let audioUrl = PersistenceApi.getLocalFileUrl(audioBlob);
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
            onCancel={this.props.closedDialog}
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
      default:
        return null;
    }
  }
}

const NewDialog: FunctionComponent<{
  onSubmit: (title: string, fileUrl: string) => void;
  onCancel: () => void;
}> = props => {
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

  const handleTitleChange = (event: any) => setTitle(event.target.value);

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
}> = props => {
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
        onClick: () => props.onSubmit(file!, fileUrl),
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

const mapStateToProps = ({ dialog, project }: ApplicationState) => {
  return {
    type: dialog.currentDialog,
    audioUrl: project.audioUrl
  };
};

const mapDispatchToProps = {
  closedDialog,
  switchedPage,
  createdProject
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogManagement);
