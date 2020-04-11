import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import GuitarPage from "./guitarPage";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<GuitarPage />);
});
