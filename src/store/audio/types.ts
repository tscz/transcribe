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

export enum AudioActionTypes {
  ZOOM_IN = "ZOOM_IN",
  ZOOM_OUT = "ZOOM_OUT",
  INIT_START = "STRUCTURE_INIT_START",
  INIT_RENDERING = "STRUCTURE_INIT_RENDERING",
  INIT_END = "STRUCTURE_INIT_END",
  PLAY = "PLAY",
  PAUSE = "PAUSE",
  PLAYBACK_SETTINGS_SET = "PLAYBACK_SETTINGS_SET"
}

export enum LoadingStatus {
  NOT_INITIALIZED = "not_initialized",
  INITIALIZING = "initializing",
  RENDERING = "rendering",
  INITIALIZED = "initialized"
}

//TODO: Update Zoomlevels dynamically during runtime
const secondsPerMeasure = 1;
const audioSampleRate = 48000; // audioBuffer.sampleRate
const zoomviewWidth = 1465; // document.getElementById(ZOOMVIEW_CONTAINER)!.clientWidth

const baseZoom = Math.floor(
  (secondsPerMeasure * audioSampleRate) / zoomviewWidth
);

export const ZOOMLEVELS = [
  baseZoom,
  baseZoom * 2,
  baseZoom * 3,
  baseZoom * 4,
  baseZoom * 5
];
