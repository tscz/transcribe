import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import AudioManagement from "./audioManagement";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<AudioManagement />);
});
