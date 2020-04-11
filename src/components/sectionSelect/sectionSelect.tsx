import { MenuItem } from "@material-ui/core";
import Select from "@material-ui/core/Select/Select";
import React, { FunctionComponent } from "react";

import { SectionType } from "../../states/analysis/analysisSlice";
import PeaksConfig from "../audioManagement/peaksConfig";

const SectionSelect: FunctionComponent<{
  value: SectionType;
  onChange: (sectionType: SectionType) => void;
}> = (props) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newSection = event.target.value as SectionType;
    props.onChange(newSection);
  };

  return (
    <Select
      value={props.value}
      onChange={handleChange}
      style={{
        backgroundColor: PeaksConfig.getColor(props.value),
        minWidth: "140px"
      }}
    >
      {Object.values(SectionType).map((sectionType) => {
        return sectionType === SectionType.UNDEFINED ? undefined : (
          <MenuItem
            key={sectionType}
            value={sectionType}
            style={{
              backgroundColor: PeaksConfig.getColor(sectionType)
            }}
          >
            {sectionType}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default SectionSelect;
