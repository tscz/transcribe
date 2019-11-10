import "./app.css";

import {
  faFile,
  faFolderOpen,
  faSave
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import React from "react";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { connect } from "react-redux";

import { Page } from "../../constants";
import Dialog from "../../dialogs/dialog";
import DefaultPage from "../../pages/defaultPage";
import DrumPage from "../../pages/drumPage";
import GuitarPage from "../../pages/guitarPage";
import HarmonyPage from "../../pages/harmonyPage";
import PrintPage from "../../pages/printPage";
import StructurePage from "../../pages/structurePage";
import { switchPage } from "../../store/project/actions";
import { ProjectState } from "../../store/project/types";
import store, { ApplicationState } from "../../store/store";
import MusicFileInput from "../musicFileInput/musicFileInput";

interface PropsFromState extends ProjectState {}

interface PropsFromDispatch {
  switchPage: typeof switchPage;
}

type AllProps = PropsFromState & PropsFromDispatch;

class App extends React.Component<AllProps> {
  switchSong = (file: File, fileUrl: string) => {
    console.log("switchSong(file=" + file + ",fileUrl=" + fileUrl + ")");
    this.setState({ file: file, fileUrl: fileUrl });
  };

  tempSwitchSong = (file: File | null, fileUrl: string) => {
    this.tempFile = file;
    this.tempFileUrl = fileUrl;
  };

  analysisLoaded = () => {
    this.setState({ analysisStarted: true });
  };

  tempFile: File | null = null;
  tempFileUrl: string = "";

  state = {
    fileUrl: "",
    file: null,
    showNewDialog: false,
    showOpenDialog: false,
    showSaveDialog: false,
    showPreferencesDialog: false,
    showHelpDialog: false,
    analysisStarted: false
  };

  showNewDialog = () => {
    this.setState({ showNewDialog: true });
  };

  showOpenDialog = () => {
    this.setState({ showOpenDialog: true });
  };

  showSaveDialog = () => {
    this.setState({ showSaveDialog: true });
  };

  showPreferencesDialog = () => {
    this.setState({ showPreferencesDialog: true });
  };

  showHelpDialog = () => {
    this.setState({ showHelpDialog: true });
  };

  hideNewDialog = () => {
    this.setState({ showNewDialog: false });
  };

  hideOpenDialog = () => {
    this.setState({ showOpenDialog: false });
  };

  hideSaveDialog = () => {
    this.setState({ showSaveDialog: false });
  };

  hidePreferencesDialog = () => {
    this.setState({ showPreferencesDialog: false });
  };

  hideHelpDialog = () => {
    this.setState({ showHelpDialog: false });
  };

  render() {
    console.log("render app");
    return (
      <>
        <Dialog
          title="Create new Analysis"
          show={this.state.showNewDialog}
          onSubmit={() => {
            this.switchSong(this.tempFile!, this.tempFileUrl);
            this.analysisLoaded();
            this.props.switchPage(Page.STRUCTURE);
            this.hideNewDialog();
          }}
          onCancel={() => {
            this.hideNewDialog();
          }}
        >
          <Form>
            <Form.Group controlId="title">
              <Form.Label>Project title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" />
              <Form.Text className="text-muted">
                This title will be used for the new analysis project.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="file">
              <Form.Label>Song file</Form.Label>
              <br />
              <MusicFileInput callback={this.tempSwitchSong}></MusicFileInput>
              <Form.Text className="text-muted">
                Please select a MP3 file as basis for your analysis.
              </Form.Text>
            </Form.Group>
          </Form>
        </Dialog>

        <Dialog
          title="Open existing Analysis"
          show={this.state.showOpenDialog}
          onCancel={this.hideOpenDialog}
        >
          <p>Open existing Analysis</p>
        </Dialog>

        <Dialog
          title="Save Analysis"
          show={this.state.showSaveDialog}
          onCancel={this.hideSaveDialog}
          onSubmit={() => {
            this.save();
            this.hideSaveDialog();
          }}
        >
          <p>Save Analysis</p>
        </Dialog>

        <Dialog
          title="Preferences"
          show={this.state.showPreferencesDialog}
          onCancel={this.hidePreferencesDialog}
        >
          <p>Save Analysis</p>
        </Dialog>

        <Dialog
          title="Help"
          show={this.state.showHelpDialog}
          onCancel={this.hideHelpDialog}
        >
          <p>Help</p>
        </Dialog>

        <Navbar
          bg="dark"
          variant="dark"
          expand="sm"
          sticky="top"
          className="navbar navbar-expand-lg navbar-light bg-light border-bottom"
        >
          <Navbar.Brand>Transcribe</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={this.showNewDialog}>
                <FontAwesomeIcon icon={faFile} />
              </Nav.Link>
              <Nav.Link onClick={this.showOpenDialog}>
                {" "}
                <FontAwesomeIcon icon={faFolderOpen} />
              </Nav.Link>
              <Nav.Link onClick={this.showSaveDialog}>
                {" "}
                <FontAwesomeIcon icon={faSave} />
              </Nav.Link>
              {this.state.analysisStarted && (
                <>
                  <Nav.Link
                    onClick={() => this.props.switchPage(Page.STRUCTURE)}
                  >
                    Structure
                  </Nav.Link>
                  <Nav.Link onClick={() => this.props.switchPage(Page.HARMONY)}>
                    Harmony
                  </Nav.Link>
                  <Nav.Link onClick={() => this.props.switchPage(Page.GUITAR)}>
                    Guitar
                  </Nav.Link>
                  <Nav.Link onClick={() => this.props.switchPage(Page.DRUM)}>
                    Drum
                  </Nav.Link>
                  <Nav.Link onClick={() => this.props.switchPage(Page.PRINT)}>
                    Print
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div id="page-content-wrapper">
          <Toggle show={this.props.currentPage === Page.DEFAULT}>
            <DefaultPage />
          </Toggle>

          <Toggle show={this.props.currentPage === Page.STRUCTURE}>
            <StructurePage url={this.state.fileUrl} />
          </Toggle>

          <Toggle show={this.props.currentPage === Page.HARMONY}>
            <HarmonyPage />
          </Toggle>

          <Toggle show={this.props.currentPage === Page.GUITAR}>
            <GuitarPage />
          </Toggle>

          <Toggle show={this.props.currentPage === Page.DRUM}>
            <DrumPage />
          </Toggle>

          <Toggle show={this.props.currentPage === Page.PRINT}>
            <PrintPage />
          </Toggle>
        </div>
      </>
    );
  }

  save(): void {
    let analysis: any = Object.assign({}, this.state);
    analysis.globalstate = store.getState().segments;

    let zip = new JSZip();
    zip.file("analyis.json", JSON.stringify(analysis));
    zip.file("song.mp3", (this.state.file as unknown) as Blob);

    zip.generateAsync({ type: "blob" }).then(function(content) {
      // see FileSaver.js
      saveAs(content, "project.zip");
    });
  }
}

function Toggle(props: any) {
  if (props.show) {
    return <div style={{ display: "inline" }}>{props.children}</div>;
  } else {
    return <div style={{ display: "none" }}>{props.children}</div>;
  }
}

const mapStateToProps = ({ project }: ApplicationState) => {
  return {
    currentPage: project.currentPage,
    peaks: project.peaks
  };
};

const mapDispatchToProps = {
  switchPage
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
