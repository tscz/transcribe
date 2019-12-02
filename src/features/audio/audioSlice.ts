import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AudioState {
  readonly zoom: number;
  readonly status: LoadingStatus;
  readonly isPlaying: boolean;
  readonly detune: number;
  readonly playbackRate: number;
}

export interface PlaybackSettings {
  readonly detune?: number;
  readonly playbackRate?: number;
}
export enum LoadingStatus {
  NOT_INITIALIZED = "not_initialized",
  INITIALIZING = "initializing",
  RENDERING = "rendering",
  INITIALIZED = "initialized"
}
export const initialState: AudioState = {
  zoom: 0,
  status: LoadingStatus.NOT_INITIALIZED,
  isPlaying: false,
  detune: 0,
  playbackRate: 1
};

const audioSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    startedInit(state, action: Action) {
      state.status = LoadingStatus.INITIALIZING;
    },
    endedInit(state, action: Action) {
      state.status = LoadingStatus.INITIALIZED;
    },
    zoomedOut(state, action: Action) {
      state.zoom =
        state.zoom === 42 //TODO: use max zoomlevel here, which is dynamic
          ? state.zoom
          : state.zoom + 1;
    },
    zoomedIn(state, action: Action) {
      state.zoom = state.zoom === 0 ? state.zoom : state.zoom - 1;
    },
    triggeredPlay(state, action: Action) {
      state.isPlaying = true;
    },
    triggeredPause(state, action: Action) {
      state.isPlaying = false;
    },
    updatedPlaybackSettings(
      state,
      action: PayloadAction<{ playbackRate?: number; detune?: number }>
    ) {
      if (action.payload.detune) state.detune = action.payload.detune;
      if (action.payload.playbackRate)
        state.playbackRate = action.payload.playbackRate;
    }
  }
});

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

export const {
  startedInit,
  endedInit,
  triggeredPause,
  triggeredPlay,
  updatedPlaybackSettings,
  zoomedIn,
  zoomedOut
} = audioSlice.actions;

export default audioSlice.reducer;
