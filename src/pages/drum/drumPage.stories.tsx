import React from "react";
import { Provider } from "react-redux";
import store from "states/store";

import DrumPage from "././drumPage";

export default {
  title: "Pages|DrumPage",
  component: DrumPage
};

export const Default = () => (
  <Provider store={store}>
    <DrumPage></DrumPage>
  </Provider>
);
