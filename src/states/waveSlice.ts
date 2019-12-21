import { Action, createSlice } from "@reduxjs/toolkit";

export interface WaveState {
  readonly zoom: number;
  readonly isLoaded: boolean;
}

export const initialWaveState: WaveState = {
  zoom: 0,
  isLoaded: false
};

const waveSlice = createSlice({
  name: "wave",
  initialState: initialWaveState,
  reducers: {
    zoomedOut(state, action: Action) {
      state.zoom =
        state.zoom === 42 //TODO: use max zoomlevel here, which is dynamic
          ? state.zoom
          : state.zoom + 1;
    },
    zoomedIn(state, action: Action) {
      state.zoom = state.zoom === 0 ? state.zoom : state.zoom - 1;
    },
    initializedWaveform(state, action: Action) {
      state.isLoaded = true;
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

export const { zoomedIn, zoomedOut, initializedWaveform } = waveSlice.actions;

export default waveSlice.reducer;
