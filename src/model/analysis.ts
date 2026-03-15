import {
  Measures,
  Section,
  SectionType,
  Sections,
  TIME_SIGNATURE_BEATS,
  TimeSignatureType,
} from "./types";

// ─── Measure distribution ─────────────────────────────────────────────────────

export function distributeMeasures(
  bpm: number,
  timeSignature: TimeSignatureType,
  duration: number,
  firstMeasureStart: number
): Measures {
  const beats = TIME_SIGNATURE_BEATS[timeSignature];
  const measureLength = (60 * beats) / bpm;

  const byId: Record<string, { id: string; time: number; labelText: string }> =
    {};
  const allIds: string[] = [];

  let index = 0;
  let time = firstMeasureStart;

  while (time < duration) {
    const id = String(index);
    byId[id] = { id, time, labelText: String(index) };
    allIds.push(id);
    time += measureLength;
    index++;
  }

  return { byId, allIds };
}

// ─── Section helpers ──────────────────────────────────────────────────────────

export function generateSectionId(type: SectionType, measures: string[]): string {
  return `${type}_${measures[0] ?? "0"}_${measures[measures.length - 1] ?? "0"}`;
}

export function undefinedSection(measures: string[]): Section {
  return {
    id: generateSectionId(SectionType.UNDEFINED, measures),
    type: SectionType.UNDEFINED,
    measures,
  };
}

/**
 * Given a new named section occupying [firstMeasure..lastMeasure] from within
 * a parent UNDEFINED section, split the parent into up to three pieces:
 *   [undefined before] + [new section] + [undefined after]
 */
export function mergeSections(
  parent: Section,
  newSection: Section
): Section[] {
  const result: Section[] = [];

  const newFirst = parseInt(newSection.measures[0] ?? "0");
  const newLast = parseInt(
    newSection.measures[newSection.measures.length - 1] ?? "0"
  );
  const parentFirst = parseInt(parent.measures[0] ?? "0");
  const parentLast = parseInt(
    parent.measures[parent.measures.length - 1] ?? "0"
  );

  const before = parent.measures.filter((m) => parseInt(m) < newFirst);
  const after = parent.measures.filter((m) => parseInt(m) > newLast);

  if (before.length > 0) result.push(undefinedSection(before));
  result.push(newSection);
  if (after.length > 0) result.push(undefinedSection(after));

  // Suppress unused-variable warning — used implicitly via parent.measures filter
  void parentFirst;
  void parentLast;

  return result;
}

/**
 * Find the UNDEFINED section that fully contains the given measure range.
 */
export function enclosingSectionOf(
  sections: Sections,
  firstMeasure: string,
  lastMeasure: string
): Section | undefined {
  const first = parseInt(firstMeasure);
  const last = parseInt(lastMeasure);

  return sections.allIds
    .map((id) => sections.byId[id])
    .find(
      (s) =>
        s.type === SectionType.UNDEFINED &&
        s.measures.length > 0 &&
        parseInt(s.measures[0]) <= first &&
        parseInt(s.measures[s.measures.length - 1]) >= last
    );
}

/**
 * Replace `oldSections` with `newSections` in the normalized store,
 * preserving order of remaining sections.
 */
export function replaceSections(
  sections: Sections,
  oldSections: Section[],
  newSections: Section[]
): Sections {
  const oldIds = new Set(oldSections.map((s) => s.id));

  const remaining = sections.allIds
    .map((id) => sections.byId[id])
    .filter((s) => !oldIds.has(s.id));

  // Insert new sections where the first old section was
  const insertIndex = sections.allIds.findIndex((id) => oldIds.has(id));

  const all = [
    ...remaining.slice(0, insertIndex),
    ...newSections,
    ...remaining.slice(insertIndex),
  ];

  const byId: Record<string, Section> = {};
  const allIds: string[] = [];
  for (const s of all) {
    byId[s.id] = s;
    allIds.push(s.id);
  }

  return { byId, allIds };
}

/** Rebuild sections after measure redistribution, pruning measures that
 *  no longer exist and merging adjacent UNDEFINED sections */
export function rebuildSectionsForMeasures(
  sections: Sections,
  newMeasures: Measures
): Sections {
  const measureSet = new Set(newMeasures.allIds);
  const measuresSorted = newMeasures.allIds.map(Number).sort((a, b) => a - b);

  if (measuresSorted.length === 0) {
    return { byId: {}, allIds: [] };
  }

  // Remap each existing section to only its still-valid measures
  const remapped = sections.allIds
    .map((id) => sections.byId[id])
    .map((s) => ({
      ...s,
      measures: s.measures.filter((m) => measureSet.has(m)),
    }))
    .filter((s) => s.measures.length > 0);

  // Collect all measures already assigned
  const assigned = new Set(remapped.flatMap((s) => s.measures));

  // Unassigned measures become a trailing UNDEFINED section
  const unassigned = measuresSorted
    .map(String)
    .filter((m) => !assigned.has(m));

  const all: Section[] = [...remapped];

  if (unassigned.length > 0) {
    all.push(undefinedSection(unassigned));
  }

  // Merge adjacent UNDEFINED sections
  const merged: Section[] = [];
  for (const s of all) {
    const prev = merged[merged.length - 1];
    if (prev && prev.type === SectionType.UNDEFINED && s.type === SectionType.UNDEFINED) {
      const combined = [...prev.measures, ...s.measures];
      merged[merged.length - 1] = undefinedSection(combined);
    } else {
      merged.push(s);
    }
  }

  const byId: Record<string, Section> = {};
  const allIds: string[] = [];
  for (const s of merged) {
    byId[s.id] = s;
    allIds.push(s.id);
  }

  return { byId, allIds };
}

/**
 * Dissolve a named section back into UNDEFINED and merge adjacent UNDEFINED
 * sections. Returns sections unchanged if the target is already UNDEFINED.
 */
export function dissolveSection(sections: Sections, sectionId: string): Sections {
  const target = sections.byId[sectionId];
  if (!target || target.type === SectionType.UNDEFINED) return sections;

  const dissolved = undefinedSection(target.measures);
  const next = replaceSections(sections, [target], [dissolved]);

  const merged: Section[] = [];
  for (const id of next.allIds) {
    const s = next.byId[id];
    const prev = merged[merged.length - 1];
    if (prev?.type === SectionType.UNDEFINED && s.type === SectionType.UNDEFINED) {
      merged[merged.length - 1] = undefinedSection([...prev.measures, ...s.measures]);
    } else {
      merged.push(s);
    }
  }

  const byId: Record<string, Section> = {};
  const allIds: string[] = [];
  for (const s of merged) {
    byId[s.id] = s;
    allIds.push(s.id);
  }
  return { byId, allIds };
}

/** Returns [start, end] measure indices (as numbers) for a section */
export function sectionBorders(section: Section): {
  first: number;
  last: number;
} {
  const nums = section.measures.map(Number);
  return { first: Math.min(...nums), last: Math.max(...nums) };
}

/** Get the end time of a measure (start of the next, or song duration) */
export function getMeasureEnd(
  measure: string,
  measures: Measures,
  duration: number
): number {
  const idx = measures.allIds.indexOf(measure);
  if (idx < 0) return duration;
  const next = measures.allIds[idx + 1];
  return next ? measures.byId[next].time : duration;
}
