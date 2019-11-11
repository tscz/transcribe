import { Reducer } from "redux";

import {
  LoadingStatus,
  StructureActionTypes,
  StructureState,
  ZOOMLEVELS
} from "./types";

export const initialState: StructureState = {
  zoom: 0,
  status: LoadingStatus.NOT_INITIALIZED
};

const reducer: Reducer<StructureState> = (state = initialState, action) => {
  switch (action.type) {
    case StructureActionTypes.INIT_START: {
      return { ...state, status: LoadingStatus.INITIALIZING };
    }
    case StructureActionTypes.INIT_END: {
      return { ...state, status: LoadingStatus.INITIALIZED };
    }
    case StructureActionTypes.ZOOM_IN: {
      return {
        ...state,
        zoom: state.zoom === ZOOMLEVELS.length - 1 ? state.zoom : state.zoom + 1
      };
    }
    case StructureActionTypes.ZOOM_OUT: {
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

export { reducer as structureReducer };
