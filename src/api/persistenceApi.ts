import { saveAs } from "file-saver";
import JSZip from "jszip";

import { PersistedState } from "../states/store";

interface SaveOptions {
  mp3url: string;
  state: PersistedState;
}

class PersistenceApi {
  private constructor() {}

  private static songFile = "song.mp3";
  private static stateFile = "state.json";

  static save = async (filename: string, options: SaveOptions) => {
    let zip = new JSZip();
    zip.file(PersistenceApi.stateFile, JSON.stringify(options.state));

    let response = await fetch(options.mp3url);
    let mp3: Blob = await response.blob();
    zip.file(PersistenceApi.songFile, mp3);

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
}

export default PersistenceApi;
