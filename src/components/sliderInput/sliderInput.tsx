import { Box, FormControl, InputLabel, Slider } from "@material-ui/core";
import React from "react";

const SliderInput = (props: {
  title: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (event: any, value: number | number[]) => void;
}) => {
  return (
    <FormControl style={{ width: "100%" }}>
      <InputLabel shrink>{props.title}</InputLabel>
      <Box mt={2}>
        <Slider
          value={props.value}
          valueLabelDisplay="auto"
          min={props.min}
          max={props.max}
          onChange={props.onChange}
          step={props.step}
        />
      </Box>
    </FormControl>
  );
};

export default SliderInput;
