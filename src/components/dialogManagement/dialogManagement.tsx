import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import React, { Component, FunctionComponent, useState } from "react";
import { connect } from "react-redux";

import TranscriptionApi from "../../api/transcriptionApi";
import { resettedAnalysis } from "../../states/analysisSlice";
import { closedDialog, DialogType } from "../../states/dialogsSlice";
import { createdProject, Page, switchedPage } from "../../states/projectSlice";
import store, { ApplicationState } from "../../states/store";
import FileInput, { FileType } from "../fileInput/fileInput";
import ModalDialog from "../modalDialog/modalDialog";

interface PropsFromState {
  type: DialogType;
  audioUrl: string;
}

interface PropsFromDispatch {
  switchedPage: typeof switchedPage;
  resettedAnalysis: typeof resettedAnalysis;
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
              this.props.resettedAnalysis();
              this.props.createdProject({ title, audioUrl });
              this.props.switchedPage(Page.STRUCTURE);
              this.props.closedDialog();
            }}
          ></NewDialog>
        );
      case DialogType.OPEN:
        return (
          <OpenDialog
            onCancel={() => this.props.closedDialog()}
            onSubmit={(zipUrl: string) => {
              TranscriptionApi.open(
                zipUrl,
                zipUrl => {
                  this.props.resettedAnalysis();
                },
                (mp3url, state) => {
                  this.props.createdProject({
                    title: "readFromState",
                    audioUrl: mp3url
                  });
                  this.props.switchedPage(Page.STRUCTURE);
                  this.props.closedDialog();
                }
              );
            }}
          ></OpenDialog>
        );
      case DialogType.SAVE:
        return (
          <ModalDialog
            title="Save Transcription"
            onCancel={this.props.closedDialog}
            actions={[
              {
                label: "Save",
                onClick: () => {
                  TranscriptionApi.save("transcription.zip", {
                    mp3url: this.props.audioUrl,
                    state: store.getState()
                  });
                  this.props.closedDialog();
                }
              }
            ]}
          >
            <p>Save Transcription</p>
          </ModalDialog>
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

  const handleTitleChange = (event: any) => setTitle(event.target.value);

  return (
    <ModalDialog
      title="Create new Transcription"
      actions={[
        {
          label: "Create",
          onClick: () => props.onSubmit(title, fileUrl)
        }
      ]}
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
  onSubmit: (fileUrl: string) => void;
  onCancel: () => void;
}> = props => {
  const [fileUrl, setFileUrl] = useState("");

  return (
    <ModalDialog
      title="Open Transcription"
      onCancel={props.onCancel}
      actions={[
        {
          label: "Open",
          onClick: () => props.onSubmit(fileUrl)
        }
      ]}
    >
      <FormControl>
        <FileInput
          fileType={FileType.ZIP}
          id="zip_file"
          callback={(file, fileUrl) => {
            setFileUrl(fileUrl);
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
  resettedAnalysis,
  createdProject
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogManagement);
