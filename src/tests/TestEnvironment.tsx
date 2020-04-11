import { ThemeProvider } from "@material-ui/core";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import store from "../states/store";
import theme from "../styles/theme";

export default class TestEnvironment {
  static renderWithStore = (element: ReactElement) => {
    const div = document.createElement("div");
    ReactDOM.render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>{element}</ThemeProvider>
      </Provider>,
      div
    );

    return div;
  };

  static smokeTest = (element: ReactElement) => {
    const div = TestEnvironment.renderWithStore(element);

    ReactDOM.unmountComponentAtNode(div);
  };
}
