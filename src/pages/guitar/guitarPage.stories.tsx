import React from "react";
import { Provider } from "react-redux";
import store from "states/store";
import { Story, storyForPage } from "tests/Storybook";

import GuitarPage from "./guitarPage";

export default storyForPage("GuitarPage", GuitarPage);

export const Default: Story = () => (
  <Provider store={store}>
    <GuitarPage></GuitarPage>
  </Provider>
);
