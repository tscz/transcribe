import { Grid } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AlbumIcon from "@material-ui/icons/Album";
import HomeIcon from "@material-ui/icons/Home";
import MusicVideoIcon from "@material-ui/icons/MusicVideo";
import PrintIcon from "@material-ui/icons/Print";
import RadioIcon from "@material-ui/icons/Radio";
import React, { FunctionComponent } from "react";
import { connect } from "react-redux";

import DefaultPage from "../../pages/default/defaultPage";
import DrumPage from "../../pages/drum/drumPage";
import GuitarPage from "../../pages/guitar/guitarPage";
import HarmonyPage from "../../pages/harmony/harmonyPage";
import PrintPage from "../../pages/print/printPage";
import StructurePage from "../../pages/structure/structurePage";
import { DialogType, openedDialog } from "../../states/dialog/dialogsSlice";
import {
  LoadingStatus,
  Page,
  switchedPage
} from "../../states/project/projectSlice";
import { ApplicationState } from "../../states/store";
import { stylesForApp } from "../../styles/styles";
import Log from "../log/log";
import VersionInfo from "../versionInfo/versionInfo";
import { ReactComponent as Logo } from "./logo.svg";

interface PropsFromState {
  currentPage: Page;
  status: LoadingStatus;
  title: string;
}

interface PropsFromDispatch {
  switchedPage: typeof switchedPage;
  openedDialog: typeof openedDialog;
}

interface Props extends WithStyles<typeof stylesForApp> {
  theme: Theme;
}

type AllProps = Props & PropsFromState & PropsFromDispatch;

class App extends React.Component<AllProps> {
  render() {
    Log.info("render", App.name);
    return (
      <>
        <div className={this.props.classes.root}>
          <AppBar position="fixed" className={this.props.classes.appBar}>
            <Toolbar>
              <Logo height="40px" style={{ marginRight: "5px" }}></Logo>
              <Typography color="textPrimary" variant="h4" noWrap>
                Transcribe
              </Typography>
              <Typography
                color="textPrimary"
                variant="caption"
                noWrap
                className={this.props.classes.title}
              >
                [{this.props.title !== "" ? this.props.title : "no file loaded"}
                ]
              </Typography>
              <Button
                onClick={() => this.props.openedDialog(DialogType.NEW)}
                disabled={this.props.status === LoadingStatus.INITIALIZING}
              >
                New
              </Button>
              <Button
                onClick={() => this.props.openedDialog(DialogType.OPEN)}
                disabled={this.props.status === LoadingStatus.INITIALIZING}
              >
                Open
              </Button>
              <Button
                onClick={() => this.props.openedDialog(DialogType.SAVE)}
                disabled={this.props.status !== LoadingStatus.INITIALIZED}
              >
                Save
              </Button>
            </Toolbar>
          </AppBar>
          <Drawer
            className={this.props.classes.drawer}
            variant="permanent"
            classes={{
              paper: this.props.classes.drawerPaper
            }}
          >
            <div className={this.props.classes.toolbar} />
            <List style={{ color: "#abb1b7" }}>
              <ListItem
                button
                key="Structure"
                onClick={() => this.props.switchedPage(Page.STRUCTURE)}
                disabled={this.props.status !== LoadingStatus.INITIALIZED}
              >
                <ListItemIcon style={{ color: "#abb1b7" }}>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Structure" />
              </ListItem>
              <ListItem
                button
                key="Harmony"
                onClick={() => this.props.switchedPage(Page.HARMONY)}
                disabled={this.props.status !== LoadingStatus.INITIALIZED}
              >
                <ListItemIcon style={{ color: "#abb1b7" }}>
                  <MusicVideoIcon />
                </ListItemIcon>
                <ListItemText primary="Harmony" />
              </ListItem>
              <ListItem
                button
                key="Guitar"
                onClick={() => this.props.switchedPage(Page.GUITAR)}
                disabled={this.props.status !== LoadingStatus.INITIALIZED}
              >
                <ListItemIcon style={{ color: "#abb1b7" }}>
                  <RadioIcon />
                </ListItemIcon>
                <ListItemText primary="Guitar" />
              </ListItem>
              <ListItem
                button
                key="Drum"
                onClick={() => this.props.switchedPage(Page.DRUM)}
                disabled={this.props.status !== LoadingStatus.INITIALIZED}
              >
                <ListItemIcon style={{ color: "#abb1b7" }}>
                  <AlbumIcon />
                </ListItemIcon>
                <ListItemText primary="Drum" />
              </ListItem>
              <ListItem
                button
                key="Print"
                onClick={() => this.props.switchedPage(Page.PRINT)}
                disabled={this.props.status !== LoadingStatus.INITIALIZED}
              >
                <ListItemIcon style={{ color: "#abb1b7" }}>
                  <PrintIcon />
                </ListItemIcon>
                <ListItemText primary="Print" />
              </ListItem>
            </List>
          </Drawer>
          <main className={this.props.classes.content}>
            <div className={this.props.classes.toolbar} />
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
            <Grid
              container
              direction="column"
              justify="flex-end"
              alignItems="flex-end"
              style={{ marginTop: "20px" }}
            >
              <Grid item>
                App version:{" "}
                <VersionInfo
                  version={process.env.REACT_APP_VERSION ?? ""}
                  hash={process.env.REACT_APP_VERSION_HASH ?? ""}
                  description={process.env.REACT_APP_VERSION_DESCRIPTION ?? ""}
                />
              </Grid>
            </Grid>
          </main>
        </div>
      </>
    );
  }
}

const Toggle: FunctionComponent<{ show: boolean }> = (props) => {
  if (props.show) {
    return <div style={{ display: "inline" }}>{props.children}</div>;
  } else {
    return <div style={{ display: "none" }}>{props.children}</div>;
  }
};

const mapStateToProps = ({ project }: ApplicationState) => {
  return {
    currentPage: project.currentPage,
    status: project.status,
    title: project.title
  };
};

const mapDispatchToProps = {
  switchedPage,
  openedDialog
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(stylesForApp, { withTheme: true })(App));
