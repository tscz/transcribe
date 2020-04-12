import { CssBaseline, ThemeProvider } from "@material-ui/core";
import React from "react";
import { Provider } from "react-redux";
import { SectionType, TimeSignatureType } from "states/analysis/analysisSlice";
import {
  createdProject,
  initializedProject,
  LoadingStatus,
  Page
} from "states/project/projectSlice";
import store, { PersistedState } from "states/store";
import theme from "styles/theme";

import StructureView from "./structureView";

export default {
  title: "Views|StructureView",
  component: StructureView
};

export const Default = () => {
  const persistedState: PersistedState = {
    analysis: {
      audioDuration: 100,
      audioSampleRate: 44400,
      bpm: 120,
      firstMeasureStart: 0,
      measures: { allIds: [], byId: {} },
      sections: {
        allIds: ["INTRO_0_3", "VERSE_3_6", "CHORUS_6_10", "OUTRO_10_14"],
        byId: {
          INTRO_0_3: {
            measures: ["0", "1", "2", "3"],
            type: SectionType.INTRO
          },
          VERSE_3_6: {
            measures: ["3", "4", "5", "6"],
            type: SectionType.VERSE
          },
          CHORUS_6_10: {
            measures: ["6", "7", "8", "9", "10"],
            type: SectionType.CHORUS
          },
          OUTRO_10_14: {
            measures: ["10", "11", "12", "13", "14"],
            type: SectionType.OUTRO
          }
        }
      },
      timeSignature: TimeSignatureType.FOUR_FOUR
    },
    project: {
      audioUrl: "",
      currentPage: Page.DEFAULT,
      status: LoadingStatus.NOT_INITIALIZED,
      syncFirstMeasureStart: false,
      title: "Testproject"
    }
  };

  store.dispatch(createdProject(persistedState));
  store.dispatch(
    initializedProject({ audioDuration: 240, audioSampleRate: 44400 })
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
