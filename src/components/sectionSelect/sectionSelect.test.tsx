import React from "react";

import { SectionType } from "../../states/analysisSlice";
import TestEnvironment from "../../tests/TestEnvironment";
import SectionSelect from "./sectionSelect";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(
    <SectionSelect onChange={() => {}} value={SectionType.BRIDGE} />
  );
});
