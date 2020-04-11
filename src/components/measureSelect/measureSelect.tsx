import { MenuItem } from "@material-ui/core";
import Select from "@material-ui/core/Select/Select";
import React, { FunctionComponent } from "react";

const MeasureSelect: FunctionComponent<{
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}> = (props) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newMeasure = event.target.value as number;
    props.onChange(newMeasure);
  };

  return (
    <Select
      value={props.value}
      onChange={handleChange}
      style={{
        minWidth: "40px"
      }}
      disabled={props.disabled}
    >
      {new Array<number>(props.max - props.min + 1)
        .fill(0)
        .map((_, idx: number) => {
          return (
            <MenuItem key={props.min + idx} value={props.min + idx}>
              {props.min + idx}
            </MenuItem>
          );
        })}
    </Select>
  );
};

export default MeasureSelect;
