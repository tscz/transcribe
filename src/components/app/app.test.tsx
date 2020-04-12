import React from "react";
import TestEnvironment from "tests/TestEnvironment";

import App from "./app";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<App />);
});
