import { beforeEach, describe, expect, it } from "vitest";

import { SectionType, TimeSignatureType } from "@/model/types";
import { useStore } from "./index";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const resetStore = () =>
  useStore.setState({
    status: "idle",
    title: "",
    audioUrl: null,
    bpm: 120,
    timeSignature: TimeSignatureType.FOUR_FOUR,
    duration: 0,
    firstMeasureStart: 0,
    sections: { byId: {}, allIds: [] },
    measures: { byId: {}, allIds: [] },
    isPlaying: false,
    playbackRate: 1,
    detune: 0,
    isLooping: false,
    loopStart: 0,
    loopEnd: 0,
    currentTime: 0,
    seekTarget: null,
    metronomeEnabled: false,
    currentDialog: "none",
    currentPath: "/",
  });

const get = () => useStore.getState();

beforeEach(resetStore);

// ─── createProject ────────────────────────────────────────────────────────────

describe("createProject", () => {
  it("sets status to loading with title, audioUrl and duration", () => {
    get().createProject("My Song", "blob:fake", 60);
    const s = get();
    expect(s.status).toBe("loading");
    expect(s.title).toBe("My Song");
    expect(s.audioUrl).toBe("blob:fake");
    expect(s.duration).toBe(60);
  });

  it("generates measures from default BPM and time signature", () => {
    get().createProject("Test", "blob:url", 10);
    // 120 BPM, 4/4 → 2 s/measure; 10 s → measures 0–4
    expect(get().measures.allIds).toEqual(["0", "1", "2", "3", "4"]);
  });

  it("initializes with a single UNDEFINED section covering all measures", () => {
    get().createProject("Test", "blob:url", 10);
    const { sections } = get();
    expect(sections.allIds).toHaveLength(1);
    const only = sections.byId[sections.allIds[0]];
    expect(only.type).toBe(SectionType.UNDEFINED);
    expect(only.measures).toEqual(["0", "1", "2", "3", "4"]);
  });

  it("resets playback state", () => {
    useStore.setState({ isPlaying: true, currentTime: 5, loopStart: 2 });
    get().createProject("Test", "blob:url", 10);
    const s = get();
    expect(s.isPlaying).toBe(false);
    expect(s.currentTime).toBe(0);
    expect(s.loopStart).toBe(0);
  });

  it("resets metronomeEnabled to false", () => {
    useStore.setState({ metronomeEnabled: true });
    get().createProject("Test", "blob:url", 10);
    expect(get().metronomeEnabled).toBe(false);
  });
});

// ─── loadProject ─────────────────────────────────────────────────────────────

describe("loadProject", () => {
  const persistedState = {
    title: "Saved Song",
    bpm: 90,
    timeSignature: TimeSignatureType.THREE_FOUR,
    duration: 30,
    firstMeasureStart: 0.5,
    sections: { byId: {}, allIds: [] },
    measures: { byId: {}, allIds: [] },
  };

  it("restores persisted state and sets status to loading", () => {
    get().loadProject(persistedState, "blob:saved");
    const s = get();
    expect(s.status).toBe("loading");
    expect(s.title).toBe("Saved Song");
    expect(s.bpm).toBe(90);
    expect(s.timeSignature).toBe(TimeSignatureType.THREE_FOUR);
    expect(s.duration).toBe(30);
    expect(s.firstMeasureStart).toBe(0.5);
    expect(s.audioUrl).toBe("blob:saved");
  });

  it("resets playback and sets loopEnd to duration", () => {
    useStore.setState({ isPlaying: true, currentTime: 10, loopEnd: 5 });
    get().loadProject(persistedState, "blob:saved");
    const s = get();
    expect(s.isPlaying).toBe(false);
    expect(s.currentTime).toBe(0);
    expect(s.loopEnd).toBe(30);
  });

  it("resets metronomeEnabled to false", () => {
    useStore.setState({ metronomeEnabled: true });
    get().loadProject(persistedState, "blob:saved");
    expect(get().metronomeEnabled).toBe(false);
  });
});

