import React from "react";
import { Provider } from "react-redux";
import store from "states/store";
import { Story, storyForPage } from "tests/Storybook";

import DefaultPage from "./defaultPage";

export default storyForPage("DefaultPage", DefaultPage);

export const Default: Story = () => (
  <Provider store={store}>
    <DefaultPage></DefaultPage>
  </Provider>
);
