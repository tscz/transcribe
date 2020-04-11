import blueGrey from "@material-ui/core/colors/blueGrey";
import { createMuiTheme } from "@material-ui/core/styles";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

// Extend Material UI theme type declaration
declare module "@material-ui/core/styles/createMuiTheme" {
  // add custom theme options
  interface ThemeOptions {
    appDrawer: {
      width: React.CSSProperties["width"];
      breakpoint: Breakpoint;
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
  appDrawer: {
    width: 225,
    breakpoint: "lg"
  }
});

export default theme;
