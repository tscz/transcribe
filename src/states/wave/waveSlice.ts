import { createSlice } from "@reduxjs/toolkit";

export interface WaveState {
  readonly zoom: number;
}

export const initialWaveState: WaveState = {
  zoom: 0
};

const waveSlice = createSlice({
  name: "wave",
  initialState: initialWaveState,
  reducers: {
    zoomedOut(state) {
      state.zoom =
        state.zoom === 42 //TODO: use max zoomlevel here, which is dynamic
          ? state.zoom
          : state.zoom + 1;
    },
    zoomedIn(state) {
      state.zoom = state.zoom === 0 ? state.zoom : state.zoom - 1;
    }
  }
});

export const { zoomedIn, zoomedOut } = waveSlice.actions;

export default waveSlice.reducer;
