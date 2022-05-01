import { ThemeProvider } from "@material-ui/core";
import { render } from "@testing-library/react";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { Store } from "redux";
import store from "states/store";
import theme from "styles/theme";

export default class TestEnvironment {
  static renderWithStore(element: ReactElement): ReactDOM.Root {
    const div = document.createElement("div");
    const root = ReactDOM.createRoot(div);

    root.render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>{element}</ThemeProvider>
      </Provider>
    );

    return root;
  }

  static smokeTest(element: ReactElement): void {
    act(() => {
      const root = TestEnvironment.renderWithStore(element);
    });
  }

  static shallowWithStore(
    element: ReactElement,
    store: Store
  ): ReturnType<typeof render> {
    return render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>{element}</ThemeProvider>
      </Provider>
    );
  }

  static shallowTest(
    element: ReactElement,
    store: Store
  ): ReturnType<typeof render> {
    return TestEnvironment.shallowWithStore(element, store);
  }
}
