import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AudioState {
  readonly isPlaying: boolean;
  readonly detune: number;
  readonly playbackRate: number;
  readonly isLooping: boolean;
  readonly loopStart: number;
  readonly loopEnd: number;
}

export interface PlaybackSettings {
  readonly detune?: number;
  readonly playbackRate?: number;
}

export const initialAudioState: AudioState = {
  isPlaying: false,
  detune: 0,
  playbackRate: 1,
  isLooping: false,
  loopStart: 0,
  loopEnd: 0
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
    },
    toggledLoop(state) {
      state.isLooping = !state.isLooping;
    },
    updatedLoopSettings(
      state,
      action: PayloadAction<{ start?: number; end?: number }>
    ) {
      if (action.payload.start !== undefined)
        state.loopStart = action.payload.start;
      if (action.payload.end !== undefined) state.loopEnd = action.payload.end;
    }
  }
});

export const {
  triggeredPause,
  triggeredPlay,
  updatedPlaybackSettings,
  toggledLoop,
  updatedLoopSettings
} = audioSlice.actions;

export default audioSlice.reducer;
