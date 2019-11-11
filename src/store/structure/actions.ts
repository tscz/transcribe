import { StructureActionTypes } from "./types";

/** Zoom in in the Waveform View. */
export const zoomIn = () => ({
  type: StructureActionTypes.ZOOM_IN
});

/** Zoom out in the Waveform View. */
export const zoomOut = () => ({
  type: StructureActionTypes.ZOOM_OUT
});

/** Start initializing the waveform. */
export const startInit = () => ({
  type: StructureActionTypes.INIT_START
});

/** Initializing of waveform finished. */
export const endInit = () => ({
  type: StructureActionTypes.INIT_END
});
