// ─── Normalized collection ────────────────────────────────────────────────────

export interface NormalizedObjects<T> {
  byId: Record<string, T>;
  allIds: string[];
}

// ─── Section ──────────────────────────────────────────────────────────────────

export enum SectionType {
  INTRO = "INTRO",
  VERSE = "VERSE",
  PRECHORUS = "PRECHORUS",
  CHORUS = "CHORUS",
  BRIDGE = "BRIDGE",
  SOLO = "SOLO",
  OUTRO = "OUTRO",
  UNDEFINED = "UNDEFINED",
}

export interface Section {
  id: string;
  type: SectionType;
  /** Sorted array of measure IDs belonging to this section */
  measures: string[];
}

export type Sections = NormalizedObjects<Section>;

// ─── Measure ──────────────────────────────────────────────────────────────────

export interface Measure {
  id: string;
  /** Start time in seconds */
  time: number;
  /** Display label (measure number as string) */
  labelText: string;
}

export type Measures = NormalizedObjects<Measure>;

// ─── Time signature ───────────────────────────────────────────────────────────

export enum TimeSignatureType {
  FOUR_FOUR = "FOUR_FOUR",
  THREE_FOUR = "THREE_FOUR",
}

export const TIME_SIGNATURE_BEATS: Record<TimeSignatureType, number> = {
  [TimeSignatureType.FOUR_FOUR]: 4,
  [TimeSignatureType.THREE_FOUR]: 3,
};

export const TIME_SIGNATURE_LABELS: Record<TimeSignatureType, string> = {
  [TimeSignatureType.FOUR_FOUR]: "4/4",
  [TimeSignatureType.THREE_FOUR]: "3/4",
};

// ─── Project load status ──────────────────────────────────────────────────────

export type ProjectStatus = "idle" | "loading" | "ready";

// ─── Dialog types ─────────────────────────────────────────────────────────────

export type DialogType = "none" | "new" | "open" | "save" | "addSection" | "gdrive-open" | "gdrive-save";

// ─── Persisted state (for zip save/load) ─────────────────────────────────────

export interface PersistedState {
  title: string;
  bpm: number;
  timeSignature: TimeSignatureType;
  firstMeasureStart: number;
  duration: number;
  sections: Sections;
  measures: Measures;
}
