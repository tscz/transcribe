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
import GuitarPage from "../../pages/guitarPage";
import MusicFileInput from "../musicFileInput/musicFileInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faFolderOpen,
  faSave
} from "@fortawesome/free-solid-svg-icons";
import DefaultPage from "../../pages/defaultPage";
import { connect } from "react-redux";
import { switchPage } from "../../redux/actions";
import { PAGES } from "../../constants";
import { PeaksInstance } from "peaks.js";

class App extends React.Component<
  {
    currentPage: string;
    switchPage: (page: string) => void;
    peaksInstance: PeaksInstance;
  },
  {}
> {
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
            this.props.switchPage(PAGES.STRUCTURE);
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
                    onClick={() => this.props.switchPage(PAGES.STRUCTURE)}
                  >
                    Structure
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => this.props.switchPage(PAGES.HARMONY)}
                  >
                    Harmony
                  </Nav.Link>
                  <Nav.Link onClick={() => this.props.switchPage(PAGES.GUITAR)}>
                    Guitar
                  </Nav.Link>
                  <Nav.Link onClick={() => this.props.switchPage(PAGES.DRUM)}>
                    Drum
                  </Nav.Link>
                  <Nav.Link onClick={() => this.props.switchPage(PAGES.PRINT)}>
                    Print
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div id="page-content-wrapper">
          <Toggle show={this.props.currentPage === PAGES.DEFAULT}>
            <DefaultPage />
          </Toggle>

          <Toggle show={this.props.currentPage === PAGES.STRUCTURE}>
            <StructurePage url={this.state.fileUrl} />
          </Toggle>

          <Toggle show={this.props.currentPage === PAGES.HARMONY}>
            <HarmonyPage />
          </Toggle>

          <Toggle show={this.props.currentPage === PAGES.GUITAR}>
            <GuitarPage />
          </Toggle>

          <Toggle show={this.props.currentPage === PAGES.DRUM}>
            <DrumPage />
          </Toggle>

          <Toggle show={this.props.currentPage === PAGES.PRINT}>
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

const mapStateToProps = (state: any) => {
  return {
    currentPage: state.currentPage,
    peaksInstance: state.peaks
  };
};

const mapDispatchToProps = {
  switchPage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
