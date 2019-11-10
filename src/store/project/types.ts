import { PeaksInstance } from "peaks.js";

import { Page } from "../../constants";

export interface ProjectState {
  readonly currentPage: Page;
  readonly peaks: PeaksInstance | null;
}

export enum ProjectActionTypes {
  SWITCH_PAGE = "SWITCH_PAGE",
  PEAKS_INIT = "PEAKS_INIT",
  SEGMENT_ADD = "SEGMENT_ADD",
  SEGMENT_REMOVE = "SEGMENT_REMOVE",
  SEGMENT_UPDATE = "SEGMENT_UPDATE"
}
