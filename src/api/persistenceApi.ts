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

  static open = async (
    zipUrl: string,
    loadstart: (zipUrl: string) => void,
    load: (mp3Url: string, state: PersistedState) => void
  ) => {
    loadstart(zipUrl);

    let zip = new JSZip();
    zip.loadAsync(zipUrl).then(async archive => {
      let mp3 = archive.file(PersistenceApi.songFile).name;

      let json = await archive.file(PersistenceApi.stateFile).async("text");
      let state: PersistedState = JSON.parse(json);

      load(mp3, state);
    });
  };
}

export default PersistenceApi;
