import React, { ReactElement } from "react";

export function Rectangle(content: string | ReactElement): JSX.Element {
  return (
    <div
      // eslint-disable-next-line react/forbid-dom-props
      style={{
        border: "2px solid #000",
        height: "100%"
      }}
    >
      {content}
    </div>
  );
}
