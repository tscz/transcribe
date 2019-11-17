import { PointAddOptions, SegmentAddOptions } from "peaks.js";

/** Global state of a song analysis. */
export interface AnalysisState {
  /** List of all sections of a song. */
  readonly sections: Section[];

  readonly length: number;
  readonly firstMeasureStart: number;
  readonly timeSignature: TimeSignatureType;
  readonly bpm: number;
  readonly measures: Measure[];
}

export interface Section extends SegmentAddOptions {
  type: SectionType;
}

export interface Measure extends PointAddOptions {}

export interface TimeSignature {
  beatsPerMeasure: number;
  beatUnit: number;
}

export enum TimeSignatureType {
  FOUR_FOUR = "FOUR_FOUR",
  THREE_FOUR = "THREE_FOUR"
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
  RESET = "ANALYSIS_RESET",
  RYTHM_UPDATE = "RYTHM_UPDATE",
  LENGTH_SET = "LENGTH_SET"
}
