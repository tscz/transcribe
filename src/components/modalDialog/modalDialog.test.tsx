import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import ModalDialog from "./modalDialog";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<ModalDialog title="Test" onCancel={() => {}} />);
});
