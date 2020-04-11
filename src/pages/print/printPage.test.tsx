import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import PrintPage from "./printPage";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<PrintPage />);
});
