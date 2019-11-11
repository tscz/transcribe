import { Reducer } from "redux";

import { AnalysisActionTypes, AnalysisState } from "./types";

export const initialState: AnalysisState = {
  sections: []
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
    default: {
      return state;
    }
  }
};

export { reducer as analysisReducer };
