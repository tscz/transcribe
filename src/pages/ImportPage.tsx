import React from "react";
import Page from "./Page";

class ImportPage extends React.Component<
  { callback: (file: string) => void },
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

    this.setState({ file: fileURL });
    this.props.callback(fileURL);
  }

  render() {
    return (
      <Page header="Import Song">
        <input
          id="audio_file"
          type="file"
          accept="audio/*"
          ref={this.fileInput}
          onChange={() => this.handleChange()}
        ></input>
      </Page>
    );
  }
}

export default ImportPage;
