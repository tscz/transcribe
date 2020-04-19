import { PeaksOptions, PointAddOptions, SegmentAddOptions } from "peaks.js";
import { Measure, Section } from "states/analysis/analysisSlice";
import { NormalizedObjects } from "states/store";
import theme, { getColor } from "styles/theme";

import AudioPlayer from "./audioPlayer";

export const AUDIO_DOM_ELEMENT = "audio_dom_element";
export const ZOOMVIEW_CONTAINER = "zoomview-container";
export const OVERVIEW_CONTAINER = "overview-container";

class PeaksConfig {
  static create: (
    audioBuffer: AudioBuffer,
    audioPlayer: AudioPlayer
  ) => PeaksOptions = (audioBuffer, audioPlayer) => {
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
        color: getColor(section.type),
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
}

export default PeaksConfig;
