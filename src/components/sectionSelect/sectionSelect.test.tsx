import { SectionType } from "model/model";
import React from "react";
import TestEnvironment from "tests/TestEnvironment";

import SectionSelect from "./sectionSelect";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(
    <SectionSelect onChange={() => {}} value={SectionType.BRIDGE} />
  );
});
