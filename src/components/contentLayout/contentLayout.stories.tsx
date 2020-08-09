import React from "react";
import { Story, storyForComponent } from "tests/Storybook";
import { Rectangle } from "tests/TestUtil";

import ContentLayout from "./contentLayout";

export default storyForComponent("ContentLayout", ContentLayout);

export const Basic: Story = () =>
  Rectangle(
    <ContentLayout
      topLeft={Rectangle("topLeft")}
      topRight={Rectangle("topRight")}
      bottomLeft={Rectangle("bottomLeft")}
      bottomRight={Rectangle("bottomRight")}
    ></ContentLayout>
  );
