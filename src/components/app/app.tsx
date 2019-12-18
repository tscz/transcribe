import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AlbumIcon from "@material-ui/icons/Album";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import MusicVideoIcon from "@material-ui/icons/MusicVideo";
import PrintIcon from "@material-ui/icons/Print";
import RadioIcon from "@material-ui/icons/Radio";
import clsx from "clsx";
import React from "react";
import { FunctionComponent } from "react";
import { connect } from "react-redux";

import DefaultPage from "../../pages/default/defaultPage";
import DrumPage from "../../pages/drum/drumPage";
import GuitarPage from "../../pages/guitar/guitarPage";
import HarmonyPage from "../../pages/harmony/harmonyPage";
import PrintPage from "../../pages/print/printPage";
import StructurePage from "../../pages/structure/structurePage";
import { resettedAnalysis } from "../../states/analysisSlice";
import { DialogType, openedDialog } from "../../states/dialogsSlice";
import { Page, switchedPage } from "../../states/projectSlice";
import { ApplicationState } from "../../states/store";
import { stylesForApp } from "../../styles/styles";
import VersionInfo from "../versionInfo/versionInfo";

interface PropsFromState {
  currentPage: Page;
  loaded: boolean;
}

interface PropsFromDispatch {
  switchedPage: typeof switchedPage;
  resettedAnalysis: typeof resettedAnalysis;
  openedDialog: typeof openedDialog;
}

interface Props extends WithStyles<typeof stylesForApp> {
  theme: Theme;
}

type AllProps = Props & PropsFromState & PropsFromDispatch;

interface State {
  open: boolean;
}

class App extends React.Component<AllProps, State> {
  state: State = {
    open: false
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    console.log("render app");
    return (
      <>
        <div className={this.props.classes.root}>
          <AppBar
            position="fixed"
            className={clsx(this.props.classes.appBar, {
              [this.props.classes.appBarShift]: this.state.open
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                edge="start"
                className={clsx(this.props.classes.menuButton, {
                  [this.props.classes.hide]: this.state.open
                })}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                className={this.props.classes.title}
              >
                Transcribe{" "}
              </Typography>
              <Button
                color="inherit"
                onClick={() => this.props.openedDialog(DialogType.NEW)}
              >
                New
              </Button>
              <Button
                color="inherit"
                onClick={() => this.props.openedDialog(DialogType.OPEN)}
              >
                Open
              </Button>
              <Button
                color="inherit"
                onClick={() => this.props.openedDialog(DialogType.SAVE)}
                disabled={!this.props.loaded}
              >
                Save
              </Button>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            className={clsx(this.props.classes.drawer, {
              [this.props.classes.drawerOpen]: this.state.open,
              [this.props.classes.drawerClose]: !this.state.open
            })}
            classes={{
              paper: clsx({
                [this.props.classes.drawerOpen]: this.state.open,
                [this.props.classes.drawerClose]: !this.state.open
              })
            }}
            open={this.state.open}
          >
            <div className={this.props.classes.toolbar}>
              <IconButton onClick={this.handleDrawerClose}>
                {this.props.theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            <List>
              <ListItem
                button
                key="Structure"
                onClick={() => this.props.switchedPage(Page.STRUCTURE)}
                disabled={!this.props.loaded}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Structure" />
              </ListItem>
              <ListItem
                button
                key="Harmony"
                onClick={() => this.props.switchedPage(Page.HARMONY)}
                disabled={!this.props.loaded}
              >
                <ListItemIcon>
                  <MusicVideoIcon />
                </ListItemIcon>
                <ListItemText primary="Harmony" />
              </ListItem>
              <ListItem
                button
                key="Guitar"
                onClick={() => this.props.switchedPage(Page.GUITAR)}
                disabled={!this.props.loaded}
              >
                <ListItemIcon>
                  <RadioIcon />
                </ListItemIcon>
                <ListItemText primary="Guitar" />
              </ListItem>
              <ListItem
                button
                key="Drum"
                onClick={() => this.props.switchedPage(Page.DRUM)}
                disabled={!this.props.loaded}
              >
                <ListItemIcon>
                  <AlbumIcon />
                </ListItemIcon>
                <ListItemText primary="Drum" />
              </ListItem>
              <ListItem
                button
                key="Print"
                onClick={() => this.props.switchedPage(Page.PRINT)}
                disabled={!this.props.loaded}
              >
                <ListItemIcon>
                  <PrintIcon />
                </ListItemIcon>
                <ListItemText primary="Print" />
              </ListItem>
            </List>
          </Drawer>
          <main className={this.props.classes.content}>
            <div className={this.props.classes.toolbar} />
            <div id="page-content-wrapper">
              <Toggle show={this.props.currentPage === Page.DEFAULT}>
                <DefaultPage />
              </Toggle>

              <Toggle show={this.props.currentPage === Page.STRUCTURE}>
                <StructurePage />
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
            Version: <VersionInfo />
          </main>
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
    loaded: project.loaded
  };
};

const mapDispatchToProps = {
  switchedPage,
  resettedAnalysis,
  openedDialog
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(stylesForApp, { withTheme: true })(App));