import { describe, it, expect } from "vitest";

import {
  distributeMeasures,
  enclosingSectionOf,
  generateSectionId,
  getMeasureEnd,
  mergeSections,
  rebuildSectionsForMeasures,
  replaceSections,
  sectionBorders,
  undefinedSection,
} from "./analysis";
import { SectionType, Sections, TimeSignatureType } from "./types";

// ─── distributeMeasures ───────────────────────────────────────────────────────

describe("distributeMeasures", () => {
  it("generates correct measure times for 4/4 at 120 BPM", () => {
    // 120 BPM, 4/4 → 2 s per measure
    const m = distributeMeasures(120, TimeSignatureType.FOUR_FOUR, 10, 0);
    expect(m.allIds).toEqual(["0", "1", "2", "3", "4"]);
    expect(m.byId["0"].time).toBeCloseTo(0);
    expect(m.byId["1"].time).toBeCloseTo(2);
    expect(m.byId["4"].time).toBeCloseTo(8);
  });

  it("generates correct measure times for 3/4 at 120 BPM", () => {
    // 120 BPM, 3/4 → 1.5 s per measure
    const m = distributeMeasures(120, TimeSignatureType.THREE_FOUR, 10, 0);
    expect(m.allIds).toHaveLength(7); // 0, 1.5, 3, 4.5, 6, 7.5, 9
    expect(m.byId["1"].time).toBeCloseTo(1.5);
    expect(m.byId["6"].time).toBeCloseTo(9);
  });

  it("respects firstMeasureStart offset", () => {
    const m = distributeMeasures(120, TimeSignatureType.FOUR_FOUR, 10, 1);
    expect(m.byId["0"].time).toBeCloseTo(1);
    expect(m.byId["1"].time).toBeCloseTo(3);
    // Measure at t=9 is still within duration 10
    expect(m.allIds).toHaveLength(5);
  });

  it("returns empty measures when firstMeasureStart >= duration", () => {
    const m = distributeMeasures(120, TimeSignatureType.FOUR_FOUR, 10, 10);
    expect(m.allIds).toHaveLength(0);
  });

  it("returns empty measures for zero duration", () => {
    const m = distributeMeasures(120, TimeSignatureType.FOUR_FOUR, 0, 0);
    expect(m.allIds).toHaveLength(0);
  });

  it("assigns matching id and labelText on each measure", () => {
    const m = distributeMeasures(120, TimeSignatureType.FOUR_FOUR, 6, 0);
    for (const id of m.allIds) {
      expect(m.byId[id].id).toBe(id);
      expect(m.byId[id].labelText).toBe(id);
    }
  });
});

// ─── generateSectionId ────────────────────────────────────────────────────────

describe("generateSectionId", () => {
  it("formats id as TYPE_first_last", () => {
    expect(generateSectionId(SectionType.INTRO, ["0", "1", "2", "3"])).toBe("INTRO_0_3");
    expect(generateSectionId(SectionType.CHORUS, ["4", "5"])).toBe("CHORUS_4_5");
  });

  it("handles a single-measure section", () => {
    expect(generateSectionId(SectionType.VERSE, ["7"])).toBe("VERSE_7_7");
  });

  it("falls back to '0' for empty measure array", () => {
    expect(generateSectionId(SectionType.UNDEFINED, [])).toBe("UNDEFINED_0_0");
  });
});

// ─── undefinedSection ─────────────────────────────────────────────────────────

describe("undefinedSection", () => {
  it("creates a section with UNDEFINED type", () => {
    const s = undefinedSection(["0", "1", "2"]);
    expect(s.type).toBe(SectionType.UNDEFINED);
    expect(s.measures).toEqual(["0", "1", "2"]);
    expect(s.id).toBe("UNDEFINED_0_2");
  });
});

// ─── mergeSections ────────────────────────────────────────────────────────────

