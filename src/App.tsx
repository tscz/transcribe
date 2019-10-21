import React from 'react';
import './App.css';
import ImportPage from './components/ImportPage';
import PrintPage from './components/PrintPage';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

class App extends React.Component {
  state = {
    currentPage: "ImportPage"
  }

  renderPage() {
    switch (this.state.currentPage) {
      case "ImportPage":
        return <ImportPage />
      case "PrintPage":
        return <PrintPage />
      default:
        return <ImportPage />
    }
  }

  switchPage(page: string) {
    this.setState({ currentPage: page })
  }

  render() {
    console.log("render App");
    return (
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
          <Navbar.Brand>Transcribe</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={() => this.switchPage("ImportPage")}>Home</Nav.Link>
              <Nav.Link onClick={() => this.switchPage("ImportPage")}>Import Song</Nav.Link>
              <NavDropdown title="Analyse Song" id="basic-nav-dropdown">
                <NavDropdown.Item>Song Structure</NavDropdown.Item>
                <NavDropdown.Item>Harmony</NavDropdown.Item>
                <NavDropdown.Item>Drum Pattern</NavDropdown.Item>
                <NavDropdown.Item>Strumming Pattern</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={() => this.switchPage("PrintPage")}>Print Song</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.renderPage()}
      </div>
    );
  }
}

export default App;