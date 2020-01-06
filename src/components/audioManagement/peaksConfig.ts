import { PointAddOptions, SegmentAddOptions } from "peaks.js";

import { Measure, Section, SectionType } from "../../states/analysisSlice";
import { NormalizedObjects } from "../../states/store";

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

  static sectionsToSegment = (
    sections: NormalizedObjects<Section>,
    measures: NormalizedObjects<Measure>
  ) => {
    let segments: SegmentAddOptions[] = [];
    sections.allIds.forEach(id => {
      const section = sections.byId[id];

      let segment: SegmentAddOptions = {
        id,
        labelText: section.type,
        startTime: measures.byId[section.firstMeasure].time,
        endTime: measures.byId[section.lastMeasure].time,
        color: PeaksOptions.SECTIONTYPE_TO_COLOR.get(section.type),
        editable: false
      };

      segments.push(segment);
    });

    return segments;
  };

  static measuresToPoints = (measures: NormalizedObjects<Measure>) => {
    let points: PointAddOptions[] = [];
    measures.allIds.forEach(id => {
      const measure = measures.byId[id];

      let point: PointAddOptions = measure;

      points.push(point);
    });

    return points;
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
