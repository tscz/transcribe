import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import View from "./view";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<View body={<></>} title="test" />);
});