// ─── setProjectReady ──────────────────────────────────────────────────────────

describe("setProjectReady", () => {
  it("transitions status to ready", () => {
    useStore.setState({ status: "loading" });
    get().setProjectReady();
    expect(get().status).toBe("ready");
  });

  it("does not change metronomeEnabled", () => {
    useStore.setState({ status: "loading", metronomeEnabled: false });
    get().setProjectReady();
    expect(get().metronomeEnabled).toBe(false);
  });
});

// ─── resetProject ─────────────────────────────────────────────────────────────

describe("resetProject", () => {
  it("resets to idle with empty measures and sections", () => {
    get().createProject("Song", "blob:url", 60);
    get().resetProject();
    const s = get();
    expect(s.status).toBe("idle");
    expect(s.title).toBe("");
    expect(s.audioUrl).toBeNull();
    expect(s.sections.allIds).toHaveLength(0);
    expect(s.measures.allIds).toHaveLength(0);
    expect(s.duration).toBe(0);
    expect(s.isPlaying).toBe(false);
    expect(s.currentTime).toBe(0);
  });

  it("resets metronomeEnabled to false", () => {
    useStore.setState({ metronomeEnabled: true });
    get().resetProject();
    expect(get().metronomeEnabled).toBe(false);
  });
});

// ─── updateRhythm ─────────────────────────────────────────────────────────────

describe("updateRhythm", () => {
  beforeEach(() => get().createProject("Test", "blob:url", 10));

  it("regenerates measures when BPM changes", () => {
    // 120 BPM 4/4, 10s → 5 measures (0–4)
    expect(get().measures.allIds).toHaveLength(5);

    // 60 BPM 4/4, 10s → 4s/measure → measures 0, 4, 8 = 3 measures
    get().updateRhythm({ bpm: 60 });
    expect(get().bpm).toBe(60);
    expect(get().measures.allIds).toHaveLength(3);
  });

  it("regenerates measures when time signature changes", () => {
    // 120 BPM 3/4, 10s → 1.5s/measure → 7 measures
    get().updateRhythm({ timeSignature: TimeSignatureType.THREE_FOUR });
    expect(get().timeSignature).toBe(TimeSignatureType.THREE_FOUR);
    expect(get().measures.allIds).toHaveLength(7);
  });

  it("shifts measures when firstMeasureStart changes", () => {
    get().updateRhythm({ firstMeasureStart: 1 });
    // first measure now starts at 1s
    expect(get().measures.byId["0"].time).toBeCloseTo(1);
  });
});

// ─── addSection ───────────────────────────────────────────────────────────────

describe("addSection", () => {
  beforeEach(() => get().createProject("Test", "blob:url", 10));

  it("adds a named section within the UNDEFINED region", () => {
    get().addSection(SectionType.INTRO, "0", "1");
    const { sections } = get();
    const intro = Object.values(sections.byId).find((s) => s.type === SectionType.INTRO);
    expect(intro).toBeDefined();
    expect(intro?.measures).toEqual(["0", "1"]);
  });

  it("splits UNDEFINED into before/named/after", () => {
    get().addSection(SectionType.CHORUS, "1", "2");
    const { sections } = get();
    const types = sections.allIds.map((id) => sections.byId[id].type);
    expect(types).toContain(SectionType.UNDEFINED);
    expect(types).toContain(SectionType.CHORUS);
  });

  it("is a no-op when range overlaps a named section", () => {
    get().addSection(SectionType.INTRO, "0", "1");
    const before = get().sections.allIds.length;
    // Try to add another section overlapping the existing INTRO
    get().addSection(SectionType.VERSE, "1", "2");
    expect(get().sections.allIds.length).toBe(before);
  });
});

// ─── updateSection ────────────────────────────────────────────────────────────

