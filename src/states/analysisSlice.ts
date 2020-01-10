import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PointAddOptions } from "peaks.js";

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

export const toTimeSignature = (type: TimeSignatureType) => {
  switch (type) {
    case TimeSignatureType.FOUR_FOUR:
      return { beatUnit: 4, beatsPerMeasure: 4 };
    case TimeSignatureType.THREE_FOUR:
      return { beatUnit: 4, beatsPerMeasure: 3 };
  }
};

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

const generateMeasures = (
  timeSignatureType: TimeSignatureType,
  bpm: number,
  firstMeasureStart: number,
  length: number
) => {
  const timeSignature = toTimeSignature(timeSignatureType);
  const lengthOfOneMeasure = (60 * timeSignature.beatsPerMeasure) / bpm;
  const measures: NormalizedObjects<Measure> = { allIds: [], byId: {} };

  let index = 0;
  for (
    let start = firstMeasureStart;
    start < length;
    start += lengthOfOneMeasure
  ) {
    measures.allIds.push("" + index);
    measures.byId[index] = {
      time: start,
      color: "",
      editable: false,
      id: "" + index,
      labelText: "" + index
    };
    index++;
  }

  return measures;
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
        state.measures = generateMeasures(
          state.timeSignature,
          state.bpm,
          state.firstMeasureStart,
          state.audioDuration
        );
      }),
  reducers: {
    addedSection(state, action: PayloadAction<Section>) {
      const id = generateSectionId(action.payload);
      state.sections.allIds.push(id);
      state.sections.byId[id] = action.payload;
    },
    updatedSection(
      state,
      action: PayloadAction<{ before: string; after: Section }>
    ) {
      state.sections.allIds = state.sections.allIds.filter(
        id => id !== action.payload.before
      );

      delete state.sections.byId[action.payload.before];

      const id = generateSectionId(action.payload.after);
      state.sections.allIds.push(id);
      state.sections.byId[id] = action.payload.after;
    },
    removedSection(state, action: PayloadAction<string>) {
      state.sections.allIds = state.sections.allIds.filter(
        id => id !== action.payload
      );

      delete state.sections.byId[action.payload];
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

      state.measures = generateMeasures(
        state.timeSignature,
        state.bpm,
        state.firstMeasureStart,
        state.audioDuration
      );
    }
  }
});

const generateSectionId = (section: Section) =>
  section.type +
  "_" +
  section.measures[0] +
  "_" +
  section.measures[section.measures.length - 1];

export const {
  addedSection,
  removedSection,
  updatedRhythm,
  updatedSection
} = analysisSlice.actions;

export default analysisSlice.reducer;
