import { createStyles, Theme } from "@material-ui/core/styles";

const drawerWidth = 190;

export const stylesForApp = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      boxShadow: "none"
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(0)
    },
    toolbar: theme.mixins.toolbar,
    title: {
      flexGrow: 1
    }
  });
