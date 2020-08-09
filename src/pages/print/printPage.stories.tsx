import React from "react";
import { Provider } from "react-redux";
import store from "states/store";
import { Story, storyForPage } from "tests/Storybook";

import PrintPage from "./printPage";

export default storyForPage("PrintPage", PrintPage);

export const Default: Story = () => (
  <Provider store={store}>
    <PrintPage></PrintPage>
  </Provider>
);
