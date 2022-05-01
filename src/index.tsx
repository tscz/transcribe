import "typeface-roboto";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { AUDIO_DOM_ELEMENT } from "states/middleware/peaksConfig";

import App from "./components/app/app";
import DialogManagement from "./components/dialogManagement/dialogManagement";
import store from "./states/store";
import theme from "./styles/theme";

const container = document.getElementById("root");

if (!container) throw new Error("root dom element could not be found!");

const root = createRoot(container);

const renderApp = () =>
  root.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MediaElement />
        <DialogManagement />
        <App />
      </ThemeProvider>
    </Provider>
  );

/** Enable logger in dev mode */
if (process.env.NODE_ENV !== "production") {
  localStorage.setItem("debug", "transcribe:*");
}

/** Enable hot reload while development */
if (process.env.NODE_ENV !== "production" && module.hot) {
  module.hot.accept("./components/app/app", renderApp);
}

const MediaElement = () => {
  return (
    <audio id={AUDIO_DOM_ELEMENT} controls hidden>
      Your browser does not support the audio element.
    </audio>
  );
};

renderApp();
