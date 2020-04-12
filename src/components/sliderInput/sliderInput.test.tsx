import React from "react";
import TestEnvironment from "tests/TestEnvironment";

import SliderInput from "./sliderInput";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(
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
});
