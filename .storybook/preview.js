import { ThemeProvider } from "@material-ui/core/styles";
import theme from "styles/theme";
import React from "react";

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
];