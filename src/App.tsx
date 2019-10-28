import FileSaver from "file-saver";
import React, { ReactElement } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./App.css";
import Dialog from "./dialogs/Dialog";
import DrumPage from "./pages/DrumPage";
import HarmonyPage from "./pages/HarmonyPage";
import ImportPage from "./pages/ImportPage";
import PrintPage from "./pages/PrintPage";
import SongStructurePage from "./pages/SongStructurePage";
import StrummingPage from "./pages/StrummingPage";

class App extends React.Component {
  switchSong = (file: string) => {
    this.setState({ src: file });
  };

  state = {
    currentPage: <ImportPage callback={this.switchSong} />,
    src: "",
    showNewDialog: false,
    showOpenDialog: false,
    showSaveDialog: false,
    showPreferencesDialog: false,
    showHelpDialog: false
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
    console.log("render App with src=" + this.state.src);

    return (
      <>
        <Dialog
          title="Create new Analysis"
          show={this.state.showNewDialog}
          onHide={this.hideNewDialog}
        >
          <p>Create new Analysis</p>
        </Dialog>

        <Dialog
          title="Open existing Analysis"
          show={this.state.showOpenDialog}
          onHide={this.hideOpenDialog}
        >
          <p>Open existing Analysis</p>
        </Dialog>

        <Dialog
          title="Save Analysis"
          show={this.state.showSaveDialog}
          onHide={this.hideSaveDialog}
        >
          <p>Save Analysis</p>
        </Dialog>

        <Dialog
          title="Preferences"
          show={this.state.showPreferencesDialog}
          onHide={this.hidePreferencesDialog}
        >
          <p>Save Analysis</p>
        </Dialog>

        <Dialog
          title="Help"
          show={this.state.showHelpDialog}
          onHide={this.hideHelpDialog}
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
          <div className="bg-light border-right" id="sidebar-wrapper">
            <ListGroup variant="flush">
              <ListGroup.Item
                action
                onClick={() =>
                  this.switchPage(<SongStructurePage file={this.state.src} />)
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
                  {this.state.src !== "" && (
                    <source src={this.state.src} type="audio/mpeg" />
                  )}
                  Your browser does not support the audio element.
                </audio>
              </ListGroup.Item>
            </ListGroup>
          </div>

          <div id="page-content-wrapper">
            <div className="container-fluid">{this.state.currentPage}</div>
          </div>
        </div>
      </>
    );
  }
  save(): void {
    let analysis = {
      sections: [1, 2, 3],
      strumming: "",
      beat: "forbyfor"
    };

    var blob = new Blob([JSON.stringify(analysis, null, 2)], {
      type: "text/plain;charset=utf-8"
    });

    let filename = "analysis.txt";

    FileSaver.saveAs(blob, filename);
  }
}

export default App;
