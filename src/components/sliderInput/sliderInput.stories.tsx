import { withKnobs } from "@storybook/addon-knobs";
import React from "react";
import { Story, storyForComponent } from "tests/Storybook";

import SliderInput from "./sliderInput";

export default storyForComponent("SliderInput", SliderInput, [withKnobs]);

export const Basic: Story = () => (
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
