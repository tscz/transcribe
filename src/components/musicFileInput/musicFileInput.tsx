import React from "react";

export default class MusicFileInput extends React.Component<
  {
    callback: (file: File, fileUrl: string) => void;
  },
  {}
> {
  state = {
    file: ""
  };
  fileInput: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);
    this.fileInput = React.createRef();
  }
  handleChange = () => {
    var file = this.fileInput.current!.files![0];
    var fileURL = window.URL.createObjectURL(file);

    this.setState({ file: file, fileUrl: fileURL });
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
