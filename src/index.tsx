import "typeface-roboto";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { AUDIO_DOM_ELEMENT } from "states/middleware/peaksConfig";

import App from "./components/app/app";
import DialogManagement from "./components/dialogManagement/dialogManagement";
import store from "./states/store";
import theme from "./styles/theme";

const renderApp = () =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MediaElement />
        <DialogManagement />
        <App />
      </ThemeProvider>
    </Provider>,
    document.getElementById("root")
  );

/** Enable logger in dev mode */
if (process.env.NODE_ENV !== "production") {
  localStorage.setItem("debug", "transcribe:*");
}

const MediaElement = () => {
  return (
    <audio id={AUDIO_DOM_ELEMENT} controls hidden>
      Your browser does not support the audio element.
    </audio>
  );
};

renderApp();
