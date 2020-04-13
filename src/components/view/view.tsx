import {
  CardHeader,
  createStyles,
  Theme,
  WithStyles,
  withStyles
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import React, { ReactElement } from "react";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      backgroundColor: theme.view.background
    },
    header: {
      backgroundColor: theme.view.headerBackground,
      padding: theme.view.headerPadding
    }
  });

interface Props {
  body: ReactElement;
  title: string;
  action?: ReactElement;
}

type PropsWithStyle = Props & WithStyles<typeof styles>;

const View = withStyles(styles)((props: PropsWithStyle) => {
  return (
    <Card className={props.classes.root} raised={false}>
      <CardHeader
        titleTypographyProps={{ variant: "subtitle1" }}
        title={props.title}
        className={props.classes.header}
        action={props.action}
      />
      <CardContent>{props.body}</CardContent>
    </Card>
  );
});

export default View;
