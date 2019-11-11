export interface StructureState {
  readonly zoom: number;
  readonly status: LoadingStatus;
}

export enum StructureActionTypes {
  ZOOM_IN = "ZOOM_IN",
  ZOOM_OUT = "ZOOM_OUT",
  INIT_START = "STRUCTURE_INIT_START",
  INIT_END = "STRUCTURE_INIT_END"
}

export enum LoadingStatus {
  NOT_INITIALIZED = "not_initialized",
  INITIALIZING = "initializing",
  INITIALIZED = "initialized"
}

export const ZOOMLEVELS = [128, 256, 512, 1024, 2048, 4096];
