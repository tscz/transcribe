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
  file: File | null;
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
    file: null
  };

  fileInput: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    this.fileInput = React.createRef();
  }

  handleChange = () => {
    var file = this.fileInput.current!.files![0];
    var fileURL = window.URL.createObjectURL(file);

    this.setState({ file: file });
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
            value={this.state.file?.name}
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
          onChange={() => this.handleChange()}
        ></input>
      </>
    );
  }
}

export default withStyles(stylesForFileInput, { withTheme: true })(FileInput);
