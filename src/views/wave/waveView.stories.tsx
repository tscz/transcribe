import React from "react";
import { Provider } from "react-redux";
import store from "states/store";
import { Story, storyForView } from "tests/Storybook";

import WaveView from "./waveView";

export default storyForView("WaveView", WaveView);

export const Default: Story = () => (
  <Provider store={store}>
    <WaveView></WaveView>
  </Provider>
);
