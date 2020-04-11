import React from "react";
import { Provider } from "react-redux";

import store from "../../states/store";
import GuitarPage from "./guitarPage";

export default {
  title: "Pages|GuitarPage",
  component: GuitarPage
};

export const Default = () => (
  <Provider store={store}>
    <GuitarPage></GuitarPage>
  </Provider>
);
