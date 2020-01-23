import { createStyles, Theme } from "@material-ui/core/styles";

const drawerWidth = 190;

export const stylesForApp = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      backgroundColor: "#d5d8da"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: "#FFFFFF"
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
    toolbar: { ...theme.mixins.toolbar }
  });
