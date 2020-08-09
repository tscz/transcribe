import { SectionType, TimeSignatureType } from "model/model";
import React from "react";
import { DialogType, openedDialog } from "states/dialog/dialogsSlice";
import {
  createdProject,
  initializedProject,
  LoadingStatus,
  Page
} from "states/project/projectSlice";
import store, { PersistedState } from "states/store";
import TestEnvironment from "tests/TestEnvironment";
import ArrayUtil from "util/ArrayUtil";

import DialogManagement from "./dialogManagement";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(<DialogManagement />);
});

it("no dialog is shown by default", () => {
  store.dispatch(openedDialog(DialogType.NONE));
  TestEnvironment.smokeTest(<DialogManagement />);
});

it("can display a dialog to create a new transcription project", () => {
  store.dispatch(openedDialog(DialogType.NEW));
  TestEnvironment.smokeTest(<DialogManagement />);
});

it("can display a dialog to create a open project", () => {
  store.dispatch(openedDialog(DialogType.OPEN));
  TestEnvironment.smokeTest(<DialogManagement />);
});

it("can display a dialog to save a project", () => {
  store.dispatch(openedDialog(DialogType.SAVE));
  TestEnvironment.smokeTest(<DialogManagement />);
});

it("can display a dialog to add sections", () => {
  const persistedState: PersistedState = {
    analysis: {
      duration: 100,
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
  store.dispatch(initializedProject());

  store.dispatch(openedDialog(DialogType.ADD_SECTION));

  TestEnvironment.shallowTest(<DialogManagement />, store);
});
