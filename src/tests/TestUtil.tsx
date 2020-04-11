import React, { ReactElement } from "react";

export const Rectangle = (content: string | ReactElement) => (
  <div
    style={{
      border: "2px solid #000",
      height: "100%"
    }}
  >
    {content}
  </div>
);
