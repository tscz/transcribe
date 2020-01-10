import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import StructureNavigationView from "./structureNavigationView";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<StructureNavigationView />);
});
