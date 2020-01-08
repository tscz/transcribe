import { saveAs } from "file-saver";
import JSZip from "jszip";

import { PersistedState } from "../states/store";

interface SaveOptions {
  audioFileUrl: string;
  state: PersistedState;
}

class PersistenceApi {
  private constructor() {}

  private static songFile = "song.blob";
  private static stateFile = "state.json";

  static save = async (filename: string, options: SaveOptions) => {
    let zip = new JSZip();
    zip.file(PersistenceApi.stateFile, JSON.stringify(options.state));

    let response = await fetch(options.audioFileUrl);
    let audioBlob: Blob = await response.blob();
    zip.file(PersistenceApi.songFile, audioBlob);

    await zip.generateAsync({ type: "blob" }).then(file => {
      saveAs(file, filename);
    });
  };

  static async open(
    zip: File
  ): Promise<{ audioBlob: Blob; state: PersistedState }> {
    let archive = await JSZip.loadAsync(zip);
    let audioBlob = await archive.file(PersistenceApi.songFile).async("blob");

    let json = await archive.file(PersistenceApi.stateFile).async("text");
    let state: PersistedState = JSON.parse(json);

    return { audioBlob, state };
  }

  static revokeLocalFile(url: string) {
    window.URL.revokeObjectURL(url);
  }

  static getLocalFileUrl(blob: Blob) {
    return window.URL.createObjectURL(blob);
  }
}

export default PersistenceApi;
