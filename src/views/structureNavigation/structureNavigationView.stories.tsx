import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { SectionType, TimeSignatureType } from "model/model";
import React from "react";
import { Provider } from "react-redux";
import { updatedRhythm } from "states/analysis/analysisSlice";
import {
  createdProject,
  initializedProject,
  LoadingStatus,
  Page
} from "states/project/projectSlice";
import store, { PersistedState } from "states/store";
import theme from "styles/theme";
import { Story, storyForView } from "tests/Storybook";
import ArrayUtil from "util/ArrayUtil";

import StructureNavigationView from "./structureNavigationView";

export default storyForView("StructureNavigationView", StructureNavigationView);

export const Default: Story = () => {
  const persistedState: PersistedState = {
    analysis: {
      duration: 140,
      bpm: 120,
      firstMeasureStart: 0,
      measures: { allIds: [], byId: {} },
      sections: {
        allIds: [
          "INTRO_0_3",
          "VERSE_4_19",
          "CHORUS_20_27",
          "VERSE_28_43",
          "CHORUS_44_51",
          "BRIDGE_52_59",
          "CHORUS_60_67"
        ],
        byId: {
          INTRO_0_3: {
            measures: ArrayUtil.range(0, 3),
            type: SectionType.INTRO
          },
          VERSE_4_19: {
            measures: ArrayUtil.range(4, 19),
            type: SectionType.VERSE
          },
          CHORUS_20_27: {
            measures: ArrayUtil.range(20, 27),
            type: SectionType.CHORUS
          },
          VERSE_28_43: {
            measures: ArrayUtil.range(28, 43),
            type: SectionType.VERSE
          },
          CHORUS_44_51: {
            measures: ArrayUtil.range(44, 51),
            type: SectionType.CHORUS
          },
          BRIDGE_52_59: {
            measures: ArrayUtil.range(52, 59),
            type: SectionType.BRIDGE
          },
          CHORUS_60_67: {
            measures: ArrayUtil.range(60, 67),
            type: SectionType.CHORUS
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
  store.dispatch(updatedRhythm({ bpm: 120 }));
  store.dispatch(initializedProject());

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <StructureNavigationView></StructureNavigationView>
      </ThemeProvider>
    </Provider>
  );
};
