import React from "react";
import TestEnvironment from "tests/TestEnvironment";

import VersionInfo from "./versionInfo";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(
    <VersionInfo
      version="1.0.0"
      hash="2698318"
      description="This is a description"
    />
  );
});
