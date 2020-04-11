import React from "react";

import { Rectangle } from "../../tests/TestUtil";
import ContentLayout from "./contentLayout";

export default {
  title: "Components|ContentLayout",
  component: ContentLayout
};

export const Basic = () =>
  Rectangle(
    <ContentLayout
      topLeft={Rectangle("topLeft")}
      topRight={Rectangle("topRight")}
      bottom={Rectangle("bottom")}
    ></ContentLayout>
  );
