import React from "react";
import { Provider } from "react-redux";

import store from "../../states/store";
import WaveControlView from "./waveControlView";

export default {
  title: "Views|WaveControlView",
  component: WaveControlView
};

export const Default = () => (
  <Provider store={store}>
    <WaveControlView></WaveControlView>
  </Provider>
);
