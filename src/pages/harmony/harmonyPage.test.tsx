import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import HarmonyPage from "./harmonyPage";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<HarmonyPage />);
});
