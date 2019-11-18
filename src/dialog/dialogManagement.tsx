import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import React, { Component, FunctionComponent, useState } from "react";
import { connect } from "react-redux";

import MusicFileInput from "../components/musicFileInput/musicFileInput";
import { reset } from "../store/analysis/actions";
import { closeDialog } from "../store/dialog/actions";
import { DialogType } from "../store/dialog/types";
import { createProject, switchPage } from "../store/project/actions";
import { Page } from "../store/project/types";
import store, { ApplicationState } from "../store/store";
import Dialog2 from "./dialog";

interface PropsFromState {
  type: DialogType;
  audioUrl: string;
}

interface PropsFromDispatch {
  switchPage: typeof switchPage;
  reset: typeof reset;
  closeDialog: typeof closeDialog;
  createProject: typeof createProject;
}

type AllProps = PropsFromState & PropsFromDispatch;

class DialogManagement extends Component<AllProps> {
  async save(url: string): Promise<void> {
    let { analysis } = store.getState();

    let persistentState: any = Object.assign({}, { analysis });

    let zip = new JSZip();
    zip.file("analyis.json", JSON.stringify(persistentState));

    let blob: Blob = await fetch(url).then(r => r.blob());

    zip.file("song.mp3", blob);

    zip.generateAsync({ type: "blob" }).then(function(content) {
      // see FileSaver.js
      saveAs(content, "project.zip");
    });
  }

  render() {
    switch (this.props.type) {
      case DialogType.NONE:
        return null;
      case DialogType.NEW:
        return (
          <NewDialog
            onCancel={() => this.props.closeDialog()}
            onSubmit={(title: string, fileUrl: string) => {
              this.props.reset();
              this.props.createProject(title, fileUrl);
              this.props.switchPage(Page.STRUCTURE);
              this.props.closeDialog();
            }}
          ></NewDialog>
        );
      case DialogType.OPEN:
        return (
          <Dialog2
            title="Open existing Analysis"
            onCancel={this.props.closeDialog}
          >
            <p>Open existing Analysis</p>
          </Dialog2>
        );
      case DialogType.SAVE:
        return (
          <Dialog2
            title="Save Analysis"
            onCancel={this.props.closeDialog}
            onSubmit={() => {
              this.save(this.props.audioUrl);
              this.props.closeDialog();
            }}
          >
            <p>Save Analysis</p>
          </Dialog2>
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
    <Dialog2
      title="Create new Analysis"
      onSubmit={() => props.onSubmit(title, fileUrl)}
      onCancel={props.onCancel}
    >
      <FormControl>
        <TextField
          id="title"
          label="Project title"
          defaultValue="This title will be used for the new analysis project."
          margin="normal"
          InputProps={{
            readOnly: false
          }}
          variant="outlined"
          onChange={handleTitleChange}
        />
        <MusicFileInput
          callback={(file, fileUrl) => {
            setFileUrl(fileUrl);
          }}
        ></MusicFileInput>
      </FormControl>
    </Dialog2>
  );
};

const mapStateToProps = ({ dialog, project }: ApplicationState) => {
  return {
    type: dialog.currentDialog,
    audioUrl: project.audioUrl
  };
};

const mapDispatchToProps = {
  closeDialog,
  switchPage,
  reset,
  createProject
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogManagement);
