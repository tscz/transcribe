import { MenuItem } from "@material-ui/core";
import Select from "@material-ui/core/Select/Select";
import React, { FunctionComponent } from "react";

import { SectionType } from "../../states/analysisSlice";
import PeaksOptions from "../audioManagement/peaksConfig";

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
        backgroundColor: PeaksOptions.SECTIONTYPE_TO_COLOR.get(props.value)
      }}
    >
      {Object.values(SectionType).map(sectionType => {
        return (
          <MenuItem
            value={sectionType}
            style={{
              backgroundColor: PeaksOptions.SECTIONTYPE_TO_COLOR.get(
                sectionType
              )
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
