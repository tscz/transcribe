import { Segment, SegmentAddOptions } from "peaks.js";

import { AnalysisActionTypes } from "./types";

/** Add a segment to a song analysis. */
export const addSegment = (segment: SegmentAddOptions) => {
  return {
    type: AnalysisActionTypes.SEGMENT_ADD,
    payload: { segment }
  };
};

/** Update a segment from a song analysis. */
export const updateSegment = (segment: Segment) => ({
  type: AnalysisActionTypes.SEGMENT_UPDATE,
  payload: { segment }
});

/** Remove a segment from a song analysis. */
export const removeSegment = (id: string) => ({
  type: AnalysisActionTypes.SEGMENT_REMOVE,
  payload: { id }
});

/** Reset a song analysis. */
export const reset = () => ({
  type: AnalysisActionTypes.RESET
});
