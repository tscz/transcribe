import { createStyles, WithStyles, withStyles } from "@material-ui/core";
import React, { Component, PropsWithChildren } from "react";

interface Props extends PropsWithChildren<WithStyles<typeof stylesForToggle>> {
  show: boolean;
}

class Toggle extends Component<Props> {
  render() {
    return (
      <div
        className={
          this.props.show
            ? this.props.classes.inline
            : this.props.classes.invisible
        }
      >
        {this.props.children}
      </div>
    );
  }
}

const stylesForToggle = () =>
  createStyles({
    inline: {
      display: "inline"
    },
    invisible: {
      display: "none"
    }
  });

export default withStyles(stylesForToggle, { withTheme: true })(Toggle);
