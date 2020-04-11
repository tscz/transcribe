import { PointAddOptions, SegmentAddOptions } from "peaks.js";

import {
  Measure,
  Section,
  SectionType
} from "../../states/analysis/analysisSlice";
import { NormalizedObjects } from "../../states/store";

export const AUDIO_DOM_ELEMENT = "audio_dom_element";
export const ZOOMVIEW_CONTAINER = "zoomview-container";
export const OVERVIEW_CONTAINER = "overview-container";

class PeaksConfig {
  static create = (audioBuffer: AudioBuffer) => {
    const mediaelement: HTMLAudioElement = document.getElementById(
      AUDIO_DOM_ELEMENT
    ) as HTMLAudioElement;

    return {
      containers: {
        zoomview: document.getElementById(ZOOMVIEW_CONTAINER),
        overview: document.getElementById(OVERVIEW_CONTAINER)
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
    measures: NormalizedObjects<Measure>,
    timePerMeasure: number
  ) => {
    const segments: SegmentAddOptions[] = [];
    sections.allIds.forEach((id) => {
      const section = sections.byId[id];

      const start = measures.byId[section.measures[0]].time;
      const end =
        measures.byId[section.measures[section.measures.length - 1]].time +
        timePerMeasure;

      const segment: SegmentAddOptions = {
        id,
        labelText: section.type,
        startTime: start,
        endTime: end,
        color: PeaksConfig.SECTIONTYPE_TO_COLOR.get(section.type),
        editable: false
      };

      segments.push(segment);
    });

    return segments;
  };

  static measuresToPoints = (measures: NormalizedObjects<Measure>) => {
    const points: PointAddOptions[] = [];
    measures.allIds.forEach((id) => {
      const measure = measures.byId[id];

      const point: PointAddOptions = measure;

      points.push(point);
    });

    return points;
  };

  public static getColor = (sectionType: SectionType) => {
    const result = PeaksConfig.SECTIONTYPE_TO_COLOR.get(sectionType);

    if (!result) throw Error("Unknown SectionType " + sectionType);

    return result;
  };

  private static SECTIONTYPE_TO_COLOR = new Map<SectionType, string>([
    [SectionType.INTRO, "#FFCA28"],
    [SectionType.VERSE, "#FFA726"],
    [SectionType.PRECHORUS, "#FF7043"],
    [SectionType.CHORUS, "#9CCC65"],
    [SectionType.SOLO, "#26C6DA"],
    [SectionType.OUTRO, "#5C6BC0"],
    [SectionType.BRIDGE, "#EC407A"],
    [SectionType.VERSE, "#78909C"],
    [SectionType.UNDEFINED, "#f2f2f2"]
  ]) as ReadonlyMap<SectionType, string>;
}

export default PeaksConfig;
