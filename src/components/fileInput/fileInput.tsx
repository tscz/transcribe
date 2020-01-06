import {
  createStyles,
  InputBase,
  Theme,
  WithStyles,
  withStyles
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import MenuIcon from "@material-ui/icons/OpenInBrowser";
import React from "react";

export enum FileType {
  AUDIO = "audio/*",
  ZIP = ".zip"
}

const toString = (type: FileType) => {
  switch (type) {
    case FileType.AUDIO:
      return "Audio File";
    case FileType.ZIP:
      return "Project Zip File";
  }
};

interface Props extends WithStyles<typeof stylesForFileInput> {
  id: string;
  fileType: FileType;
  callback: (file: File, fileUrl: string) => void;
}

interface State {
  display: string;
}

const stylesForFileInput = (theme: Theme) =>
  createStyles({
    root: {
      padding: "4px 0px",
      display: "flex",
      alignItems: "center",
      width: "100%"
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1
    },
    iconButton: {
      padding: 10
    }
  });

class FileInput extends React.Component<Props, State> {
  state: State = {
    display: ""
  };

  fileInput: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    this.fileInput = React.createRef();
  }

  handleChange = (fileList: FileList | null) => {
    if (fileList === null) return;

    var file = fileList[0];
    var fileURL = window.URL.createObjectURL(file);

    this.setState({ display: file.name });
    this.props.callback(file, fileURL);
  };

  render() {
    return (
      <>
        <Paper component="form" className={this.props.classes.root}>
          <InputBase
            className={this.props.classes.input}
            placeholder={"Choose " + toString(this.props.fileType) + " ..."}
            inputProps={{
              "aria-label": "Choose " + toString(this.props.fileType)
            }}
            value={this.state.display}
            readOnly={true}
            onClick={() => this.fileInput.current?.click()}
          />
          <IconButton
            aria-label="menu"
            onClick={() => this.fileInput.current?.click()}
            className={this.props.classes.iconButton}
          >
            <MenuIcon />{" "}
          </IconButton>
        </Paper>
        <input
          hidden={true}
          id={this.props.id}
          type="file"
          accept={this.props.fileType}
          ref={this.fileInput}
          onChange={e => this.handleChange(e.target.files)}
        ></input>
      </>
    );
  }
}

export default withStyles(stylesForFileInput, { withTheme: true })(FileInput);
