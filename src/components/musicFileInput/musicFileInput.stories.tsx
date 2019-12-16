import React from "react";

import MusicFileInput from "./musicFileInput";

export default {
  title: "Components|MusicFileInput",
  component: MusicFileInput
};

export const Basic = () => (
  <MusicFileInput callback={(file, url) => {}}></MusicFileInput>
);
