import { saveAs } from "file-saver";
import JSZip from "jszip";

import { AnalysisState } from "../states/analysisSlice";
import { ApplicationState } from "../states/store";

interface SaveOptions {
  mp3url: string;
  state: ApplicationState;
}

class PersistenceApi {
  private constructor() {}

  private static song = "song.mp3";
  private static state = "analysis.json";

  static save = async (filename: string, options: SaveOptions) => {
    let { analysis } = options.state;
    let persistentState: any = Object.assign({}, { analysis });

    let zip = new JSZip();
    zip.file(PersistenceApi.state, JSON.stringify(persistentState));

    let mp3: Blob = await fetch(options.mp3url).then(r => r.blob());
    zip.file(PersistenceApi.song, mp3);

    zip.generateAsync({ type: "blob" }).then(file => {
      saveAs(file, filename);
    });
  };

  static open = async (
    zipUrl: string,
    loadstart: (zipUrl: string) => void,
    load: (mp3Url: string, state: AnalysisState) => void
  ) => {
    loadstart(zipUrl);

    let zip = new JSZip();
    zip.loadAsync(zipUrl).then(async archive => {
      let mp3 = archive.file(PersistenceApi.song).name;

      let json = await archive.file(PersistenceApi.state).async("text");
      let state: AnalysisState = JSON.parse(json);

      load(mp3, state);
    });
  };
}

export default PersistenceApi;
