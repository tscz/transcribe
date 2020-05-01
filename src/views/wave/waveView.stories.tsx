import React from "react";
import { Provider } from "react-redux";
import store from "states/store";

import WaveView from "./waveView";

export default {
  title: "Views|WaveView",
  component: WaveView
};

export const Default = () => (
  <Provider store={store}>
    <WaveView></WaveView>
  </Provider>
);
