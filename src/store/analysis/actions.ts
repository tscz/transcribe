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

export const setSourceInfos = (
  audioLength: number,
  audioSampleRate: number
) => ({
  type: AnalysisActionTypes.SOURCE_UPDATE,
  payload: { audioLength: audioLength, audioSampleRate: audioSampleRate }
});

interface RhythmParameter {
  firstMeasureStart?: number;
  timeSignatureType?: TimeSignatureType;
  bpm?: number;
}

export const setRhythm = (param: RhythmParameter) => ({
  type: AnalysisActionTypes.RHYTHM_UPDATE,
  payload: {
    firstMeasureStart: param.firstMeasureStart,
    timeSignatureType: param.timeSignatureType,
    bpm: param.bpm
  }
});
