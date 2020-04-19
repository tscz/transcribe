import {
  createdProject,
  LoadingStatus,
  Page
} from "states/project/projectSlice";
import { PersistedState } from "states/store";
import ArrayUtil from "util/ArrayUtil";

import reducer, {
  addedSection,
  AnalysisState,
  removedSection,
  Section,
  SectionType,
  TimeSignatureType,
  updatedRhythm
} from "./analysisSlice";

const initialState: AnalysisState = {
  sections: { allIds: [], byId: {} },
  bpm: 42,
  firstMeasureStart: 3,
  duration: 180,
  measures: { allIds: [], byId: {} },
  timeSignature: TimeSignatureType.FOUR_FOUR
};

const persistedAnalysisState: AnalysisState = {
  sections: { allIds: [], byId: {} },
  bpm: 120,
  firstMeasureStart: 1,
  duration: 190,
  measures: { allIds: [], byId: {} },
  timeSignature: TimeSignatureType.THREE_FOUR
};

const persistedState: PersistedState = {
  analysis: persistedAnalysisState,
  project: {
    status: LoadingStatus.NOT_INITIALIZED,
    currentPage: Page.DEFAULT,
    title: "",
    audioUrl: "blob:http://localhost:3000/01453364-ce0c-44ba-9f3a-e85a3d167d65",
    syncFirstMeasureStart: false
  }
};

it("can reset an analysis from a persisted state", () => {
  const state: AnalysisState = reducer(
    initialState,
    createdProject(persistedState)
  );
  expect(state).toEqual({
    sections: { allIds: [], byId: {} },
    bpm: 120,
    firstMeasureStart: 1,
    duration: 190,
    measures: { allIds: [], byId: {} },
    timeSignature: TimeSignatureType.THREE_FOUR
  });
});

it("can update the rhythm", () => {
  const state: AnalysisState = reducer(
    initialState,
    updatedRhythm({
      bpm: 123,
      firstMeasureStart: 23.2423,
      timeSignatureType: TimeSignatureType.THREE_FOUR
    })
  );
  expect(state.bpm).toEqual(123);
  expect(state.firstMeasureStart).toEqual(23.2423);
  expect(state.timeSignature).toEqual(TimeSignatureType.THREE_FOUR);
});

it("can update the rythm (only bpm)", () => {
  const state: AnalysisState = reducer(
    initialState,
    updatedRhythm({
      bpm: 123
    })
  );
  expect(state.bpm).toEqual(123);
});

it("can update the rhythm (only first measure start)", () => {
  const state: AnalysisState = reducer(
    initialState,
    updatedRhythm({
      firstMeasureStart: 23.2423
    })
  );
  expect(state.firstMeasureStart).toEqual(23.2423);
});

it("can update the rhythm (only time signature)", () => {
  const state: AnalysisState = reducer(
    initialState,
    updatedRhythm({
      timeSignatureType: TimeSignatureType.THREE_FOUR
    })
  );
  expect(state.timeSignature).toEqual(TimeSignatureType.THREE_FOUR);
});

const initialState2: AnalysisState = {
  sections: {
    allIds: ["UNDEFINED_0_99"],
    byId: {
      UNDEFINED_0_99: {
        measures: ArrayUtil.range(0, 99),
        type: SectionType.UNDEFINED
      }
    }
  },
  bpm: 42,
  firstMeasureStart: 3,
  duration: 180,
  measures: { allIds: [], byId: {} },
  timeSignature: TimeSignatureType.FOUR_FOUR
};
it("can add a section", () => {
  const section: Section = {
    type: SectionType.BRIDGE,
    measures: ["0", "1", "2", "3", "4"]
  };

  const state: AnalysisState = reducer(initialState2, addedSection(section));

  expect(state.sections.allIds).toContainEqual("BRIDGE_0_4");
  expect(state.sections.byId["BRIDGE_0_4"]).toEqual(section);
});

it("can remove a section", () => {
  const section: Section = {
    type: SectionType.BRIDGE,
    measures: ["0", "1", "2", "3", "4"]
  };

  let state: AnalysisState = reducer(initialState2, addedSection(section));

  expect(state.sections.allIds.length).toBe(2);
  expect(state.sections.byId["BRIDGE_0_4"]).toEqual(section);

  state = reducer(state, removedSection("BRIDGE_0_4"));
  expect(state.sections.allIds.length).toBe(1);
  expect(state.sections.byId["BRIDGE_0_4"]).toBeUndefined();
  expect(state.sections.byId["UNDEFINED_0_99"]).toBeDefined();
});

it("can remove sections after changing rhythm", () => {
  const bridgeSection: Section = {
    type: SectionType.BRIDGE,
    measures: ArrayUtil.range(0, 98)
  };

  let state: AnalysisState = reducer(
    initialState2,
    addedSection(bridgeSection)
  );

  expect(state.sections.allIds.length).toBe(2);
  expect(state.sections.byId["BRIDGE_0_98"]).toBeDefined();
  expect(state.sections.byId["UNDEFINED_99_99"]).toBeDefined();

  state = reducer(state, updatedRhythm({ bpm: 60 }));

  expect(state.sections.allIds.length).toBe(1);
  expect(state.sections.byId["UNDEFINED_0_44"]).toBeDefined();
});
