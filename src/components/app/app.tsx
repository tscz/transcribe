import { Dialog } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AlbumIcon from "@material-ui/icons/Album";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CreateIcon from "@material-ui/icons/Create";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import MusicVideoIcon from "@material-ui/icons/MusicVideo";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import PrintIcon from "@material-ui/icons/Print";
import RadioIcon from "@material-ui/icons/Radio";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import clsx from "clsx";
import React from "react";
import { FunctionComponent } from "react";
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

const drawerWidth = 200;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    appBar: {
      flexGrow: 1,
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    menuButton: {
      marginRight: 36
    },
    hide: {
      display: "none"
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap"
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(7) + 1
      }
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar
    },
    title: {
      flexGrow: 1
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(0)
    }
  });

interface PropsFromState {
  currentPage: Page;
  audioUrl: string;
}

interface PropsFromDispatch {
  switchPage: typeof switchPage;
  reset: typeof reset;
  openDialog: typeof openDialog;
}

interface Props extends WithStyles<typeof styles> {
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
        <DialogManagement />

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
                Transcribe
              </Typography>
              <Button
                color="inherit"
                onClick={() => this.props.openDialog(DialogType.NEW)}
              >
                New
              </Button>
              <Button
                color="inherit"
                onClick={() => this.props.openDialog(DialogType.OPEN)}
              >
                Open
              </Button>
              <Button
                color="inherit"
                onClick={() => this.props.openDialog(DialogType.SAVE)}
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
                onClick={() => this.props.switchPage(Page.STRUCTURE)}
                disabled={!this.props.audioUrl}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Structure" />
              </ListItem>
              <ListItem
                button
                key="Harmony"
                onClick={() => this.props.switchPage(Page.HARMONY)}
                disabled={!this.props.audioUrl}
              >
                <ListItemIcon>
                  <MusicVideoIcon />
                </ListItemIcon>
                <ListItemText primary="Harmony" />
              </ListItem>
              <ListItem
                button
                key="Guitar"
                onClick={() => this.props.switchPage(Page.GUITAR)}
                disabled={!this.props.audioUrl}
              >
                <ListItemIcon>
                  <RadioIcon />
                </ListItemIcon>
                <ListItemText primary="Guitar" />
              </ListItem>
              <ListItem
                button
                key="Drum"
                onClick={() => this.props.switchPage(Page.DRUM)}
                disabled={!this.props.audioUrl}
              >
                <ListItemIcon>
                  <AlbumIcon />
                </ListItemIcon>
                <ListItemText primary="Drum" />
              </ListItem>
              <ListItem
                button
                key="Print"
                onClick={() => this.props.switchPage(Page.PRINT)}
                disabled={!this.props.audioUrl}
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
    audioUrl: project.audioUrl
  };
};

const mapDispatchToProps = {
  switchPage,
  reset,
  openDialog
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(App));
