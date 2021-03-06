import ArrayUtil from "util/ArrayUtil";

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

export function mergeSections(
  enclosingSection: Section,
  embeddedSection: Section
): Section[] {
  const newSections: Section[] = [];
  const { start: newSectionStart, end: newSectionEnd } = ArrayUtil.bordersOf(
    embeddedSection.measures
  );
  const { start: currentSectionStart, end: currentSectionEnd } =
    ArrayUtil.bordersOf(enclosingSection.measures);
  //Add a new undefined block before the new section
  if (newSectionStart > currentSectionStart) {
    const section: Section = {
      measures: ArrayUtil.range(currentSectionStart, newSectionStart - 1),
      type: SectionType.UNDEFINED
    };
    newSections.push(section);
  }
  //add new section
  newSections.push(embeddedSection);
  //Add a new undefined block after the new section
  if (newSectionEnd < currentSectionEnd) {
    const section: Section = {
      measures: ArrayUtil.range(newSectionEnd + 1, currentSectionEnd),
      type: SectionType.UNDEFINED
    };
    newSections.push(section);
  }
  return newSections;
}

export function toTimeSignature(type: TimeSignatureType): TimeSignature {
  switch (type) {
    case TimeSignatureType.FOUR_FOUR:
      return { beatUnit: 4, beatsPerMeasure: 4 };
    case TimeSignatureType.THREE_FOUR:
      return { beatUnit: 4, beatsPerMeasure: 3 };
  }
}

export function toTimeSignatureType(type: string): TimeSignatureType {
  switch (type) {
    case TimeSignatureType.FOUR_FOUR.toString():
      return TimeSignatureType.FOUR_FOUR;
    case TimeSignatureType.THREE_FOUR.toString():
      return TimeSignatureType.THREE_FOUR;
    default:
      throw Error("Unknown time signature type: " + type);
  }
}

export function undefinedSection(length: number): Sections {
  const undefinedSectionId = "UNDEFINED_0_" + length;
  const sections: Sections = {
    allIds: [undefinedSectionId],
    byId: {}
  };

  sections.byId[undefinedSectionId] = {
    measures: ArrayUtil.range(0, length),
    type: SectionType.UNDEFINED
  };

  return sections;
}

export function sectionInvalid(section: Section): boolean {
  return (
    parseInt(section.measures[0]) >
    parseInt(section.measures[section.measures.length - 1])
  );
}

export function enclosingSectionOf(
  section: Section,
  allSections: Sections
): { position: number; section: Section } | undefined {
  const { start: newSectionStart, end: newSectionEnd } = ArrayUtil.bordersOf(
    section.measures
  );

  const sectionCount = allSections.allIds.length;

  for (let current = 0; current <= sectionCount - 1; current++) {
    const section = allSections.byId[allSections.allIds[current]];
    const { end: currentSectionEnd } = ArrayUtil.bordersOf(section.measures);

    //Go to next section if not included
    if (newSectionStart >= currentSectionEnd) continue;

    //Exit if new section overlaps current section's border
    if (newSectionEnd > currentSectionEnd) return undefined;

    return { position: current, section: section };
  }
}

export function replaceSections(
  sections: Sections,
  start: number,
  deleteCount: number,
  newSections: Section[]
): void {
  for (let section = start; section < deleteCount; section++) {
    delete sections.byId[sections.allIds[section]];
  }

  const ids: string[] = [];

  newSections.forEach((section) => {
    const id = generateSectionId(section);
    ids.push(id);
    sections.byId[id] = section;
  });

  sections.allIds.splice(start, deleteCount, ...ids);
}

export function generateSectionId(section: Section): string {
  return (
    section.type +
    "_" +
    section.measures[0] +
    "_" +
    section.measures[section.measures.length - 1]
  );
}

export function getMeasureEnd(position: number, measures: Measures): number {
  if (measures.allIds.length - 1 > position)
    return measures.byId[position + 1].time;
  else {
    return 2 * measures.byId[position].time - measures.byId[position - 1].time;
  }
}

export function distributeMeasures(
  timeSignatureType: TimeSignatureType,
  bpm: number,
  firstMeasureStart: number,
  length: number
): Measures {
  const timeSignature = toTimeSignature(timeSignatureType);
  const lengthOfOneMeasure = (60 * timeSignature.beatsPerMeasure) / bpm;
  const measures: Measures = { allIds: [], byId: {} };

  let index = 0;
  for (
    let start = firstMeasureStart;
    start < length;
    start += lengthOfOneMeasure
  ) {
    measures.allIds.push("" + index);
    measures.byId[index] = {
      time: start,
      color: "",
      editable: false,
      id: "" + index,
      labelText: "" + index
    };
    index++;
  }

  return measures;
}
