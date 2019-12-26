import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import VersionInfo from "./versionInfo";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<VersionInfo />);
});
