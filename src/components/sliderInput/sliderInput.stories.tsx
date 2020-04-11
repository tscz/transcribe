import { withKnobs } from "@storybook/addon-knobs";
import React from "react";

import SliderInput from "./sliderInput";

export default {
  title: "Components|SliderInput",
  component: SliderInput,
  decorators: [withKnobs]
};

export const Basic = () => (
  <SliderInput
    max={100}
    min={0}
    key={"key"}
    onChange={() => {}}
    step={1}
    title="Slider Demo"
    value={1}
  ></SliderInput>
);
