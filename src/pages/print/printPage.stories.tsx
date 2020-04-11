import React from "react";
import { Provider } from "react-redux";

import store from "../../states/store";
import PrintPage from "./printPage";

export default {
  title: "Pages|PrintPage",
  component: PrintPage
};

export const Default = () => (
  <Provider store={store}>
    <PrintPage></PrintPage>
  </Provider>
);
