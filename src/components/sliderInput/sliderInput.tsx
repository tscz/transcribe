import {
  Box,
  createStyles,
  FormControl,
  InputLabel,
  Slider,
  WithStyles,
  withStyles
} from "@material-ui/core";
import React from "react";

const styles = () =>
  createStyles({
    root: {
      width: "100%"
    }
  });

interface Props {
  title: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (event: React.ChangeEvent<{}>, value: number | number[]) => void;
}

type PropsWithStyle = Props & WithStyles<typeof styles>;

const SliderInput = withStyles(styles)((props: PropsWithStyle) => {
  return (
    <FormControl className={props.classes.root}>
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
});

export default SliderInput;
