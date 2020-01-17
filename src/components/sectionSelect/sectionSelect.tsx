import { MenuItem } from "@material-ui/core";
import Select from "@material-ui/core/Select/Select";
import React, { FunctionComponent } from "react";

import { SectionType } from "../../states/analysis/analysisSlice";
import PeaksConfig from "../audioManagement/peaksConfig";

const SectionSelect: FunctionComponent<{
  value: SectionType;
  onChange: (sectionType: SectionType) => void;
}> = props => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    let newSection = event.target.value as SectionType;
    props.onChange(newSection);
  };

  return (
    <Select
      value={props.value}
      onChange={handleChange}
      style={{
        backgroundColor: PeaksConfig.SECTIONTYPE_TO_COLOR.get(props.value),
        minWidth: "140px"
      }}
    >
      {Object.values(SectionType).map(sectionType => {
        return (
          <MenuItem
            key={sectionType}
            value={sectionType}
            style={{
              backgroundColor: PeaksConfig.SECTIONTYPE_TO_COLOR.get(sectionType)
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
