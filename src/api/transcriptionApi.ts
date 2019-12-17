import { saveAs } from "file-saver";
import JSZip from "jszip";

import { ApplicationState } from "../states/store";

class TranscriptionApi {
  static save = async (url: string, state: ApplicationState) => {
    let { analysis } = state;

    let persistentState: any = Object.assign({}, { analysis });

    let zip = new JSZip();
    zip.file("analyis.json", JSON.stringify(persistentState));

    let blob: Blob = await fetch(url).then(r => r.blob());

    zip.file("song.mp3", blob);

    zip.generateAsync({ type: "blob" }).then(function(content) {
      // see FileSaver.js
      saveAs(content, "project.zip");
    });
  };

  static open = () => {
    console.log("TranscriptionApi.open");
  };
}

export default TranscriptionApi;
