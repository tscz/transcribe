import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AudioState {
  readonly isPlaying: boolean;
  readonly detune: number;
  readonly playbackRate: number;
}

export interface PlaybackSettings {
  readonly detune?: number;
  readonly playbackRate?: number;
}

export const initialAudioState: AudioState = {
  isPlaying: false,
  detune: 0,
  playbackRate: 1
};

const audioSlice = createSlice({
  name: "audio",
  initialState: initialAudioState,
  reducers: {
    triggeredPlay(state) {
      state.isPlaying = true;
    },
    triggeredPause(state) {
      state.isPlaying = false;
    },
    updatedPlaybackSettings(
      state,
      action: PayloadAction<{ playbackRate?: number; detune?: number }>
    ) {
      if (action.payload.detune !== undefined)
        state.detune = action.payload.detune;
      if (action.payload.playbackRate !== undefined)
        state.playbackRate = action.payload.playbackRate;
    }
  }
});

export const {
  triggeredPause,
  triggeredPlay,
  updatedPlaybackSettings
} = audioSlice.actions;

export default audioSlice.reducer;
