import React from "react";
import { Story, storyForComponent } from "tests/Storybook";
import { Rectangle } from "tests/TestUtil";

import View from "./view";

export default storyForComponent("View", View);

export const Basic: Story = () =>
  Rectangle(<View title="test" body={<p>Test</p>}></View>);
