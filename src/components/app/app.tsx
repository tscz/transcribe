import "./app.css";

import {
  faFile,
  faFolderOpen,
  faSave
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FunctionComponent } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { connect } from "react-redux";

import DialogManagement from "../../dialog/dialogManagement";
import DefaultPage from "../../pages/defaultPage";
import DrumPage from "../../pages/drumPage";
import GuitarPage from "../../pages/guitarPage";
import HarmonyPage from "../../pages/harmonyPage";
import PrintPage from "../../pages/printPage";
import StructurePage from "../../pages/structurePage";
import { reset } from "../../store/analysis/actions";
import { openDialog } from "../../store/dialog/actions";
import { DialogType } from "../../store/dialog/types";
import { switchPage } from "../../store/project/actions";
import { Page } from "../../store/project/types";
import { ApplicationState } from "../../store/store";

interface PropsFromState {
  currentPage: Page;
  audioUrl: string;
}

interface PropsFromDispatch {
  switchPage: typeof switchPage;
  reset: typeof reset;
  openDialog: typeof openDialog;
}

type AllProps = PropsFromState & PropsFromDispatch;

class App extends React.Component<AllProps> {
  render() {
    console.log("render app");
    return (
      <>
        <DialogManagement />

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
              <Nav.Link onClick={() => this.props.openDialog(DialogType.NEW)}>
                <FontAwesomeIcon icon={faFile} />
              </Nav.Link>
              <Nav.Link onClick={() => this.props.openDialog(DialogType.OPEN)}>
                {" "}
                <FontAwesomeIcon icon={faFolderOpen} />
              </Nav.Link>
              <Nav.Link onClick={() => this.props.openDialog(DialogType.SAVE)}>
                {" "}
                <FontAwesomeIcon icon={faSave} />
              </Nav.Link>
              {this.props.audioUrl !== "" && (
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
            <StructurePage url={this.props.audioUrl} />
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
}

const Toggle: FunctionComponent<{ show: boolean }> = props => {
  if (props.show) {
    return <div style={{ display: "inline" }}>{props.children}</div>;
  } else {
    return <div style={{ display: "none" }}>{props.children}</div>;
  }
};

const mapStateToProps = ({ project, dialog }: ApplicationState) => {
  return {
    currentPage: project.currentPage,
    audioUrl: project.audioUrl
  };
};

const mapDispatchToProps = {
  switchPage,
  reset,
  openDialog
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
