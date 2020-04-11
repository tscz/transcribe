import React, { useState } from "react";

import MeasureSelect from "./measureSelect";

export default {
  title: "Components|MeasureSelect",
  component: MeasureSelect
};

export const Basic = () => {
  const [measure, setMeasure] = useState(4);

  return (
    <>
      <MeasureSelect
        onChange={(measure) => setMeasure(measure)}
        value={measure}
        min={0}
        max={14}
      />
    </>
  );
};
