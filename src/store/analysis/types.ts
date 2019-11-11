import { SegmentAddOptions } from "peaks.js";

/** Global state of a song analysis. */
export interface AnalysisState {
  /** List of all sections of a song. */
  readonly sections: Section[];
}

export interface Section extends SegmentAddOptions {
  type: SectionType;
}

export enum SectionType {
  INTRO = "INTRO",
  VERSE = "VERSE",
  PRECHORUS = "PRECHORUS",
  CHORUS = "CHORUS",
  BRIDGE = "BRIDGE",
  SOLO = "SOLO",
  OUTRO = "OUTRO"
}

/** All action types available for a song analysis. */
export enum AnalysisActionTypes {
  SECTION_ADD = "SECTION_ADD",
  SECTION_REMOVE = "SECTION_REMOVE",
  SECTION_UPDATE = "SECTION_UPDATE",
  RESET = "ANALYSIS_RESET"
}