describe("mergeSections", () => {
  const parent = undefinedSection(["0", "1", "2", "3", "4", "5"]);

  it("splits into [before, new, after] when new section is in the middle", () => {
    const newSec = {
      id: "CHORUS_2_3",
      type: SectionType.CHORUS,
      measures: ["2", "3"],
    };
    const result = mergeSections(parent, newSec);
    expect(result).toHaveLength(3);
    expect(result[0].type).toBe(SectionType.UNDEFINED);
    expect(result[0].measures).toEqual(["0", "1"]);
    expect(result[1]).toBe(newSec);
    expect(result[2].type).toBe(SectionType.UNDEFINED);
    expect(result[2].measures).toEqual(["4", "5"]);
  });

  it("produces [new, after] when new section starts at the beginning", () => {
    const newSec = { id: "INTRO_0_1", type: SectionType.INTRO, measures: ["0", "1"] };
    const result = mergeSections(parent, newSec);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(newSec);
    expect(result[1].measures).toEqual(["2", "3", "4", "5"]);
  });

  it("produces [before, new] when new section ends at the end", () => {
    const newSec = { id: "OUTRO_4_5", type: SectionType.OUTRO, measures: ["4", "5"] };
    const result = mergeSections(parent, newSec);
    expect(result).toHaveLength(2);
    expect(result[0].measures).toEqual(["0", "1", "2", "3"]);
    expect(result[1]).toBe(newSec);
  });

  it("produces [new] when new section spans entire parent", () => {
    const newSec = { id: "VERSE_0_5", type: SectionType.VERSE, measures: ["0", "1", "2", "3", "4", "5"] };
    const result = mergeSections(parent, newSec);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(newSec);
  });
});

// ─── enclosingSectionOf ───────────────────────────────────────────────────────

describe("enclosingSectionOf", () => {
  const undef = undefinedSection(["0", "1", "2", "3", "4"]);
  const named = { id: "INTRO_5_7", type: SectionType.INTRO, measures: ["5", "6", "7"] };
  const sections: Sections = {
    byId: { [undef.id]: undef, [named.id]: named },
    allIds: [undef.id, named.id],
  };

  it("finds the UNDEFINED section containing the range", () => {
    expect(enclosingSectionOf(sections, "1", "3")).toBe(undef);
  });

  it("returns undefined when range falls inside a named section", () => {
    expect(enclosingSectionOf(sections, "5", "6")).toBeUndefined();
  });

  it("returns undefined when range spans across sections", () => {
    expect(enclosingSectionOf(sections, "3", "6")).toBeUndefined();
  });
});

// ─── replaceSections ─────────────────────────────────────────────────────────

describe("replaceSections", () => {
  const a = undefinedSection(["0", "1"]);
  const b = { id: "INTRO_2_3", type: SectionType.INTRO, measures: ["2", "3"] };
  const c = undefinedSection(["4", "5"]);
  const sections: Sections = {
    byId: { [a.id]: a, [b.id]: b, [c.id]: c },
    allIds: [a.id, b.id, c.id],
  };

  it("replaces a single section with multiple new ones", () => {
    const x = undefinedSection(["2"]);
    const y = { id: "VERSE_3_3", type: SectionType.VERSE, measures: ["3"] };
    const result = replaceSections(sections, [b], [x, y]);
    expect(result.allIds).toHaveLength(4);
    expect(result.allIds[1]).toBe(x.id);
    expect(result.allIds[2]).toBe(y.id);
  });

  it("preserves order of untouched sections", () => {
    const replacement = { id: "CHORUS_2_3", type: SectionType.CHORUS, measures: ["2", "3"] };
    const result = replaceSections(sections, [b], [replacement]);
    expect(result.allIds).toEqual([a.id, replacement.id, c.id]);
  });
});

// ─── rebuildSectionsForMeasures ───────────────────────────────────────────────

