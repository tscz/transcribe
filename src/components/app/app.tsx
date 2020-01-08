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
import { DialogType, openedDialog } from "../../states/dialogsSlice";
import { LoadingStatus } from "../../states/projectSlice";
import { Page, switchedPage } from "../../states/projectSlice";
import { ApplicationState } from "../../states/store";
import { stylesForApp } from "../../styles/styles";
import Log from "../log/log";
import VersionInfo from "../versionInfo/versionInfo";

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
    Log.info("render", App.name);
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
              <Typography
                variant="h6"
                noWrap
                className={this.props.classes.title}
              >
                Transcribe ( {this.props.title} )
              </Typography>
              <Button
                color="inherit"
                onClick={() => this.props.openedDialog(DialogType.NEW)}
                disabled={this.props.status === LoadingStatus.INITIALIZING}
              >
                New
              </Button>
              <Button
                color="inherit"
                onClick={() => this.props.openedDialog(DialogType.OPEN)}
                disabled={this.props.status === LoadingStatus.INITIALIZING}
              >
                Open
              </Button>
              <Button
                color="inherit"
                onClick={() => this.props.openedDialog(DialogType.SAVE)}
                disabled={this.props.status !== LoadingStatus.INITIALIZED}
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
            Version:{" "}
            <VersionInfo
              version={process.env.REACT_APP_VERSION ?? ""}
              hash={process.env.REACT_APP_VERSION_HASH ?? ""}
              description={process.env.REACT_APP_VERSION_DESCRIPTION ?? ""}
            />
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
