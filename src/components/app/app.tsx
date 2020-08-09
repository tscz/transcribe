import { createStyles, Grid, Theme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AlbumIcon from "@material-ui/icons/Album";
import HomeIcon from "@material-ui/icons/Home";
import MusicVideoIcon from "@material-ui/icons/MusicVideo";
import PrintIcon from "@material-ui/icons/Print";
import RadioIcon from "@material-ui/icons/Radio";
import Log from "components/log/log";
import Toggle from "components/toggle/toggle";
import VersionInfo from "components/versionInfo/versionInfo";
import DefaultPage from "pages/default/defaultPage";
import DrumPage from "pages/drum/drumPage";
import GuitarPage from "pages/guitar/guitarPage";
import HarmonyPage from "pages/harmony/harmonyPage";
import PrintPage from "pages/print/printPage";
import StructurePage from "pages/structure/structurePage";
import React from "react";
import { connect } from "react-redux";
import { DialogType, openedDialog } from "states/dialog/dialogsSlice";
import { LoadingStatus, Page, switchedPage } from "states/project/projectSlice";
import { ApplicationState } from "states/store";

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
          <AppBar color="inherit" className={this.props.classes.appBar}>
            <Toolbar>
              <Logo className={this.props.classes.logo}></Logo>
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
            <List className={this.props.classes.menuItem}>
              <ListItem
                button
                key="Structure"
                onClick={() => this.props.switchedPage(Page.STRUCTURE)}
                disabled={this.props.status !== LoadingStatus.INITIALIZED}
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
                disabled={this.props.status !== LoadingStatus.INITIALIZED}
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
                disabled={this.props.status !== LoadingStatus.INITIALIZED}
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
                disabled={this.props.status !== LoadingStatus.INITIALIZED}
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
                disabled={this.props.status !== LoadingStatus.INITIALIZED}
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
              className={this.props.classes.footer}
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

const drawerWidth = 190;

const stylesForApp = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      backgroundColor: theme.palette.background.default
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: "#202a2f"
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    title: {
      flexGrow: 1,
      marginLeft: "50px"
    },
    toolbar: {
      ...theme.mixins.toolbar
    },
    menuItem: {
      color: "#abb1b7"
    },
    logo: {
      height: theme.logo.height,
      marginRight: theme.logo.marginRight
    },
    footer: {
      marginTop: "20px"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    }
  });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(stylesForApp, { withTheme: true })(App));
