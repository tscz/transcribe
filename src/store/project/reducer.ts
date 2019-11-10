import { Reducer } from "redux";

import { Page, ProjectActionTypes, ProjectState } from "./types";

export const initialState: ProjectState = {
  currentPage: Page.DEFAULT,
  peaks: null
};

const reducer: Reducer<ProjectState> = (state = initialState, action) => {
  switch (action.type) {
    case ProjectActionTypes.SWITCH_PAGE: {
      return { ...state, currentPage: action.payload.page };
    }
    case ProjectActionTypes.PEAKS_INIT: {
      return { ...state, peaks: action.payload.peaksInstance };
    }

    default: {
      return state;
    }
  }
};

export { reducer as projectReducer };
