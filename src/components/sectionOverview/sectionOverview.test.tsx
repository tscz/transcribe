import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import SectionOverview from "./sectionOverview";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<SectionOverview />);
});
