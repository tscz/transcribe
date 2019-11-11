export interface ProjectState {
  readonly currentPage: Page;
  readonly title: string;
  readonly audioUrl: string;
}

export enum ProjectActionTypes {
  SWITCH_PAGE = "SWITCH_PAGE",
  CREATE = "PROJECT_CREATE"
}

export enum Page {
  DEFAULT = "default",
  STRUCTURE = "structure",
  HARMONY = "harmony",
  GUITAR = "guitar",
  DRUM = "drum",
  PRINT = "print"
}
