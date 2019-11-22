export interface ProjectState {
  readonly currentPage: Page;
  readonly title: string;
  readonly audioUrl: string;
  readonly syncFirstMeasureStart: boolean;
  readonly loaded: boolean;
}

export enum ProjectActionTypes {
  SWITCH_PAGE = "SWITCH_PAGE",
  CREATE = "PROJECT_CREATE",
  SYNC_FIRST_MEASURE_START = "SYNC_FIRST_MEASURE_START"
}

export enum Page {
  DEFAULT = "default",
  STRUCTURE = "structure",
  HARMONY = "harmony",
  GUITAR = "guitar",
  DRUM = "drum",
  PRINT = "print"
}
