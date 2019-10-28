import React, { ReactElement } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./App.css";
import DrumPage from "./pages/DrumPage";
import HarmonyPage from "./pages/HarmonyPage";
import ImportPage from "./pages/ImportPage";
import PrintPage from "./pages/PrintPage";
import SongStructurePage from "./pages/SongStructurePage";
import StrummingPage from "./pages/StrummingPage";
import FileSaver from "file-saver";

class App extends React.Component {
  switchSong = (file: string) => {
    this.setState({ src: file });
  };

  state = {
    currentPage: <ImportPage callback={this.switchSong} />,
    src: "",
    show: false
  };

  constructor(props: any) {
    super(props);

    console.log("1=" + this + typeof this);
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  switchPage(page: ReactElement) {
    this.setState({ currentPage: page });
  }

  createModalDialog(header: string, body: ReactElement) {
    return (
      <Modal show={this.state.show} onHide={this.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>{header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.hideModal}>
            Close
          </Button>
          <Button variant="primary" onClick={this.hideModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    console.log("render App with src=" + this.state.src);

    return (
      <>
        {this.createModalDialog(
          "New Analysis",
          <ImportPage callback={this.switchSong} />
        )}

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
              <NavDropdown.Item onClick={this.showModal}>New</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => this.switchPage(<HarmonyPage />)}
              >
                Open ...
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => this.save()}>
                Save as ...
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Preferences" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={this.showModal}>
                Preferences...
              </NavDropdown.Item>
            </NavDropdown>
            <Nav className="mr-auto">
              <Nav.Link
                onClick={() =>
                  this.switchPage(<ImportPage callback={this.switchSong} />)
                }
              >
                Help
              </Nav.Link>
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
