import React from "react";

import ContentLayout from "./contentLayout";

export default {
  title: "Components|ContentLayout",
  component: ContentLayout
};

export const Basic = () => (
  <ContentLayout
    topLeft={Rectangle("topLeft")}
    topRight={Rectangle("topRight")}
    bottom={Rectangle("bottom")}
  ></ContentLayout>
);

const Rectangle = (content: string) => (
  <div
    style={{
      border: "2px solid #000",
      height: "100%"
    }}
  >
    {content}
  </div>
);
