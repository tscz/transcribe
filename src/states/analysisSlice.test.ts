import reducer, {
  addedSection,
  AnalysisState,
  initialAnalysisState,
  removedSection,
  resettedAnalysis,
  SectionType,
  TimeSignatureType,
  updatedRhythm,
  updatedSource
} from "./analysisSlice";
import { Page } from "./projectSlice";
import { PersistedState } from "./store";

const initialState: AnalysisState = {
  sections: [],
  bpm: 42,
  firstMeasureStart: 3,
  secondsPerMeasure: 2.423,
  audioLength: 180,
  audioSampleRate: 44400,
  measures: [],
  timeSignature: TimeSignatureType.FOUR_FOUR
};

const persistedAnalysisState: AnalysisState = {
  sections: [],
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
    sections: [],
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
  let state: AnalysisState = reducer(
    undefined,
    addedSection({
      id: "section",
      startTime: 0,
      endTime: 10,
      type: SectionType.BRIDGE
    })
  );
  expect(state.sections).toContainEqual({
    id: "section",
    startTime: 0,
    endTime: 10,
    type: SectionType.BRIDGE
  });
});

it("can remove a section", () => {
  let state: AnalysisState = reducer(
    undefined,
    addedSection({
      id: "section",
      startTime: 0,
      endTime: 10,
      type: SectionType.BRIDGE
    })
  );
  expect(state.sections.length).toBe(1);

  let state2 = reducer(state, removedSection("section"));

  expect(state2.sections.length).toBe(0);
});
