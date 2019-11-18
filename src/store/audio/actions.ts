import { AudioActionTypes } from "./types";

/** Zoom in in the Waveform View. */
export const zoomIn = () => ({
  type: AudioActionTypes.ZOOM_IN
});

/** Zoom out in the Waveform View. */
export const zoomOut = () => ({
  type: AudioActionTypes.ZOOM_OUT
});

/** Start initializing the waveform. */
export const startInit = () => ({
  type: AudioActionTypes.INIT_START
});

/** Start rendering the waveform. */
export const startRender = () => ({
  type: AudioActionTypes.INIT_RENDERING
});

/** Initializing of waveform finished. */
export const endInit = () => ({
  type: AudioActionTypes.INIT_END
});

export const play = () => ({
  type: AudioActionTypes.PLAY
});

export const pause = () => ({
  type: AudioActionTypes.PAUSE
});
