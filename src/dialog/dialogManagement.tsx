import { saveAs } from "file-saver";
import JSZip from "jszip";
import React, { Component, FunctionComponent, useState } from "react";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";

import MusicFileInput from "../components/musicFileInput/musicFileInput";
import { reset } from "../store/analysis/actions";
import { closeDialog } from "../store/dialog/actions";
import { DialogType } from "../store/dialog/types";
import { createProject, switchPage } from "../store/project/actions";
import { Page } from "../store/project/types";
import store, { ApplicationState } from "../store/store";
import Dialog from "./dialog";

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
    let { project, analysis } = store.getState();

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
          <Dialog
            title="Open existing Analysis"
            onCancel={this.props.closeDialog}
          >
            <p>Open existing Analysis</p>
          </Dialog>
        );
      case DialogType.SAVE:
        return (
          <Dialog
            title="Save Analysis"
            onCancel={this.props.closeDialog}
            onSubmit={() => {
              this.save(this.props.audioUrl);
              this.props.closeDialog();
            }}
          >
            <p>Save Analysis</p>
          </Dialog>
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

  const handleChange = (event: any) => setTitle(event.target.value);

  return (
    <Dialog
      title="Create new Analysis"
      onSubmit={() => props.onSubmit(title, fileUrl)}
      onCancel={props.onCancel}
    >
      <Form>
        <Form.Group controlId="title">
          <Form.Label>Project title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            This title will be used for the new analysis project.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="file">
          <Form.Label>Song file</Form.Label>
          <br />
          <MusicFileInput
            callback={(file, fileUrl) => {
              setFileUrl(fileUrl);
            }}
          ></MusicFileInput>
          <Form.Text className="text-muted">
            Please select a MP3 file as basis for your analysis.
          </Form.Text>
        </Form.Group>
      </Form>
    </Dialog>
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
