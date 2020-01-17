import ArrayUtil from "../../util/ArrayUtil";
import { NormalizedObjects } from "../store";
import {
  Measure,
  Section,
  SectionType,
  TimeSignatureType
} from "./analysisSlice";

export const toTimeSignature = (type: TimeSignatureType) => {
  switch (type) {
    case TimeSignatureType.FOUR_FOUR:
      return { beatUnit: 4, beatsPerMeasure: 4 };
    case TimeSignatureType.THREE_FOUR:
      return { beatUnit: 4, beatsPerMeasure: 3 };
  }
};

export const undefinedSection = (length: number) => {
  let undefinedSectionId = "UNDEFINED_0_" + length;
  let sections: NormalizedObjects<Section>;

  sections = {
    allIds: [undefinedSectionId],
    byId: {}
  };

  sections.byId[undefinedSectionId] = {
    measures: ArrayUtil.range(0, length),
    type: SectionType.UNDEFINED
  };

  return sections;
};

export const sectionInvalid = (section: Section) => {
  return (
    parseInt(section.measures[0]) >=
    parseInt(section.measures[section.measures.length - 1])
  );
};

export const enclosingSectionOf = (
  section: Section,
  allSections: NormalizedObjects<Section>
) => {
  const { start: newSectionStart, end: newSectionEnd } = ArrayUtil.bordersOf(
    section.measures
  );

  const sectionCount = allSections.allIds.length;

  for (let current = 0; current <= sectionCount - 1; current++) {
    let section = allSections.byId[allSections.allIds[current]];
    let { end: currentSectionEnd } = ArrayUtil.bordersOf(section.measures);

    //Go to next section if not included
    if (newSectionStart >= currentSectionEnd) continue;

    //Exit if new section overlaps current section's border
    if (newSectionEnd > currentSectionEnd) return undefined;

    return { position: current, section: section };
  }
};

export const mergeSections: (
  enclosingSection: Section,
  embeddedSection: Section
) => Section[] = (enclosingSection, embeddedSection) => {
  let newSections: Section[] = [];

  const { start: newSectionStart, end: newSectionEnd } = ArrayUtil.bordersOf(
    embeddedSection.measures
  );

  const {
    start: currentSectionStart,
    end: currentSectionEnd
  } = ArrayUtil.bordersOf(enclosingSection.measures);

  //Add a new undefined block before the new section
  if (newSectionStart > currentSectionStart) {
    let section: Section = {
      measures: ArrayUtil.range(currentSectionStart, newSectionStart),
      type: SectionType.UNDEFINED
    };
    newSections.push(section);
  }

  //add new section
  newSections.push(embeddedSection);

  //Add a new undefined block after the new section
  if (newSectionEnd < currentSectionEnd) {
    let section: Section = {
      measures: ArrayUtil.range(newSectionEnd, currentSectionEnd),
      type: SectionType.UNDEFINED
    };
    newSections.push(section);
  }

  return newSections;
};

export const replaceSections = (
  sections: NormalizedObjects<Section>,
  start: number,
  deleteCount: number,
  newSections: Section[]
) => {
  for (let section = start; section < deleteCount; section++) {
    delete sections.byId[sections.allIds[section]];
  }

  let ids: string[] = [];

  newSections.forEach(section => {
    const id = generateSectionId(section);
    ids.push(id);
    sections.byId[id] = section;
  });

  sections.allIds.splice(start, deleteCount, ...ids);
};

export const generateSectionId = (section: Section) =>
  section.type +
  "_" +
  section.measures[0] +
  "_" +
  section.measures[section.measures.length - 1];

export const distributeMeasures = (
  timeSignatureType: TimeSignatureType,
  bpm: number,
  firstMeasureStart: number,
  length: number
) => {
  const timeSignature = toTimeSignature(timeSignatureType);
  const lengthOfOneMeasure = (60 * timeSignature.beatsPerMeasure) / bpm;
  const measures: NormalizedObjects<Measure> = { allIds: [], byId: {} };

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
};
