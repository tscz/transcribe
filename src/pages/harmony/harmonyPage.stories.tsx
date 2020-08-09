import React from "react";
import { Provider } from "react-redux";
import store from "states/store";
import { Story, storyForPage } from "tests/Storybook";

import HarmonyPage from "./harmonyPage";

export default storyForPage("HarmonyPage", HarmonyPage);

export const Default: Story = () => (
  <Provider store={store}>
    <HarmonyPage></HarmonyPage>
  </Provider>
);
