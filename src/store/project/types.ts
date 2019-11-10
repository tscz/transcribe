import { PeaksInstance } from "peaks.js";

export interface ProjectState {
  readonly currentPage: Page;
  readonly peaks: PeaksInstance | null;
  readonly title: string;
  readonly audioUrl: string;
}

export enum ProjectActionTypes {
  SWITCH_PAGE = "SWITCH_PAGE",
  PEAKS_INIT = "PEAKS_INIT",
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
