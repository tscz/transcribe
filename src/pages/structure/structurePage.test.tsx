import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import StructurePage from "./structurePage";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<StructurePage />);
});
