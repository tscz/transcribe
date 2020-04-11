import blueGrey from "@material-ui/core/colors/blueGrey";
import { createMuiTheme } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

// Extend Material UI theme type declaration
declare module "@material-ui/core/styles/createMuiTheme" {
  // add custom theme options
  interface ThemeOptions {
    logo: {
      height: React.CSSProperties["height"];
      marginRight: React.CSSProperties["marginRight"];
    };
  }

  // make custom theme options available in theme
  interface Theme extends ThemeOptions {}
}

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: blueGrey,
    background: {
      default: "#d5d8da"
    }
  },
  logo: {
    height: "40px",
    marginRight: "5px"
  },
  overrides: {
    MuiListItemIcon: {
      root: {
        color: "#abb1b7"
      }
    }
  }
});

export default theme;
