import { text, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import VersionInfo from "./versionInfo";

export default {
  title: "Components|VersionInfo",
  component: VersionInfo,
  decorators: [withKnobs]
};

export const Basic = () => (
  <VersionInfo
    version={text("version", "1.0.0")}
    hash={text("hash", "2698318")}
    description={text("description", "This is a description")}
  ></VersionInfo>
);
