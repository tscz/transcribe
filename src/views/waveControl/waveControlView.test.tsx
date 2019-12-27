import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import WaveControlView from "./waveControlView";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<WaveControlView />);
});
