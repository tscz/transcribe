import React, { ReactElement } from "react";
import ListGroup from "react-bootstrap/ListGroup";
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

class App extends React.Component {
  switchSong = (file: string) => {
    this.setState({ src: file });
  };

  state = {
    currentPage: <ImportPage callback={this.switchSong} />,
    src: ""
  };

  constructor(props: any) {
    super(props);

    console.log("1=" + this + typeof this);
  }

  switchPage(page: ReactElement) {
    this.setState({ currentPage: page });
  }

  render() {
    console.log("render App with src=" + this.state.src);

    return (
      <>
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
              <NavDropdown.Item
                onClick={() =>
                  this.switchPage(<SongStructurePage file={this.state.src} />)
                }
              >
                New
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => this.switchPage(<HarmonyPage />)}
              >
                Open ...
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => this.switchPage(<HarmonyPage />)}
              >
                Save
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Preferences" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => this.switchPage(<DrumPage />)}>
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
}

export default App;
