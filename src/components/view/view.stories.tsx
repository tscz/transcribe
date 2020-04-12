import React from "react";
import { Rectangle } from "tests/TestUtil";

import View from "./view";

export default {
  title: "Components|View",
  component: View
};

export const Basic = () =>
  Rectangle(<View title="test" body={<p>Test</p>}></View>);
