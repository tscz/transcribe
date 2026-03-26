import JSZip from "jszip";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TimeSignatureType } from "@/model/types";
import { loadProject } from "./persistenceApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function makeZipFile(files: Record<string, string | Uint8Array>): Promise<File> {
  const zip = new JSZip();
  for (const [name, content] of Object.entries(files)) {
    zip.file(name, content);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  return new File([blob], "test.zip", { type: "application/zip" });
}

const validState = {
  title: "Test Song",
  bpm: 120,
  timeSignature: TimeSignatureType.FOUR_FOUR,
  duration: 10,
  firstMeasureStart: 0,
  sections: { byId: {}, allIds: [] },
  measures: { byId: {}, allIds: [] },
};

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.stubGlobal("URL", {
    createObjectURL: vi.fn(() => "blob:mocked-url"),
    revokeObjectURL: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ─── loadProject ─────────────────────────────────────────────────────────────

describe("loadProject", () => {
  it("returns parsed state and a blob URL from a valid zip", async () => {
    const file = await makeZipFile({
      "state.json": JSON.stringify(validState),
      "audio.blob": new Uint8Array([1, 2, 3]),
    });
    const result = await loadProject(file);
    expect(result.state.title).toBe("Test Song");
    expect(result.state.bpm).toBe(120);
    expect(result.state.duration).toBe(10);
    expect(result.audioUrl).toBe("blob:mocked-url");
  });

  it("calls URL.createObjectURL with a Blob", async () => {
    const file = await makeZipFile({
      "state.json": JSON.stringify(validState),
      "audio.blob": new Uint8Array([1, 2, 3]),
    });
    await loadProject(file);
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
  });

  it("throws when the zip is missing state.json", async () => {
    const file = await makeZipFile({ "audio.blob": new Uint8Array([1]) });
    await expect(loadProject(file)).rejects.toThrow("Invalid project file");
  });

  it("throws when the zip is missing audio.blob", async () => {
    const file = await makeZipFile({ "state.json": JSON.stringify(validState) });
    await expect(loadProject(file)).rejects.toThrow("Invalid project file");
  });

  it("throws when the archive contains unexpected files", async () => {
    const file = await makeZipFile({
      "state.json": JSON.stringify(validState),
      "audio.blob": new Uint8Array([1]),
      "malicious.exe": new Uint8Array([0]),
    });
    await expect(loadProject(file)).rejects.toThrow("Unexpected file in archive: malicious.exe");
  });

  it("throws when the input file exceeds 500 MB", async () => {
    const fakeFile = { size: 501 * 1024 * 1024, name: "big.zip" } as File;
    await expect(loadProject(fakeFile)).rejects.toThrow(
      "Project file exceeds maximum allowed size (500 MB)"
    );
  });
});
