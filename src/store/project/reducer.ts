import { Reducer } from "redux";

import { Page, ProjectActionTypes, ProjectState } from "./types";

export const initialState: ProjectState = {
  currentPage: Page.DEFAULT,
  title: "",
  audioUrl: "",
  syncFirstMeasureStart: false,
  loaded: false
};

const reducer: Reducer<ProjectState> = (state = initialState, action) => {
  switch (action.type) {
    case ProjectActionTypes.SWITCH_PAGE: {
      return { ...state, currentPage: action.payload.page };
    }
    case ProjectActionTypes.CREATE: {
      return {
        ...state,
        title: action.payload.title,
        audioUrl: action.payload.audioUrl,
        loaded: true
      };
    }
    case ProjectActionTypes.SYNC_FIRST_MEASURE_START: {
      return {
        ...state,
        syncFirstMeasureStart: action.payload.syncFirstMeasureStart
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as projectReducer };
