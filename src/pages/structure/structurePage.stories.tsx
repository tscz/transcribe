import { ThemeProvider } from "@material-ui/core";
import React from "react";
import { Provider } from "react-redux";
import store from "states/store";
import theme from "styles/theme";
import { Story, storyForPage } from "tests/Storybook";

import StructurePage from "./structurePage";

export default storyForPage("StructurePage", StructurePage);

export const Default: Story = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <StructurePage></StructurePage>
    </ThemeProvider>
  </Provider>
);
