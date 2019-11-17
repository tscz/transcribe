import { AnalysisActionTypes, Section, TimeSignatureType } from "./types";

/** Add a section to a song analysis. */
export const addSection = (section: Section) => {
  return {
    type: AnalysisActionTypes.SECTION_ADD,
    payload: { section: section }
  };
};

/** Update a section from a song analysis. */
export const updateSection = (section: Section) => ({
  type: AnalysisActionTypes.SECTION_UPDATE,
  payload: { section: section }
});

/** Remove a section from a song analysis. */
export const removeSection = (id: string) => ({
  type: AnalysisActionTypes.SECTION_REMOVE,
  payload: { id }
});

/** Reset a song analysis. */
export const reset = () => ({
  type: AnalysisActionTypes.RESET
});

export const setLength = (length: number) => ({
  type: AnalysisActionTypes.LENGTH_SET,
  payload: { length }
});

export const setRythm = (
  firstMeasureStart: number,
  timeSignatureType: TimeSignatureType,
  bpm: number
) => ({
  type: AnalysisActionTypes.RYTHM_UPDATE,
  payload: {
    firstMeasureStart,
    timeSignatureType,
    bpm
  }
});
