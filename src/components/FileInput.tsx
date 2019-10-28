import React from "react";

class FileInput extends React.Component<
  { callback: (file: File, fileUrl: string) => void },
  {}
> {
  state = {
    file: ""
  };

  fileInput: React.RefObject<HTMLInputElement>;

  constructor(props: any) {
    super(props);

    this.fileInput = React.createRef();
    console.log("ImportPage constructor:" + this.state.file);
  }

  handleChange() {
    console.log("change on input#file triggered");
    var file = this.fileInput.current!.files![0];
    console.log("file:" + file.name);

    var fileURL = window.URL.createObjectURL(file);
    console.log(file);
    console.log("File name: " + file!.name);
    console.log("File type: " + file!.type);
    console.log("File BlobURL: " + fileURL);

    this.setState({ file: file, fileUrl: fileURL });
    this.props.callback(file, fileURL);
  }

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

export default FileInput;
