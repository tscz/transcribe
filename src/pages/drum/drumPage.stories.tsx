import React from "react";
import { Provider } from "react-redux";
import store from "states/store";
import { Story, storyForPage } from "tests/Storybook";

import DrumPage from "././drumPage";

export default storyForPage("DrumPage", DrumPage);

export const Default: Story = () => (
  <Provider store={store}>
    <DrumPage></DrumPage>
  </Provider>
);
