import Grid from "@material-ui/core/Grid";
import React, { ReactElement } from "react";

interface Props {
  topLeft: ReactElement;
  topRight: ReactElement;
  bottom?: ReactElement;
}

class ContentLayout extends React.Component<Props> {
  render() {
    return (
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={10} style={{ minHeight: "400px" }}>
          {this.props.topLeft}
        </Grid>
        <Grid item xs={2}>
          {this.props.topRight}
        </Grid>
        <Grid item xs={12}>
          {this.props.bottom}
        </Grid>
      </Grid>
    );
  }
}

export default ContentLayout;
