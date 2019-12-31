import { SegmentAddOptions } from "peaks.js";

import { Section, SectionType } from "../../states/analysisSlice";

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
      zoomLevels: [42] //TODO: Define good initial default
    };
  };

  static sectionsToSegment = (sections: Section[]) => {
    let segments: SegmentAddOptions[] = [];
    sections.forEach(section => {
      let segment: SegmentAddOptions = {
        id:
          section.type + "_" + section.firstMeasure + "-" + section.lastMeasure,
        labelText: section.type,
        startTime: PeaksOptions.measureStartToMilliseconds(
          section.firstMeasure
        ),
        endTime: PeaksOptions.measureEndToMilliseconds(section.lastMeasure),
        color: PeaksOptions.SECTIONTYPE_TO_COLOR.get(section.type),
        editable: false
      };

      segments.push(segment);
    });

    return segments;
  };

  static measureStartToMilliseconds = (measureStart: number) => measureStart;
  static measureEndToMilliseconds = (measureStart: number) => measureStart;

  static SECTIONTYPE_TO_COLOR = new Map<SectionType, string>([
    [SectionType.INTRO, "#FF0000"],
    [SectionType.VERSE, "#FFFF00"],
    [SectionType.PRECHORUS, "#00FF00"],
    [SectionType.CHORUS, "#008000"],
    [SectionType.SOLO, "#000080"],
    [SectionType.OUTRO, "#800080"],
    [SectionType.BRIDGE, "#00FFFF"],
    [SectionType.VERSE, "#800000"]
  ]) as ReadonlyMap<SectionType, string>;
}

export default PeaksOptions;
