import { PeaksInstance, Segment, SegmentAddOptions } from "peaks.js";

import { SWITCH_PAGE } from "./actionTypes";
import { PEAKS_INIT } from "./actionTypes";
import { SEGMENT_ADD, SEGMENT_REMOVE, SEGMENT_UPDATE } from "./actionTypes";

export const switchPage = (page: String) => ({
  type: SWITCH_PAGE,
  payload: { page }
});

export const initPeaks = (peaksInstance: PeaksInstance) => ({
  type: PEAKS_INIT,
  payload: { peaksInstance }
});

export const addSegment = (segment: SegmentAddOptions) => {
  return {
    type: SEGMENT_ADD,
    payload: { segment }
  };
};

export const updateSegment = (segment: Segment) => ({
  type: SEGMENT_UPDATE,
  payload: { segment }
});

export const removeSegment = (id: string) => ({
  type: SEGMENT_REMOVE,
  payload: { id }
});
