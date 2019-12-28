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
      startTime: 0,
      endTime: 1,
      id: "intro"
    })
  );
  store.dispatch(
    addedSection({
      type: SectionType.VERSE,
      startTime: 1,
      endTime: 2,
      id: "verse"
    })
  );
  store.dispatch(
    addedSection({
      type: SectionType.CHORUS,
      startTime: 2,
      endTime: 3,
      id: "chorus"
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
