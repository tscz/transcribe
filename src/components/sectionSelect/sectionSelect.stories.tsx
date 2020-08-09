import { SectionType } from "model/model";
import React, { useState } from "react";
import { Story, storyForComponent } from "tests/Storybook";

import SectionSelect from "./sectionSelect";

export default storyForComponent("SectionSelect", SectionSelect);

export const Basic: Story = () => {
  const [section, setSection] = useState(SectionType.BRIDGE);

  return (
    <>
      <SectionSelect
        value={section}
        onChange={(sectionType) => setSection(sectionType)}
      ></SectionSelect>
    </>
  );
};
