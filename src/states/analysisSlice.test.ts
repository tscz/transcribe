import reducer, {
  addedSection,
  AnalysisState,
  initialAnalysisState,
  removedSection,
  resettedAnalysis,
  Section,
  SectionType,
  TimeSignatureType,
  updatedRhythm,
  updatedSource
} from "./analysisSlice";
import { Page } from "./projectSlice";
import { PersistedState } from "./store";

const initialState: AnalysisState = {
  sections: { allIds: [], byId: {} },
  bpm: 42,
  firstMeasureStart: 3,
  secondsPerMeasure: 2.423,
  audioLength: 180,
  audioSampleRate: 44400,
  measures: [],
  timeSignature: TimeSignatureType.FOUR_FOUR
};

const persistedAnalysisState: AnalysisState = {
  sections: { allIds: [], byId: {} },
  bpm: 120,
  firstMeasureStart: 1,
  secondsPerMeasure: 3,
  audioLength: 190,
  audioSampleRate: 48000,
  measures: [],
  timeSignature: TimeSignatureType.THREE_FOUR
};

const persistedState: PersistedState = {
  analysis: persistedAnalysisState,
  project: {
    currentPage: Page.DEFAULT,
    title: "",
    audioUrl: "blob:http://localhost:3000/01453364-ce0c-44ba-9f3a-e85a3d167d65",
    syncFirstMeasureStart: false,
    loaded: true
  }
};

it("can reset an analysis to the initial state", () => {
  let state: AnalysisState = reducer(initialState, resettedAnalysis({}));

  expect(state).toEqual(initialAnalysisState);
});

it("can reset an analysis from a persisted state", () => {
  let state: AnalysisState = reducer(
    initialState,
    resettedAnalysis({ state: persistedState })
  );
  expect(state).toEqual({
    sections: { allIds: [], byId: {} },
    bpm: 120,
    firstMeasureStart: 1,
    secondsPerMeasure: 3,
    audioLength: 190,
    audioSampleRate: 48000,
    measures: [],
    timeSignature: TimeSignatureType.THREE_FOUR
  });
});
it("can update the rhythm", () => {
  let state: AnalysisState = reducer(
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
  let state: AnalysisState = reducer(
    initialState,
    updatedRhythm({
      bpm: 123
    })
  );
  expect(state.bpm).toEqual(123);
});

it("can update the rhythm (only first measure start)", () => {
  let state: AnalysisState = reducer(
    initialState,
    updatedRhythm({
      firstMeasureStart: 23.2423
    })
  );
  expect(state.firstMeasureStart).toEqual(23.2423);
});

it("can update the rhythm (only time signature)", () => {
  let state: AnalysisState = reducer(
    initialState,
    updatedRhythm({
      timeSignatureType: TimeSignatureType.THREE_FOUR
    })
  );
  expect(state.timeSignature).toEqual(TimeSignatureType.THREE_FOUR);
});

it("can update the audio source", () => {
  let state: AnalysisState = reducer(
    initialState,
    updatedSource({ audioLength: 42, audioSampleRate: 44400 })
  );
  expect(state.audioLength).toEqual(42);
  expect(state.audioSampleRate).toEqual(44400);
});

it("can add a section", () => {
  let section: Section = {
    type: SectionType.BRIDGE,
    firstMeasure: 0,
    lastMeasure: 10
  };

  let id =
    section.type + "_" + section.firstMeasure + "_" + section.lastMeasure;

  let state: AnalysisState = reducer(undefined, addedSection(section));

  expect(state.sections.allIds).toContainEqual(id);
  expect(state.sections.byId[id]).toEqual(section);
});

it("can remove a section", () => {
  let section: Section = {
    type: SectionType.BRIDGE,
    firstMeasure: 0,
    lastMeasure: 10
  };

  let state: AnalysisState = reducer(undefined, addedSection(section));

  expect(state.sections.allIds.length).toBe(1);
  expect(state.sections.byId["BRIDGE_0_10"]).toEqual(section);

  state = reducer(state, removedSection("BRIDGE_0_10"));
  expect(state.sections.allIds.length).toBe(0);
  expect(state.sections.byId["BRIDGE_0_10"]).toEqual(undefined);
});
