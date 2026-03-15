import { create, useStore as useZustandStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { temporal } from "zundo";
import type { TemporalState } from "zundo";

import {
  dissolveSection,
  distributeMeasures,
  enclosingSectionOf,
  generateSectionId,
  mergeSections,
  rebuildSectionsForMeasures,
  replaceSections,
  undefinedSection,
} from "@/model/analysis";
import {
  DialogType,
  Measures,
  PersistedState,
  ProjectStatus,
  Section,
  SectionType,
  Sections,
  TimeSignatureType,
} from "@/model/types";

// ─── State shape ──────────────────────────────────────────────────────────────

interface ProjectSlice {
  status: ProjectStatus;
  title: string;
  audioUrl: string | null;
}

interface AnalysisSlice {
  bpm: number;
  timeSignature: TimeSignatureType;
  duration: number;
  firstMeasureStart: number;
  sections: Sections;
  measures: Measures;
}

interface AudioSlice {
  isPlaying: boolean;
  playbackRate: number;
  detune: number;
  isLooping: boolean;
  loopStart: number;
  loopEnd: number;
  currentTime: number;
  /** Set by waveform/measure clicks; consumed by useAudioPlayer to move Tone.Transport */
  seekTarget: number | null;
}

interface UiSlice {
  currentDialog: DialogType;
  currentPath: string;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

interface Actions {
  // Project
  createProject: (title: string, audioUrl: string, duration: number) => void;
  loadProject: (state: PersistedState, audioUrl: string) => void;
  setProjectReady: () => void;
  resetProject: () => void;

  // Analysis
  updateRhythm: (partial: {
    bpm?: number;
    timeSignature?: TimeSignatureType;
    duration?: number;
    firstMeasureStart?: number;
  }) => void;
  addSection: (type: SectionType, firstMeasure: string, lastMeasure: string) => void;
  updateSection: (sectionId: string, type: SectionType, firstMeasure: string, lastMeasure: string) => void;
  removeSection: (sectionId: string) => void;

  // Audio
  setPlaying: (playing: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setDetune: (semitones: number) => void;
  setLooping: (looping: boolean) => void;
  setLoopRegion: (start: number, end: number) => void;
  setCurrentTime: (time: number) => void;
  /** Seek to a time (triggers Tone.Transport move via useAudioPlayer) */
  seek: (time: number) => void;
  clearSeekTarget: () => void;

  // UI
  openDialog: (dialog: DialogType) => void;
  closeDialog: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

type AppStore = ProjectSlice & AnalysisSlice & AudioSlice & UiSlice & Actions;

const EMPTY_SECTIONS: Sections = { byId: {}, allIds: [] };
const EMPTY_MEASURES: Measures = { byId: {}, allIds: [] };

export const useStore = create<AppStore>()(
  temporal(
  subscribeWithSelector((set, get) => ({
    // ── Project defaults ──
    status: "idle",
    title: "",
    audioUrl: null,

    // ── Analysis defaults ──
    bpm: 120,
    timeSignature: TimeSignatureType.FOUR_FOUR,
    duration: 0,
    firstMeasureStart: 0,
    sections: EMPTY_SECTIONS,
    measures: EMPTY_MEASURES,

    // ── Audio defaults ──
    isPlaying: false,
    playbackRate: 1,
    detune: 0,
    isLooping: false,
    loopStart: 0,
    loopEnd: 0,
    currentTime: 0,
    seekTarget: null,

    // ── UI defaults ──
    currentDialog: "none",
    currentPath: "/",

    // ──────────────────────────────────────────────────────────────────────────
    // Project actions
    // ──────────────────────────────────────────────────────────────────────────

    createProject: (title, audioUrl, duration) => {
      const bpm = 120;
      const timeSignature = TimeSignatureType.FOUR_FOUR;
      const firstMeasureStart = 0;
      const measures = distributeMeasures(bpm, timeSignature, duration, firstMeasureStart);
      const sections: Sections = {
        byId: {},
        allIds: [],
      };
      const initial = undefinedSection(measures.allIds);
      sections.byId[initial.id] = initial;
      sections.allIds = [initial.id];

      set({
        status: "loading",
        title,
        audioUrl,
        bpm,
        timeSignature,
        duration,
        firstMeasureStart,
        measures,
        sections,
        isPlaying: false,
        currentTime: 0,
        loopStart: 0,
        loopEnd: duration,
      });
    },

    loadProject: (state, audioUrl) => {
      set({
        status: "loading",
        audioUrl,
        title: state.title,
        bpm: state.bpm,
        timeSignature: state.timeSignature,
        duration: state.duration,
        firstMeasureStart: state.firstMeasureStart,
        sections: state.sections,
        measures: state.measures,
        isPlaying: false,
        currentTime: 0,
        loopStart: 0,
        loopEnd: state.duration,
      });
    },

    setProjectReady: () => set({ status: "ready" }),

    resetProject: () =>
      set({
        status: "idle",
        title: "",
        audioUrl: null,
        sections: EMPTY_SECTIONS,
        measures: EMPTY_MEASURES,
        duration: 0,
        isPlaying: false,
        currentTime: 0,
      }),

    // ──────────────────────────────────────────────────────────────────────────
    // Analysis actions
    // ──────────────────────────────────────────────────────────────────────────

    updateRhythm: (partial) => {
      const s = get();
      const bpm = partial.bpm ?? s.bpm;
      const timeSignature = partial.timeSignature ?? s.timeSignature;
      const duration = partial.duration ?? s.duration;
      const firstMeasureStart = partial.firstMeasureStart ?? s.firstMeasureStart;

      const measures = distributeMeasures(bpm, timeSignature, duration, firstMeasureStart);
      const sections = rebuildSectionsForMeasures(s.sections, measures);

      set({ bpm, timeSignature, duration, firstMeasureStart, measures, sections });
    },

    addSection: (type, firstMeasure, lastMeasure) => {
      const { sections, measures } = get();
      const measureRange = measures.allIds.filter((id) => {
        const n = parseInt(id);
        return n >= parseInt(firstMeasure) && n <= parseInt(lastMeasure);
      });

      const parent = enclosingSectionOf(sections, firstMeasure, lastMeasure);
      if (!parent) return;

      const newSection: Section = {
        id: generateSectionId(type, measureRange),
        type,
        measures: measureRange,
      };

      const spliced = mergeSections(parent, newSection);
      const nextSections = replaceSections(sections, [parent], spliced);

      set({ sections: nextSections });
    },

    updateSection: (sectionId, type, firstMeasure, lastMeasure) => {
      const { sections, measures } = get();
      if (!sections.byId[sectionId]) return;

      // Dissolve the old section back to UNDEFINED (merges neighbors)
      const dissolved = dissolveSection(sections, sectionId);

      // The new range must lie entirely within a single UNDEFINED region
      const parent = enclosingSectionOf(dissolved, firstMeasure, lastMeasure);
      if (!parent) return; // would overlap a named section → reject

      const measureRange = measures.allIds.filter((id) => {
        const n = parseInt(id);
        return n >= parseInt(firstMeasure) && n <= parseInt(lastMeasure);
      });

      const newSection: Section = {
        id: generateSectionId(type, measureRange),
        type,
        measures: measureRange,
      };

      const spliced = mergeSections(parent, newSection);
      set({ sections: replaceSections(dissolved, [parent], spliced) });
    },

    removeSection: (sectionId) => {
      const { sections } = get();
      if (!sections.byId[sectionId]) return;
      set({ sections: dissolveSection(sections, sectionId) });
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Audio actions
    // ──────────────────────────────────────────────────────────────────────────

    setPlaying: (playing) => set({ isPlaying: playing }),
    setPlaybackRate: (rate) => set({ playbackRate: rate }),
    setDetune: (semitones) => set({ detune: semitones }),
    setLooping: (looping) => set({ isLooping: looping }),
    setLoopRegion: (start, end) => set({ loopStart: start, loopEnd: end }),
    setCurrentTime: (time) => set({ currentTime: time }),
    seek: (time) => {
      set({ seekTarget: time, currentTime: time });
    },
    clearSeekTarget: () => set({ seekTarget: null }),

    // ──────────────────────────────────────────────────────────────────────────
    // UI actions
    // ──────────────────────────────────────────────────────────────────────────

    openDialog: (dialog) => set({ currentDialog: dialog }),
    closeDialog: () => set({ currentDialog: "none" }),
  })),
  {
    partialize: (state) => ({
      bpm: state.bpm,
      timeSignature: state.timeSignature,
      duration: state.duration,
      firstMeasureStart: state.firstMeasureStart,
      sections: state.sections,
      measures: state.measures,
    }),
  }
  )
);

type AnalysisSnapshot = Pick<
  AnalysisSlice,
  "bpm" | "timeSignature" | "duration" | "firstMeasureStart" | "sections" | "measures"
>;

export function useTemporalStore<T>(selector: (state: TemporalState<AnalysisSnapshot>) => T): T {
  return useZustandStore(useStore.temporal, selector);
}

// Convenience selector hooks
export const useProjectStatus = () => useStore((s) => s.status);
export const useAudioUrl = () => useStore((s) => s.audioUrl);
export const useIsReady = () => useStore((s) => s.status === "ready");
