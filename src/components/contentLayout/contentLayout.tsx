import Grid from "@material-ui/core/Grid";
import React, { ReactElement } from "react";

interface Props {
  topLeft: ReactElement;
  topRight: ReactElement;
  bottomLeft: ReactElement;
  bottomRight: ReactElement;
}

class ContentLayout extends React.Component<Props> {
  render() {
    return (
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={10}>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12}>
              {this.props.topLeft}
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="stretch">
                <Grid item xs={8}>
                  {this.props.bottomLeft}
                </Grid>
                <Grid item xs={4}>
                  {this.props.bottomRight}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          {this.props.topRight}
        </Grid>
      </Grid>
    );
  }
}

export default ContentLayout;
