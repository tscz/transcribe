import React from "react";
import { Provider } from "react-redux";
import store from "states/store";

import HarmonyPage from "./harmonyPage";

export default {
  title: "Pages|HarmonyPage",
  component: HarmonyPage
};

export const Default = () => (
  <Provider store={store}>
    <HarmonyPage></HarmonyPage>
  </Provider>
);
