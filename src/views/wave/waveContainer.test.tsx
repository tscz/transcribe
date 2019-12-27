import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import WaveContainer from "./waveContainer";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<WaveContainer />);
});
