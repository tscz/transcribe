import { saveAs } from "file-saver";
import JSZip from "jszip";

import { PersistedState } from "@/model/types";

const STATE_FILE = "state.json";
const AUDIO_FILE = "audio.blob";
const ZIP_NAME = "transcription.zip";

export async function saveProject(
  state: PersistedState,
  audioUrl: string
): Promise<void> {
  const zip = new JSZip();

  // Fetch the audio blob from the blob URL
  const audioResponse = await fetch(audioUrl);
  const audioBlob = await audioResponse.blob();

  zip.file(STATE_FILE, JSON.stringify(state, null, 2));
  zip.file(AUDIO_FILE, audioBlob);

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, ZIP_NAME);
}

const MAX_INPUT_SIZE = 500 * 1024 * 1024; // 500 MB
const MAX_STATE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_AUDIO_SIZE = 1024 * 1024 * 1024; // 1 GB
const ALLOWED_FILES = new Set([STATE_FILE, AUDIO_FILE]);

export async function loadProject(
  file: File
): Promise<{ state: PersistedState; audioUrl: string }> {
  if (file.size > MAX_INPUT_SIZE) {
    throw new Error("Project file exceeds maximum allowed size (500 MB)");
  }

  const zip = await JSZip.loadAsync(file);

  for (const name of Object.keys(zip.files)) {
    if (!ALLOWED_FILES.has(name)) {
      throw new Error(`Unexpected file in archive: ${name}`);
    }
  }

  const stateFile = zip.file(STATE_FILE);
  const audioFile = zip.file(AUDIO_FILE);

  if (!stateFile || !audioFile) {
    throw new Error("Invalid project file: missing state.json or audio.blob");
  }

  const stateJson = await stateFile.async("string");
  if (stateJson.length > MAX_STATE_SIZE) {
    throw new Error("State file exceeds maximum allowed size (10 MB)");
  }
  const state = JSON.parse(stateJson) as PersistedState;

  const audioArrayBuffer = await audioFile.async("arraybuffer");
  if (audioArrayBuffer.byteLength > MAX_AUDIO_SIZE) {
    throw new Error("Audio file exceeds maximum allowed size (1 GB)");
  }
  const audioBlob = new Blob([audioArrayBuffer]);
  const audioUrl = URL.createObjectURL(audioBlob);

  return { state, audioUrl };
}
