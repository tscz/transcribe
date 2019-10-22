import React, { ReactElement } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./App.css";
import DrumPage from "./pages/DrumPage";
import HarmonyPage from "./pages/HarmonyPage";
import ImportPage from "./pages/ImportPage";
import PrintPage from "./pages/PrintPage";
import StrummingPage from "./pages/StrummingPage";
import SongStructurePage from "./pages/SongStructurePage";

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
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
          <Navbar.Brand>Transcribe</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link
                onClick={() =>
                  this.switchPage(<ImportPage callback={this.switchSong} />)
                }
              >
                Home
              </Nav.Link>
              <Nav.Link
                onClick={() =>
                  this.switchPage(<ImportPage callback={this.switchSong} />)
                }
              >
                Import Song
              </Nav.Link>
              <NavDropdown title="Analyse Song" id="basic-nav-dropdown">
                <NavDropdown.Item
                  onClick={() =>
                    this.switchPage(<SongStructurePage file={this.state.src} />)
                  }
                >
                  Song Structure
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => this.switchPage(<HarmonyPage />)}
                >
                  Harmony
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.switchPage(<DrumPage />)}>
                  Drum Pattern
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => this.switchPage(<StrummingPage />)}
                >
                  Strumming Pattern
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={() => this.switchPage(<PrintPage />)}>
                Print Song
              </Nav.Link>
            </Nav>
            <audio id="audio" controls>
              {this.state.src !== "" && (
                <source src={this.state.src} type="audio/mpeg" />
              )}
              Your browser does not support the audio element.
            </audio>
          </Navbar.Collapse>
        </Navbar>
        {this.state.currentPage}
      </div>
    );
  }
}

export default App;
