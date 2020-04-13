import { ThemeProvider } from "@material-ui/core";
import React from "react";
import { Provider } from "react-redux";
import store from "states/store";
import theme from "styles/theme";

import StructurePage from "./structurePage";

export default {
  title: "Pages|StructurePage",
  component: StructurePage
};

export const Default = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <StructurePage></StructurePage>
    </ThemeProvider>
  </Provider>
);
