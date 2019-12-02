import { Reducer } from "redux";

import {
  AnalysisActionTypes,
  AnalysisState,
  Measure,
  TimeSignature,
  TimeSignatureType
} from "./types";

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

const reducer: Reducer<AnalysisState> = (state = initialState, action) => {
  switch (action.type) {
    case AnalysisActionTypes.SECTION_ADD: {
      return {
        ...state,
        sections: [...state.sections, action.payload.section]
      };
    }
    case AnalysisActionTypes.SECTION_REMOVE: {
      return state;
    }
    case AnalysisActionTypes.SECTION_UPDATE: {
      return state;
    }
    case AnalysisActionTypes.RESET: {
      return initialState;
    }
    case AnalysisActionTypes.RHYTHM_UPDATE:
      {
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
      }
      return {
        ...state,
        measures: measures,
        bpm: bpm,
        timeSignature: timeSignatureType,
        firstMeasureStart: firstMeasureStart,
        secondsPerMeasure: lengthOfOneMeasure
      };
    case AnalysisActionTypes.SOURCE_UPDATE: {
      return {
        ...state,
        audioLength: action.payload.audioLength,
        audioSampleRate: action.payload.audioSampleRate
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as analysisReducer };
