import { ThemeProvider } from "@material-ui/core";
import { shallow } from "enzyme";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Store } from "redux";
import store from "states/store";
import theme from "styles/theme";

export default class TestEnvironment {
  static renderWithStore(element: ReactElement): HTMLDivElement {
    const div = document.createElement("div");
    ReactDOM.render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>{element}</ThemeProvider>
      </Provider>,
      div
    );

    return div;
  }

  static smokeTest(element: ReactElement): void {
    const div = TestEnvironment.renderWithStore(element);

    ReactDOM.unmountComponentAtNode(div);
  }

  static shallowWithStore(
    element: ReactElement,
    store: Store
  ): ReturnType<typeof shallow> {
    return shallow(
      <Provider store={store}>
        <ThemeProvider theme={theme}>{element}</ThemeProvider>
      </Provider>
    );
  }

  static shallowTest(
    element: ReactElement,
    store: Store
  ): ReturnType<typeof shallow> {
    return TestEnvironment.shallowWithStore(element, store);
  }
}
