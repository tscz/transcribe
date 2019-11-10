import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import store from "../../store/store";
import App from "./app";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
