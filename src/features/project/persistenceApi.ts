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

export async function loadProject(
  file: File
): Promise<{ state: PersistedState; audioUrl: string }> {
  const zip = await JSZip.loadAsync(file);

  const stateFile = zip.file(STATE_FILE);
  const audioFile = zip.file(AUDIO_FILE);

  if (!stateFile || !audioFile) {
    throw new Error("Invalid project file: missing state.json or audio.blob");
  }

  const stateJson = await stateFile.async("string");
  const state = JSON.parse(stateJson) as PersistedState;

  const audioBlob = await audioFile.async("blob");
  const audioUrl = URL.createObjectURL(audioBlob);

  return { state, audioUrl };
}