describe("rebuildSectionsForMeasures", () => {
  it("returns empty when there are no new measures", () => {
    const sections: Sections = { byId: {}, allIds: [] };
    const measures = distributeMeasures(120, TimeSignatureType.FOUR_FOUR, 0, 0);
    expect(rebuildSectionsForMeasures(sections, measures).allIds).toHaveLength(0);
  });

  it("puts all measures into an UNDEFINED section when sections is empty", () => {
    const sections: Sections = { byId: {}, allIds: [] };
    const measures = distributeMeasures(120, TimeSignatureType.FOUR_FOUR, 8, 0);
    const result = rebuildSectionsForMeasures(sections, measures);
    expect(result.allIds).toHaveLength(1);
    expect(result.byId[result.allIds[0]].type).toBe(SectionType.UNDEFINED);
  });

  it("prunes measures that no longer exist after BPM change", () => {
    // Build with 4 measures (0-3), then rebuild for only 2 measures (0-1)
    distributeMeasures(120, TimeSignatureType.FOUR_FOUR, 8, 0);
    const intro = { id: "INTRO_0_3", type: SectionType.INTRO, measures: ["0", "1", "2", "3"] };
    const sections: Sections = { byId: { [intro.id]: intro }, allIds: [intro.id] };

    const m2 = distributeMeasures(120, TimeSignatureType.FOUR_FOUR, 4, 0);
    const result = rebuildSectionsForMeasures(sections, m2);

    const introResult = Object.values(result.byId).find((s) => s.type === SectionType.INTRO);
    expect(introResult?.measures).toEqual(["0", "1"]);
  });

  it("merges adjacent UNDEFINED sections", () => {
    // An intro (m0-1) flanked by two UNDEFINED pieces that should merge
    const undef1 = undefinedSection(["0", "1"]);
    const intro = { id: "INTRO_2_3", type: SectionType.INTRO, measures: ["2", "3"] };
    const undef2 = undefinedSection(["4", "5"]);
    const sections: Sections = {
      byId: { [undef1.id]: undef1, [intro.id]: intro, [undef2.id]: undef2 },
      allIds: [undef1.id, intro.id, undef2.id],
    };

    // New measures drop m2-m3 (intro disappears) so undef1 and undef2 should merge
    const trimmedMeasures = {
      byId: { "0": { id: "0", time: 0, labelText: "0" }, "1": { id: "1", time: 2, labelText: "1" }, "4": { id: "4", time: 8, labelText: "4" }, "5": { id: "5", time: 10, labelText: "5" } },
      allIds: ["0", "1", "4", "5"],
    };

    const result = rebuildSectionsForMeasures(sections, trimmedMeasures);
    const undefinedSections = result.allIds.map((id) => result.byId[id]).filter((s) => s.type === SectionType.UNDEFINED);
    expect(undefinedSections).toHaveLength(1);
    expect(undefinedSections[0].measures).toEqual(["0", "1", "4", "5"]);
  });
});

// ─── sectionBorders ───────────────────────────────────────────────────────────

describe("sectionBorders", () => {
  it("returns correct first and last measure indices", () => {
    const s = { id: "VERSE_3_7", type: SectionType.VERSE, measures: ["3", "4", "5", "6", "7"] };
    expect(sectionBorders(s)).toEqual({ first: 3, last: 7 });
  });

  it("handles a single-measure section", () => {
    const s = undefinedSection(["5"]);
    expect(sectionBorders(s)).toEqual({ first: 5, last: 5 });
  });
});

// ─── getMeasureEnd ────────────────────────────────────────────────────────────

describe("getMeasureEnd", () => {
  const measures = distributeMeasures(120, TimeSignatureType.FOUR_FOUR, 10, 0);
  // Measures: 0@0s, 1@2s, 2@4s, 3@6s, 4@8s

  it("returns start time of the next measure", () => {
    expect(getMeasureEnd("0", measures, 10)).toBeCloseTo(2);
    expect(getMeasureEnd("3", measures, 10)).toBeCloseTo(8);
  });

  it("returns duration for the last measure", () => {
    expect(getMeasureEnd("4", measures, 10)).toBe(10);
  });

  it("returns duration for an unknown measure id", () => {
    expect(getMeasureEnd("99", measures, 10)).toBe(10);
  });
});
