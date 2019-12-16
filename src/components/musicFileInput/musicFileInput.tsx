import React from "react";

interface Props {
  callback: (file: File, fileUrl: string) => void;
}

interface State {
  file: File | null;
}

export default class MusicFileInput extends React.Component<Props, State> {
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
      <input
        id="audio_file"
        type="file"
        accept="audio/*"
        ref={this.fileInput}
        onChange={() => this.handleChange()}
      ></input>
    );
  }
}
