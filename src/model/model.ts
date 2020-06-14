/** A section if a song counted in measures. */
export interface Section {
  type: SectionType;
  measures: string[];
}
/** Set of all sections of a song. */
export type Sections = NormalizedObjects<Section>;

/** A measure within a song. */
export interface Measure {
  time: number;
  editable?: boolean;
  color?: string;
  labelText?: string;
  id: string;
}

/** Set of measures. */
export type Measures = NormalizedObjects<Measure>;

/** Time signature within a song. */
export interface TimeSignature {
  beatsPerMeasure: number;
  beatUnit: number;
}

/** Enum of available time Signature types. */
export enum TimeSignatureType {
  FOUR_FOUR = "FOUR_FOUR",
  THREE_FOUR = "THREE_FOUR"
}

/** Available Section types. */
export enum SectionType {
  INTRO = "INTRO",
  VERSE = "VERSE",
  PRECHORUS = "PRECHORUS",
  CHORUS = "CHORUS",
  BRIDGE = "BRIDGE",
  SOLO = "SOLO",
  OUTRO = "OUTRO",
  UNDEFINED = "UNDEFINED"
}
/**
 * Normalized Datastructure for collection of objects.
 * @see https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape.
 */
interface NormalizedObjects<T> {
  byId: { [id: string]: T };
  allIds: string[];
}
