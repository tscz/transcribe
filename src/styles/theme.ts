import blueGrey from "@material-ui/core/colors/blueGrey";
import { createMuiTheme } from "@material-ui/core/styles";
// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: blueGrey
  }
});

export default theme;
