import { Measures, Sections } from "model/model";
import { PeaksOptions, PointAddOptions, SegmentAddOptions } from "peaks.js";
import theme, { getColor } from "styles/theme";

import AudioPlayer from "./audioPlayer";

export const AUDIO_DOM_ELEMENT = "audio_dom_element";
export const ZOOMVIEW_CONTAINER = "zoomview-container";
export const OVERVIEW_CONTAINER = "overview-container";

class PeaksConfig {
  static create(
    audioBuffer: AudioBuffer,
    audioPlayer: AudioPlayer
  ): PeaksOptions {
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
      pointMarkerColor: theme.waveform.pointMarkerColor,
      showPlayheadTime: true,
      zoomLevels: [42], //TODO: Define good initial default
      player: audioPlayer
    };
  }

  static sectionsToSegment(
    sections: Sections,
    measures: Measures,
    timePerMeasure: number
  ): SegmentAddOptions[] {
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
        color: getColor(section.type),
        editable: false
      };

      segments.push(segment);
    });

    return segments;
  }

  static measuresToPoints(measures: Measures): PointAddOptions[] {
    const points: PointAddOptions[] = [];
    measures.allIds.forEach((id) => {
      const measure = measures.byId[id];

      const point: PointAddOptions = measure;

      points.push(point);
    });

    return points;
  }
}

export default PeaksConfig;
