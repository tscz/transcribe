import { PointAddOptions, SegmentAddOptions } from "peaks.js";

import { Measure, Section, SectionType } from "../../states/analysisSlice";
import { NormalizedObjects } from "../../states/store";

export const AUDIO_DOM_ELEMENT = "audio_dom_element";
export const ZOOMVIEW_CONTAINER = "zoomview-container";
export const OVERVIEW_CONTAINER = "overview-container";

class PeaksConfig {
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
        color: PeaksConfig.SECTIONTYPE_TO_COLOR.get(section.type),
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

  static computeZoomLevels = (
    secondsPerMeasure: number,
    audioSampleRate: number,
    zoomviewWidth: number,
    measuresCount: number
  ) => {
    const baseZoom = Math.floor(
      (secondsPerMeasure * audioSampleRate) / zoomviewWidth
    );

    let levels = new Array<number>(measuresCount);

    for (let index = 0; index < levels.length; index++) {
      levels[index] = baseZoom * (index + 1);
    }

    return levels;
  };

  static SECTIONTYPE_TO_COLOR = new Map<SectionType, string>([
    [SectionType.INTRO, "#FFCA28"],
    [SectionType.VERSE, "#FFA726"],
    [SectionType.PRECHORUS, "#FF7043"],
    [SectionType.CHORUS, "#9CCC65"],
    [SectionType.SOLO, "#26C6DA"],
    [SectionType.OUTRO, "#5C6BC0"],
    [SectionType.BRIDGE, "#EC407A"],
    [SectionType.VERSE, "#78909C"]
  ]) as ReadonlyMap<SectionType, string>;
}

export default PeaksConfig;
