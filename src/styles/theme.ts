import blueGrey from "@material-ui/core/colors/blueGrey";
import { createMuiTheme } from "@material-ui/core/styles";
import { SectionType } from "model/model";

// Extend Material UI theme type declaration
declare module "@material-ui/core/styles/createMuiTheme" {
  // add custom theme options
  interface ThemeOptions {
    logo: {
      height: React.CSSProperties["height"];
      marginRight: React.CSSProperties["marginRight"];
    };
    popover: {
      width: React.CSSProperties["width"];
      minHeight: React.CSSProperties["minHeight"];
      margin: React.CSSProperties["margin"];
      marginTop: React.CSSProperties["marginTop"];
    };
    measureSelect: {
      minWidth: React.CSSProperties["minWidth"];
    };
    formControl: {
      marginBottom: React.CSSProperties["marginBottom"];
    };
    sectionTypes: {
      INTRO: React.CSSProperties["color"];
      VERSE: React.CSSProperties["color"];
      PRECHORUS: React.CSSProperties["color"];
      CHORUS: React.CSSProperties["color"];
      SOLO: React.CSSProperties["color"];
      OUTRO: React.CSSProperties["color"];
      BRIDGE: React.CSSProperties["color"];
      UNDEFINED: React.CSSProperties["color"];
    };
    sectionSelect: {
      minWidth: React.CSSProperties["minWidth"];
    };
    view: {
      background: React.CSSProperties["color"];
      headerBackground: React.CSSProperties["color"];
      headerPadding: React.CSSProperties["padding"];
    };
    waveform: {
      pointMarkerColor: React.CSSProperties["color"];
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
  popover: {
    width: "200px",
    minHeight: "50px",
    margin: "10px",
    marginTop: "20px"
  },
  measureSelect: {
    minWidth: "40px"
  },
  formControl: {
    marginBottom: "20px"
  },
  sectionTypes: {
    INTRO: "#FFCA28",
    VERSE: "#FFA726",
    PRECHORUS: "#FF7043",
    CHORUS: "#9CCC65",
    SOLO: "#26C6DA",
    OUTRO: "#5C6BC0",
    BRIDGE: "#EC407A",
    UNDEFINED: "#f2f2f2"
  },
  sectionSelect: {
    minWidth: "140px"
  },
  view: {
    background: "#ffffff",
    headerBackground: "#f1f4f6",
    headerPadding: "4px"
  },
  waveform: {
    pointMarkerColor: "#006eb0"
  },
  overrides: {
    MuiListItemIcon: {
      root: {
        color: "#abb1b7"
      }
    }
  }
});

export const getColor = (sectionType: SectionType) => {
  const result = SECTIONTYPE_TO_COLOR.get(sectionType);

  if (!result) throw Error("Unknown SectionType " + sectionType);

  return result;
};

const SECTIONTYPE_TO_COLOR = new Map<SectionType, React.CSSProperties["color"]>(
  [
    [SectionType.INTRO, theme.sectionTypes.INTRO],
    [SectionType.VERSE, theme.sectionTypes.VERSE],
    [SectionType.PRECHORUS, theme.sectionTypes.PRECHORUS],
    [SectionType.CHORUS, theme.sectionTypes.CHORUS],
    [SectionType.SOLO, theme.sectionTypes.SOLO],
    [SectionType.OUTRO, theme.sectionTypes.OUTRO],
    [SectionType.BRIDGE, theme.sectionTypes.BRIDGE],
    [SectionType.UNDEFINED, theme.sectionTypes.UNDEFINED]
  ]
) as ReadonlyMap<SectionType, string>;

export default theme;
