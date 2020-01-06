import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import MeasureSelect from "./measureSelect";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(
    <MeasureSelect onChange={() => {}} value={4} min={0} max={14} />
  );
});
