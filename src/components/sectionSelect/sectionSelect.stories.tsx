import React from "react";

import { SectionType } from "../../states/analysisSlice";
import SectionSelect from "./sectionSelect";

export default {
  title: "Components|SectionSelect",
  component: SectionSelect
};

var currentSelection = SectionType.INTRO;

export const Basic = () => (
  <SectionSelect
    value={currentSelection}
    onChange={sectionType => (currentSelection = sectionType)}
  ></SectionSelect>
);
