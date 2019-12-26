import React from "react";

import FileInput, { FileType } from "./fileInput";

export default {
  title: "Components|FileInput",
  component: FileInput
};

export const Zip = () => (
  <FileInput
    id="zipFileInput"
    fileType={FileType.ZIP}
    callback={(file, url) => {
      console.log(file + url);
    }}
  ></FileInput>
);

export const Audio = () => (
  <FileInput
    id="audioFileInput"
    fileType={FileType.AUDIO}
    callback={(file, url) => {
      console.log(file + url);
    }}
  ></FileInput>
);
