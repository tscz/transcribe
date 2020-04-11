import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import ContentLayout from "./contentLayout";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<ContentLayout topLeft={<></>} topRight={<></>} />);
});
