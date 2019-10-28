import FileSaver from "file-saver";
import React, { ReactElement } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./App.css";
import Dialog from "./dialogs/Dialog";
import DrumPage from "./pages/DrumPage";
import HarmonyPage from "./pages/HarmonyPage";
import PrintPage from "./pages/PrintPage";
import SongStructurePage from "./pages/SongStructurePage";
import StrummingPage from "./pages/StrummingPage";
import DefaultPage from "./pages/DefaultPage";
import FileInput from "./components/FileInput";

class App extends React.Component {
  switchSong = (file: File, fileUrl: string) => {
    this.setState({ file: file, fileUrl: fileUrl });
  };

  analysisLoaded = () => {
    this.setState({ analysisStarted: true });
  };

  state = {
    currentPage: <DefaultPage />,
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

  switchPage(page: ReactElement) {
    this.setState({ currentPage: page });
  }

  render() {
    console.log("render App with src=" + this.state.fileUrl);

    return (
      <>
        <Dialog
          title="Create new Analysis"
          show={this.state.showNewDialog}
          onSubmit={() => {
            this.analysisLoaded();
            this.switchPage(<SongStructurePage url={this.state.fileUrl} />);
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
              <FileInput callback={this.switchSong}></FileInput>
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
          expand="lg"
          sticky="top"
          className="navbar navbar-expand-lg navbar-light bg-light border-bottom"
        >
          <Navbar.Brand
            onClick={(event: any) => {
              document!.querySelector("#wrapper")!.classList.toggle("toggled");
            }}
          >
            Transcribe
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <NavDropdown title="File" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={this.showNewDialog}>
                New
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={this.showOpenDialog}>
                Open ...
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={this.showSaveDialog}>
                Save as ...
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Preferences" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={this.showPreferencesDialog}>
                Preferences...
              </NavDropdown.Item>
            </NavDropdown>
            <Nav className="mr-auto">
              <Nav.Link onClick={this.showHelpDialog}>Help</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="d-flex" id="wrapper">
          {this.state.analysisStarted ? (
            <div className="bg-light border-right" id="sidebar-wrapper">
              <ListGroup variant="flush">
                <ListGroup.Item
                  action
                  onClick={() =>
                    this.switchPage(
                      <SongStructurePage url={this.state.fileUrl} />
                    )
                  }
                >
                  Song Structure
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  onClick={() => this.switchPage(<HarmonyPage />)}
                >
                  Harmony
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  onClick={() => this.switchPage(<DrumPage />)}
                >
                  Drum Pattern
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  onClick={() => this.switchPage(<StrummingPage />)}
                >
                  Strumming Pattern
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  onClick={() => this.switchPage(<PrintPage />)}
                >
                  Print Song
                </ListGroup.Item>
                <ListGroup.Item>
                  <audio id="audio" controls>
                    {this.state.fileUrl ? (
                      <source src={this.state.fileUrl} type="audio/mpeg" />
                    ) : null}
                    Your browser does not support the audio element.
                  </audio>
                </ListGroup.Item>
              </ListGroup>
            </div>
          ) : null}

          <div id="page-content-wrapper">
            <div className="container-fluid">{this.state.currentPage}</div>
          </div>
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

export default App;
