import "typeface-roboto";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import App from "./components/app/app";
import AudioManagement from "./components/audioManagement/audioManagement";
import DialogManagement from "./components/dialogManagement/dialogManagement";
import store from "./states/store";
import theme from "./styles/theme";

if (process.env.NODE_ENV !== "production") {
  localStorage.setItem("debug", "transcribe:*");
}

const renderApp = () =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <AudioManagement />
        <DialogManagement />
        <App />
      </ThemeProvider>
    </Provider>,
    document.getElementById("root")
  );

if (process.env.NODE_ENV !== "production" && module.hot) {
  module.hot.accept("./components/app/app", renderApp);
}

renderApp();
