import React from "react";
import TestEnvironment from "tests/TestEnvironment";

import DefaultPage from "./defaultPage";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<DefaultPage />);
});
