import { Reducer } from "redux";

import { AudioActionTypes, AudioState, LoadingStatus } from "./types";

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
        zoom:
          state.zoom === 42 //TODO: use max zoomlevel here, which is dynamic
            ? state.zoom
            : state.zoom + 1
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

export function computeZoomLevels(
  secondsPerMeasure: number,
  audioSampleRate: number,
  zoomviewWidth: number,
  measuresCount: number
) {
  const baseZoom = Math.floor(
    (secondsPerMeasure * audioSampleRate) / zoomviewWidth
  );

  let levels = new Array<number>(measuresCount);

  for (let index = 0; index < levels.length; index++) {
    levels[index] = baseZoom * (index + 1);
  }

  return levels;
}

export { reducer as audioReducer };
