import { saveAs } from "file-saver";
import JSZip from "jszip";
import { PersistedState } from "states/store";

interface SaveOptions {
  audioFileUrl: string;
  state: PersistedState;
}

class PersistenceApi {
  private constructor() {
    //not instanciable
  }

  private static songFile = "song.blob";
  private static stateFile = "state.json";

  static save = async (filename: string, options: SaveOptions) => {
    const zip = new JSZip();
    zip.file(PersistenceApi.stateFile, JSON.stringify(options.state));

    const response = await fetch(options.audioFileUrl);
    const audioBlob: Blob = await response.blob();
    zip.file(PersistenceApi.songFile, audioBlob);

    await zip.generateAsync({ type: "blob" }).then((file) => {
      saveAs(file, filename);
    });
  };

  static async open(
    zip: File
  ): Promise<{ audioBlob: Blob; state: PersistedState }> {
    const archive = await JSZip.loadAsync(zip);

    const songFile = archive.file(PersistenceApi.songFile);
    if (songFile === null)
      throw new Error(
        "Project must contain an audio file " + PersistenceApi.songFile
      );

    const stateFile = archive.file(PersistenceApi.stateFile);
    if (stateFile === null)
      throw new Error(
        "Project must contain a project config/state file " +
          PersistenceApi.stateFile
      );

    const audioBlob = await songFile.async("blob");

    const json = await stateFile.async("text");
    const state: PersistedState = JSON.parse(json);

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
