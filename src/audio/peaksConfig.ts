import { ZOOMLEVELS } from "../store/audio/types";

export const AUDIO_DOM_ELEMENT = "audio_dom_element";
export const ZOOMVIEW_CONTAINER = "zoomview-container";
export const OVERVIEW_CONTAINER = "overview-container";

class PeaksOptions {
  static create = (audioBuffer: AudioBuffer) => {
    let mediaelement = document!.getElementById(
      AUDIO_DOM_ELEMENT
    )! as HTMLAudioElement;

    return {
      containers: {
        zoomview: document!.getElementById(ZOOMVIEW_CONTAINER)!,
        overview: document!.getElementById(OVERVIEW_CONTAINER)!
      },
      mediaElement: mediaelement,
      webAudio: {
        audioBuffer: audioBuffer,
        scale: 128,
        multiChannel: false
      },
      keyboard: true,
      pointMarkerColor: "#006eb0",
      showPlayheadTime: true,
      zoomLevels: ZOOMLEVELS
    };
  };
}

export default PeaksOptions;
