export interface AudioState {
  readonly zoom: number;
  readonly status: LoadingStatus;
  readonly isPlaying: boolean;
}

export enum AudioActionTypes {
  ZOOM_IN = "ZOOM_IN",
  ZOOM_OUT = "ZOOM_OUT",
  INIT_START = "STRUCTURE_INIT_START",
  INIT_RENDERING = "STRUCTURE_INIT_RENDERING",
  INIT_END = "STRUCTURE_INIT_END",
  PLAY = "PLAY",
  PAUSE = "PAUSE"
}

export enum LoadingStatus {
  NOT_INITIALIZED = "not_initialized",
  INITIALIZING = "initializing",
  RENDERING = "rendering",
  INITIALIZED = "initialized"
}

export const ZOOMLEVELS = [128, 256, 512, 1024, 2048, 4096];
