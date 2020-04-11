import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import DialogManagement from "./dialogManagement";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<DialogManagement />);
});
