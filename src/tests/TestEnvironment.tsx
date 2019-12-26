import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import store from "../states/store";

export default class TestEnvironment {
  static renderWithStore = (element: ReactElement) => {
    const div = document.createElement("div");
    ReactDOM.render(<Provider store={store}>{element}</Provider>, div);

    return div;
  };

  static smokeTest = (element: ReactElement) => {
    const div = TestEnvironment.renderWithStore(element);

    ReactDOM.unmountComponentAtNode(div);
  };
}
