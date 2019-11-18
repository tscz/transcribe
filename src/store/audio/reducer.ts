import { Reducer } from "redux";

import {
  AudioActionTypes,
  AudioState,
  LoadingStatus,
  ZOOMLEVELS
} from "./types";

export const initialState: AudioState = {
  zoom: 0,
  status: LoadingStatus.NOT_INITIALIZED
};

const reducer: Reducer<AudioState> = (state = initialState, action) => {
  switch (action.type) {
    case AudioActionTypes.INIT_START: {
      return { ...state, status: LoadingStatus.INITIALIZING };
    }
    case AudioActionTypes.INIT_END: {
      return { ...state, status: LoadingStatus.INITIALIZED };
    }
    case AudioActionTypes.ZOOM_IN: {
      return {
        ...state,
        zoom: state.zoom === ZOOMLEVELS.length - 1 ? state.zoom : state.zoom + 1
      };
    }
    case AudioActionTypes.ZOOM_OUT: {
      return {
        ...state,
        zoom: state.zoom === 0 ? state.zoom : state.zoom - 1
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as audioReducer };
