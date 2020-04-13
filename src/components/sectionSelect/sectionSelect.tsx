import {
  createStyles,
  MenuItem,
  Theme,
  WithStyles,
  withStyles
} from "@material-ui/core";
import Select from "@material-ui/core/Select/Select";
import clsx from "clsx";
import React from "react";
import { SectionType } from "states/analysis/analysisSlice";
import { getColor } from "styles/theme";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      minWidth: theme.sectionSelect.minWidth
    },
    colored: {
      backgroundColor: (props: Props) => getColor(props.value)
    }
  });

interface Props {
  value: SectionType;
  onChange: (sectionType: SectionType) => void;
}

type PropsWithStyle = Props & WithStyles<typeof styles>;

const SectionSelect = withStyles(styles)((props: PropsWithStyle) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newSection = event.target.value as SectionType;
    props.onChange(newSection);
  };

  return (
    <Select
      value={props.value}
      onChange={handleChange}
      className={clsx(props.classes.root, props.classes.colored)}
    >
      {Object.values(SectionType).map((sectionType) => {
        return sectionType === SectionType.UNDEFINED ? undefined : (
          <MenuItem
            key={sectionType}
            value={sectionType}
            // eslint-disable-next-line react/forbid-component-props
            style={{ backgroundColor: getColor(sectionType) }}
          >
            {sectionType}
          </MenuItem>
        );
      })}
    </Select>
  );
});

export default SectionSelect;
