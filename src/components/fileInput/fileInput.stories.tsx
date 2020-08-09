import { action } from "@storybook/addon-actions";
import React from "react";
import { Story, storyForComponent } from "tests/Storybook";

import FileInput, { FileType } from "./fileInput";

export default storyForComponent("FileInput", FileInput);

export const Zip: Story = () => (
  <FileInput
    id="zipFileInput"
    fileType={FileType.ZIP}
    callback={action("callback")}
  ></FileInput>
);

export const Audio: Story = () => (
  <FileInput
    id="audioFileInput"
    fileType={FileType.AUDIO}
    callback={action("callback")}
  ></FileInput>
);
