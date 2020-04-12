import React from "react";
import { Provider } from "react-redux";
import store from "states/store";

import DefaultPage from "./defaultPage";

export default {
  title: "Pages|DefaultPage",
  component: DefaultPage
};

export const Default = () => (
  <Provider store={store}>
    <DefaultPage></DefaultPage>
  </Provider>
);
