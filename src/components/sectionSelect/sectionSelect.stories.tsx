import { SectionType } from "model/model";
import React, { useState } from "react";

import SectionSelect from "./sectionSelect";

export default {
  title: "Components|SectionSelect",
  component: SectionSelect
};

export const Basic = () => {
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
