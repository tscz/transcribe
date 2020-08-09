import React, { useState } from "react";
import { Story, storyForComponent } from "tests/Storybook";

import MeasureSelect from "./measureSelect";

export default storyForComponent("MeasureSelect", MeasureSelect);

export const Basic: Story = () => {
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
