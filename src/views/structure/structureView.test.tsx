import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import StructureView from "./structureView";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<StructureView />);
});
