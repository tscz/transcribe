import React from "react";
import TestEnvironment from "tests/TestEnvironment";

import PropertiesView from "./propertiesView";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<PropertiesView />);
});
