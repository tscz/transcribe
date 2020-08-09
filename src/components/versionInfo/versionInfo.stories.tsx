import { text, withKnobs } from "@storybook/addon-knobs";
import React from "react";
import { Story, storyForComponent } from "tests/Storybook";

import VersionInfo from "./versionInfo";

export default storyForComponent("VersionInfo", VersionInfo, [withKnobs]);

export const Basic: Story = () => (
  <VersionInfo
    version={text("version", "1.0.0")}
    hash={text("hash", "2698318")}
    description={text("description", "This is a description")}
  ></VersionInfo>
);
