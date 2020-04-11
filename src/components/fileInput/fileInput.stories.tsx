import { action } from "@storybook/addon-actions";
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
    callback={action("callback")}
  ></FileInput>
);

export const Audio = () => (
  <FileInput
    id="audioFileInput"
    fileType={FileType.AUDIO}
    callback={action("callback")}
  ></FileInput>
);
