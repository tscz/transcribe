import { SectionType } from "@/model/types";

export const SECTION_COLORS: Record<SectionType, string> = {
  [SectionType.INTRO]: "#FACC15",
  [SectionType.VERSE]: "#FB923C",
  [SectionType.PRECHORUS]: "#F97316",
  [SectionType.CHORUS]: "#4ADE80",
  [SectionType.BRIDGE]: "#F472B6",
  [SectionType.SOLO]: "#22D3EE",
  [SectionType.OUTRO]: "#818CF8",
  [SectionType.UNDEFINED]: "#3f3f46",
};

export const SECTION_LABELS: Record<SectionType, string> = {
  [SectionType.INTRO]: "Intro",
  [SectionType.VERSE]: "Verse",
  [SectionType.PRECHORUS]: "Pre-Chorus",
  [SectionType.CHORUS]: "Chorus",
  [SectionType.BRIDGE]: "Bridge",
  [SectionType.SOLO]: "Solo",
  [SectionType.OUTRO]: "Outro",
  [SectionType.UNDEFINED]: "Undefined",
};

export const EDITABLE_SECTION_TYPES = [
  SectionType.INTRO,
  SectionType.VERSE,
  SectionType.PRECHORUS,
  SectionType.CHORUS,
  SectionType.BRIDGE,
  SectionType.SOLO,
  SectionType.OUTRO,
];

export const BPM_MIN = 40;
export const BPM_MAX = 220;
export const PLAYBACK_RATE_MIN = 0.4;
export const PLAYBACK_RATE_MAX = 1.2;
export const PLAYBACK_RATE_STEP = 0.05;
export const DETUNE_MIN = -12;
export const DETUNE_MAX = 12;
export const DETUNE_STEP = 0.5;
export const MEASURES_PER_ROW = 8;
