import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PointAddOptions } from "peaks.js";

import ArrayUtil from "../util/ArrayUtil";
import {
  distributeMeasures,
  enclosingSectionOf,
  mergeSections,
  replaceSections,
  sectionInvalid,
  undefinedSection
} from "./analysisUtil";
import { createdProject, initializedProject } from "./projectSlice";
import { NormalizedObjects } from "./store";

export interface AnalysisState {
  readonly sections: NormalizedObjects<Section>;
  readonly audioDuration: number;
  readonly audioSampleRate: number;
  readonly firstMeasureStart: number;
  readonly timeSignature: TimeSignatureType;
  readonly bpm: number;
  readonly measures: NormalizedObjects<Measure>;
}

export interface Section {
  type: SectionType;
  measures: string[];
}

export interface Measure extends PointAddOptions {}

export interface TimeSignature {
  beatsPerMeasure: number;
  beatUnit: number;
}

export enum TimeSignatureType {
  FOUR_FOUR = "FOUR_FOUR",
  THREE_FOUR = "THREE_FOUR"
}

export enum SectionType {
  INTRO = "INTRO",
  VERSE = "VERSE",
  PRECHORUS = "PRECHORUS",
  CHORUS = "CHORUS",
  BRIDGE = "BRIDGE",
  SOLO = "SOLO",
  OUTRO = "OUTRO",
  UNDEFINED = "UNDEFINED"
}

export const initialAnalysisState: AnalysisState = {
  sections: { allIds: [], byId: {} },
  bpm: 120,
  firstMeasureStart: 0,
  audioDuration: 180,
  audioSampleRate: 44400,
  measures: { allIds: [], byId: {} },
  timeSignature: TimeSignatureType.FOUR_FOUR
};

const analysisSlice = createSlice({
  name: "analysis",
  initialState: initialAnalysisState,
  extraReducers: builder =>
    builder
      .addCase(createdProject, (state, action) => {
        return action.payload.analysis;
      })
      .addCase(initializedProject, (state, action) => {
        state.audioDuration = action.payload.audioDuration;
        state.audioSampleRate = action.payload.audioSampleRate;

        state.measures = distributeMeasures(
          state.timeSignature,
          state.bpm,
          state.firstMeasureStart,
          state.audioDuration
        );

        state.sections = undefinedSection(state.measures.allIds.length - 1);
      }),
  reducers: {
    addedSection(state, action: PayloadAction<Section>) {
      return addSection(state, action.payload);
    },
    updatedSection(
      state,
      action: PayloadAction<{ before: string; after: Section }>
    ) {
      removeSection(state, action.payload.before);
      return addSection(state, action.payload.after);
    },
    removedSection(state, action: PayloadAction<string>) {
      removeSection(state, action.payload);

      return state;
    },
    updatedRhythm(
      state,
      action: PayloadAction<{
        firstMeasureStart?: number;
        bpm?: number;
        timeSignatureType?: TimeSignatureType;
      }>
    ) {
      state.bpm = action.payload.bpm ?? state.bpm;
      state.firstMeasureStart =
        action.payload.firstMeasureStart ?? state.firstMeasureStart;
      state.timeSignature =
        action.payload.timeSignatureType ?? state.timeSignature;

      state.measures = distributeMeasures(
        state.timeSignature,
        state.bpm,
        state.firstMeasureStart,
        state.audioDuration
      );
    }
  }
});

const addSection: (
  state: AnalysisState,
  newSection: Section
) => AnalysisState = (state, newSection) => {
  if (sectionInvalid(newSection)) return state;

  let enclosingSection = enclosingSectionOf(newSection, state.sections);
  if (
    enclosingSection === undefined ||
    enclosingSection.section.type !== SectionType.UNDEFINED
  )
    return state;

  let mergedSections = mergeSections(enclosingSection.section, newSection);

  replaceSections(state.sections, enclosingSection.position, 1, mergedSections);

  return state;
};

const removeSection: (state: AnalysisState, sectionId: string) => void = (
  state,
  sectionId
) => {
  let position = state.sections.allIds.indexOf(sectionId);
  let section = state.sections.byId[sectionId];

  let before = state.sections.allIds[position - 1];
  let after = state.sections.allIds[position + 1];

  let { start: firstMeasure, end: lastMeasure } = ArrayUtil.bordersOf(
    section.measures
  );
  let removalStart = position;
  let removalCount = 1;

  if (
    before !== undefined &&
    state.sections.byId[before].type === SectionType.UNDEFINED
  ) {
    removalStart--;
    removalCount++;
    firstMeasure = parseInt(state.sections.byId[before].measures[0]);
  }

  if (
    after !== undefined &&
    state.sections.byId[after].type === SectionType.UNDEFINED
  ) {
    removalCount++;
    lastMeasure = parseInt(ArrayUtil.last(state.sections.byId[after].measures));
  }

  replaceSections(state.sections, removalStart, removalCount, [
    {
      measures: ArrayUtil.range(firstMeasure, lastMeasure),
      type: SectionType.UNDEFINED
    }
  ]);
};

export const {
  addedSection,
  removedSection,
  updatedRhythm,
  updatedSection
} = analysisSlice.actions;

export default analysisSlice.reducer;
