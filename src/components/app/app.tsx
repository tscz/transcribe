import FileSaver from "file-saver";
import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import "./app.css";
import Dialog from "../../dialogs/dialog";
import DrumPage from "../../pages/drumPage";
import HarmonyPage from "../../pages/harmonyPage";
import PrintPage from "../../pages/printPage";
import StructurePage from "../../pages/structurePage";
import StrummingPage from "../../pages/strummingPage";
import MusicFileInput from "../musicFileInput/musicFileInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faFolderOpen,
  faSave
} from "@fortawesome/free-solid-svg-icons";
import DefaultPage from "../../pages/defaultPage";

class App extends React.Component {
  switchSong = (file: File, fileUrl: string) => {
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

  readonly defaultPage = 0;
  readonly structurePage = 1;
  readonly harmonyPage = 2;
  readonly drumPage = 3;
  readonly guitarPage = 4;
  readonly printPage = 5;
  readonly initialVisibility = [false, false, false, false, false, false];

  state = {
    visibility: [true, false, false, false, false, false],
    currentPage: this.defaultPage,
    fileUrl: "",
    file: null,
    showNewDialog: false,
    showOpenDialog: false,
    showSaveDialog: false,
    showPreferencesDialog: false,
    showHelpDialog: false,
    analysisStarted: false
  };

  constructor(props: any) {
    super(props);

    console.log("1=" + this + typeof this);
  }

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

  switchPage(page: number) {
    let nextVisibility = [...this.initialVisibility];
    nextVisibility[page] = true;

    this.setState({ visibility: nextVisibility, currentPage: page });
  }

  render() {
    console.log("render App with src=" + this.state.fileUrl);

    return (
      <>
        <Dialog
          title="Create new Analysis"
          show={this.state.showNewDialog}
          onSubmit={() => {
            this.switchSong(this.tempFile!, this.tempFileUrl);
            this.analysisLoaded();
            this.switchPage(this.structurePage);
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
                  <Nav.Link onClick={() => this.switchPage(this.structurePage)}>
                    Structure
                  </Nav.Link>
                  <Nav.Link onClick={() => this.switchPage(this.harmonyPage)}>
                    Harmony
                  </Nav.Link>
                  <Nav.Link onClick={() => this.switchPage(this.guitarPage)}>
                    Guitar
                  </Nav.Link>
                  <Nav.Link onClick={() => this.switchPage(this.drumPage)}>
                    Drum
                  </Nav.Link>
                  <Nav.Link onClick={() => this.switchPage(this.printPage)}>
                    Print
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div id="page-content-wrapper">
          <Toggle show={this.state.visibility[this.defaultPage]}>
            <DefaultPage />
          </Toggle>

          <Toggle show={this.state.visibility[this.structurePage]}>
            <StructurePage url={this.state.fileUrl} />
          </Toggle>

          <Toggle show={this.state.visibility[this.harmonyPage]}>
            <HarmonyPage />
          </Toggle>

          <Toggle show={this.state.visibility[this.guitarPage]}>
            <StrummingPage />
          </Toggle>

          <Toggle show={this.state.visibility[this.drumPage]}>
            <DrumPage />
          </Toggle>

          <Toggle show={this.state.visibility[this.printPage]}>
            <PrintPage />
          </Toggle>
        </div>
      </>
    );
  }

  save(): void {
    let analysis: any = this.state;

    var reader = new FileReader();
    reader.addEventListener("loadend", function() {
      analysis.mp3 = reader.result;

      var content = new Blob([JSON.stringify(analysis)], {
        type: "text/plain;charset=utf-8"
      });
      let filename = "analysis.txt";
      FileSaver.saveAs(content, filename);
    });
    reader.readAsText((this.state.file as unknown) as Blob);
  }
}

function Toggle(props: any) {
  if (props.show) {
    return <div style={{ display: "inline" }}>{props.children}</div>;
  } else {
    return <div style={{ display: "none" }}>{props.children}</div>;
  }
}

export default App;
