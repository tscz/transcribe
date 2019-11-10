import { Reducer } from "redux";

import { AnalysisActionTypes, AnalysisState } from "./types";

export const initialState: AnalysisState = {
  segments: []
};

const reducer: Reducer<AnalysisState> = (state = initialState, action) => {
  switch (action.type) {
    case AnalysisActionTypes.SEGMENT_ADD: {
      return {
        ...state,
        segments: [...state.segments, action.payload.segment]
      };
    }
    case AnalysisActionTypes.SEGMENT_REMOVE: {
      return state;
    }
    case AnalysisActionTypes.SEGMENT_UPDATE: {
      return state;
    }
    default: {
      return state;
    }
  }
};

export { reducer as analysisReducer };
