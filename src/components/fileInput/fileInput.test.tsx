import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import FileInput, { FileType } from "./fileInput";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(
    <FileInput
      id="zipFileInput"
      fileType={FileType.ZIP}
      callback={(file, fileUrl) => {}}
    />
  );
});
