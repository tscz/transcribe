import { Reducer } from "redux";

import { AnalysisActionTypes, AnalysisState, Measure } from "./types";

export const initialState: AnalysisState = {
  sections: [],
  bpm: 120,
  firstMeasureStart: 0,
  length: 180,
  measures: [],
  timeSignature: { beatUnit: 4, beatsPerMeasure: 4 }
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
    case AnalysisActionTypes.RYTHM_UPDATE:
      {
        let length = state.length;
        let { firstMeasureStart, bpm, timeSignature } = action.payload;

        let numberOfMeasures =
          (state.length - firstMeasureStart) *
          (bpm / 60) *
          (1 / timeSignature.beatsPerMeasure);

        let lengthOfOneMeasure = (60 * timeSignature.beatsPerMeasure) / bpm;

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
        bpm: action.payload.bpm,
        timeSignature: action.payload.timeSignature,
        firstMeasureStart: action.payload.firstTimeMeasureStart
      };
    case AnalysisActionTypes.LENGTH_SET: {
      return {
        ...state,
        length: action.payload.length
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as analysisReducer };
