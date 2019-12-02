import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PointAddOptions, SegmentAddOptions } from "peaks.js";

export interface AnalysisState {
  readonly sections: Section[];
  readonly audioLength: number;
  readonly audioSampleRate: number;
  readonly firstMeasureStart: number;
  readonly secondsPerMeasure: number;
  readonly timeSignature: TimeSignatureType;
  readonly bpm: number;
  readonly measures: Measure[];
}

export interface Section extends SegmentAddOptions {
  type: SectionType;
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
  OUTRO = "OUTRO"
}

export const initialState: AnalysisState = {
  sections: [],
  bpm: 120,
  firstMeasureStart: 0,
  secondsPerMeasure: 2,
  audioLength: 180,
  audioSampleRate: 44400,
  measures: [],
  timeSignature: TimeSignatureType.FOUR_FOUR
};

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    addedSection(state, action: PayloadAction<Section>) {
      //TODO
    },
    updatedSection(state, action: PayloadAction<Section>) {
      //TODO
    },
    removedSection(state, action: PayloadAction<Section>) {
      //TODO
    },
    resettedAnalysis(state, action: Action) {
      state = initialState;
    },
    updatedRhythm(
      state,
      action: PayloadAction<{
        firstMeasureStart?: number;
        bpm?: number;
        timeSignatureType?: TimeSignatureType;
      }>
    ) {
      let length = state.audioLength;
      var { firstMeasureStart, bpm, timeSignatureType } = action.payload;

      if (firstMeasureStart == null)
        firstMeasureStart = state.firstMeasureStart;

      if (bpm == null) bpm = state.bpm;

      if (timeSignatureType == null) timeSignatureType = state.timeSignature;

      let timeSignature: TimeSignature = { beatUnit: 4, beatsPerMeasure: 4 };

      switch (timeSignatureType) {
        case TimeSignatureType.FOUR_FOUR:
          timeSignature = { beatUnit: 4, beatsPerMeasure: 4 };
          break;
        case TimeSignatureType.THREE_FOUR:
          timeSignature = { beatUnit: 4, beatsPerMeasure: 3 };
          break;
      }

      let numberOfMeasures =
        (state.audioLength - firstMeasureStart) *
        (bpm / 60) *
        (1 / timeSignature.beatsPerMeasure);

      var lengthOfOneMeasure = (60 * timeSignature.beatsPerMeasure) / bpm;

      var measures = new Array<Measure>(Math.floor(numberOfMeasures));

      var index = 0;

      for (
        let start = firstMeasureStart;
        start < length;
        start += lengthOfOneMeasure
      ) {
        measures[index] = {
          time: start,
          color: "",
          editable: false,
          id: "" + index,
          labelText: "" + index
        };
        index++;
      }

      state.measures = measures;
      state.bpm = bpm;
      state.timeSignature = timeSignatureType;
      state.firstMeasureStart = firstMeasureStart;
      state.secondsPerMeasure = lengthOfOneMeasure;
    },
    updatedSource(
      state,
      action: PayloadAction<{ audioLength: number; audioSampleRate: number }>
    ) {
      state.audioLength = action.payload.audioLength;
      state.audioSampleRate = action.payload.audioSampleRate;
    }
  }
});

export const {
  addedSection,
  removedSection,
  resettedAnalysis,
  updatedRhythm,
  updatedSection,
  updatedSource
} = analysisSlice.actions;

export default analysisSlice.reducer;
