import { Reducer } from "redux";

import {
  AudioActionTypes,
  AudioState,
  LoadingStatus,
  ZOOMLEVELS
} from "./types";

export const initialState: AudioState = {
  zoom: 0,
  status: LoadingStatus.NOT_INITIALIZED,
  isPlaying: false,
  detune: 0,
  playbackRate: 1
};

const reducer: Reducer<AudioState> = (state = initialState, action) => {
  switch (action.type) {
    case AudioActionTypes.INIT_START: {
      return { ...state, status: LoadingStatus.INITIALIZING };
    }
    case AudioActionTypes.INIT_END: {
      return { ...state, status: LoadingStatus.INITIALIZED };
    }
    case AudioActionTypes.ZOOM_OUT: {
      return {
        ...state,
        zoom: state.zoom === ZOOMLEVELS.length - 1 ? state.zoom : state.zoom + 1
      };
    }
    case AudioActionTypes.ZOOM_IN: {
      return {
        ...state,
        zoom: state.zoom === 0 ? state.zoom : state.zoom - 1
      };
    }
    case AudioActionTypes.PLAY: {
      return {
        ...state,
        isPlaying: true
      };
    }
    case AudioActionTypes.PAUSE: {
      return {
        ...state,
        isPlaying: false
      };
    }
    case AudioActionTypes.PLAYBACK_SETTINGS_SET: {
      const { playbackRate, detune } = action.payload.settings;

      const result = {
        ...state
      };

      if (playbackRate) result.playbackRate = playbackRate;
      if (detune) result.detune = detune;

      return result;
    }
    default: {
      return state;
    }
  }
};

export { reducer as audioReducer };
