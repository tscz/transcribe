import React from "react";
import { Provider } from "react-redux";
import store from "states/store";

import StructurePage from "./structurePage";

export default {
  title: "Pages|StructurePage",
  component: StructurePage
};

export const Default = () => (
  <Provider store={store}>
    <StructurePage></StructurePage>
  </Provider>
);
