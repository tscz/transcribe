import { Reducer } from "redux";

import { Page, ProjectActionTypes, ProjectState } from "./types";

export const initialState: ProjectState = {
  currentPage: Page.DEFAULT,
  peaks: null,
  title: "",
  audioUrl: ""
};

const reducer: Reducer<ProjectState> = (state = initialState, action) => {
  switch (action.type) {
    case ProjectActionTypes.SWITCH_PAGE: {
      return { ...state, currentPage: action.payload.page };
    }
    case ProjectActionTypes.PEAKS_INIT: {
      return { ...state, peaks: action.payload.peaksInstance };
    }
    case ProjectActionTypes.CREATE: {
      return {
        ...state,
        title: action.payload.title,
        audioUrl: action.payload.audioUrl
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as projectReducer };
