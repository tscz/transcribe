import { SegmentAddOptions } from "peaks.js";

/** Global state of a song analysis. */
export interface AnalysisState {
  /** List of all segments of a song. */
  readonly segments: SegmentAddOptions[];
}

/** All action types available for a song analysis. */
export enum AnalysisActionTypes {
  SEGMENT_ADD = "SEGMENT_ADD",
  SEGMENT_REMOVE = "SEGMENT_REMOVE",
  SEGMENT_UPDATE = "SEGMENT_UPDATE",
  RESET = "ANALYSIS_RESET"
}
