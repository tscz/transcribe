import { CssBaseline, ThemeProvider } from "@material-ui/core";
import React from "react";
import { Provider } from "react-redux";

import { addedSection, SectionType } from "../../states/analysisSlice";
import store from "../../states/store";
import theme from "../../styles/theme";
import StructureView from "./structureView";

export default {
  title: "Views|StructureView",
  component: StructureView
};

export const Default = () => {
  store.dispatch(
    addedSection({
      type: SectionType.INTRO,
      firstMeasure: 0,
      lastMeasure: 1
    })
  );
  store.dispatch(
    addedSection({
      type: SectionType.VERSE,
      firstMeasure: 1,
      lastMeasure: 2
    })
  );
  store.dispatch(
    addedSection({
      type: SectionType.CHORUS,
      firstMeasure: 2,
      lastMeasure: 3
    })
  );

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <StructureView></StructureView>
      </ThemeProvider>
    </Provider>
  );
};