describe("updateSection", () => {
  beforeEach(() => {
    get().createProject("Test", "blob:url", 10);
    get().addSection(SectionType.INTRO, "0", "1");
  });

  it("changes the type of an existing section", () => {
    const { sections } = get();
    const introId = sections.allIds.find((id) => sections.byId[id].type === SectionType.INTRO)!;
    get().updateSection(introId, SectionType.VERSE, "0", "1");
    const updated = get().sections;
    const verse = Object.values(updated.byId).find((s) => s.type === SectionType.VERSE);
    expect(verse).toBeDefined();
    expect(verse?.measures).toEqual(["0", "1"]);
  });

  it("is a no-op for a non-existent sectionId", () => {
    const before = get().sections.allIds.length;
    get().updateSection("NONEXISTENT", SectionType.VERSE, "0", "1");
    expect(get().sections.allIds.length).toBe(before);
  });
});

// ─── removeSection ────────────────────────────────────────────────────────────

describe("removeSection", () => {
  beforeEach(() => {
    get().createProject("Test", "blob:url", 10);
    get().addSection(SectionType.INTRO, "1", "2");
  });

  it("dissolves the section back into UNDEFINED", () => {
    const { sections } = get();
    const introId = sections.allIds.find((id) => sections.byId[id].type === SectionType.INTRO)!;
    get().removeSection(introId);
    const after = get().sections;
    const remaining = after.allIds.map((id) => after.byId[id].type);
    expect(remaining).not.toContain(SectionType.INTRO);
    expect(remaining.every((t) => t === SectionType.UNDEFINED)).toBe(true);
  });

  it("is a no-op for a non-existent sectionId", () => {
    const before = get().sections.allIds.length;
    get().removeSection("NONEXISTENT");
    expect(get().sections.allIds.length).toBe(before);
  });
});

// ─── Audio actions ────────────────────────────────────────────────────────────

describe("audio actions", () => {
  it("setPlaying toggles isPlaying", () => {
    get().setPlaying(true);
    expect(get().isPlaying).toBe(true);
    get().setPlaying(false);
    expect(get().isPlaying).toBe(false);
  });

  it("setLooping toggles isLooping", () => {
    get().setLooping(true);
    expect(get().isLooping).toBe(true);
  });

  it("setLoopRegion sets loopStart and loopEnd", () => {
    get().setLoopRegion(3, 7);
    expect(get().loopStart).toBe(3);
    expect(get().loopEnd).toBe(7);
  });

  it("setPlaybackRate sets playbackRate", () => {
    get().setPlaybackRate(0.75);
    expect(get().playbackRate).toBe(0.75);
  });

  it("setDetune sets detune", () => {
    get().setDetune(-2);
    expect(get().detune).toBe(-2);
  });

  it("setCurrentTime updates currentTime", () => {
    get().setCurrentTime(12.5);
    expect(get().currentTime).toBe(12.5);
  });

  it("seek sets both currentTime and seekTarget", () => {
    get().seek(8);
    expect(get().currentTime).toBe(8);
    expect(get().seekTarget).toBe(8);
  });

  it("clearSeekTarget nulls seekTarget", () => {
    get().seek(5);
    get().clearSeekTarget();
    expect(get().seekTarget).toBeNull();
  });

  it("setMetronomeEnabled toggles metronomeEnabled", () => {
    get().setMetronomeEnabled(true);
    expect(get().metronomeEnabled).toBe(true);
    get().setMetronomeEnabled(false);
    expect(get().metronomeEnabled).toBe(false);
  });
});

// ─── UI actions ───────────────────────────────────────────────────────────────

describe("UI actions", () => {
  it("openDialog sets currentDialog", () => {
    get().openDialog("addSection");
    expect(get().currentDialog).toBe("addSection");
  });

  it("closeDialog resets currentDialog to none", () => {
    get().openDialog("addSection");
    get().closeDialog();
    expect(get().currentDialog).toBe("none");
  });
});
