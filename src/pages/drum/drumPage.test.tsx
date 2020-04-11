import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import DrumPage from "./drumPage";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<DrumPage />);
});
