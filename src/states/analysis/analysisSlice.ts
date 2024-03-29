import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  distributeMeasures,
  enclosingSectionOf,
  generateSectionId,
  Measures,
  mergeSections,
  replaceSections,
  Section,
  sectionInvalid,
  Sections,
  SectionType,
  TimeSignatureType,
  undefinedSection
} from "model/model";
import { createdProject } from "states/project/projectSlice";
import ArrayUtil from "util/ArrayUtil";

export interface AnalysisState {
  readonly sections: Sections;
  readonly duration: number;
  readonly firstMeasureStart: number;
  readonly timeSignature: TimeSignatureType;
  readonly bpm: number;
  readonly measures: Measures;
}

export const initialAnalysisState: AnalysisState = {
  sections: { allIds: [], byId: {} },
  bpm: 120,
  firstMeasureStart: 0,
  duration: 180,
  measures: { allIds: [], byId: {} },
  timeSignature: TimeSignatureType.FOUR_FOUR
};

const analysisSlice = createSlice({
  name: "analysis",
  initialState: initialAnalysisState,
  extraReducers: (builder) =>
    builder.addCase(createdProject, (state, action) => {
      return action.payload.analysis;
    }),
  reducers: {
    addedSection(state, action: PayloadAction<Section>) {
      return addSection(state, action.payload);
    },
    updatedSection(
      state,
      action: PayloadAction<{ before: string; after: Section }>
    ) {
      removeSection(state, action.payload.before);
      return addSection(state, action.payload.after);
    },
    removedSection(state, action: PayloadAction<string>) {
      removeSection(state, action.payload);

      return state;
    },
    updatedRhythm(
      state,
      action: PayloadAction<{
        firstMeasureStart?: number;
        bpm?: number;
        timeSignatureType?: TimeSignatureType;
        duration?: number;
      }>
    ) {
      state.duration = action.payload.duration ?? state.duration;
      state.bpm = action.payload.bpm ?? state.bpm;
      state.firstMeasureStart =
        action.payload.firstMeasureStart ?? state.firstMeasureStart;
      state.timeSignature =
        action.payload.timeSignatureType ?? state.timeSignature;

      state.measures = distributeMeasures(
        state.timeSignature,
        state.bpm,
        state.firstMeasureStart,
        state.duration
      );

      if (state.sections.allIds.length === 0) {
        state.sections = undefinedSection(state.measures.allIds.length - 1);
        return state;
      }

      const lastSection =
        state.sections.byId[
          state.sections.allIds[state.sections.allIds.length - 1]
        ];

      if (lastSection === undefined) return state;

      if (
        parseInt(ArrayUtil.last(state.measures.allIds)) >
        parseInt(lastSection.measures[lastSection.measures.length - 1])
      ) {
        const newLastSection: Section = {
          type: lastSection.type,
          measures: ArrayUtil.range(
            parseInt(lastSection.measures[0]),
            parseInt(ArrayUtil.last(state.measures.allIds))
          )
        };
        const id = generateSectionId(newLastSection);
        delete state.sections.byId[
          state.sections.allIds[state.sections.allIds.length - 1]
        ];
        state.sections.allIds[state.sections.allIds.length - 1] = id;
        state.sections.byId[id] = newLastSection;
      }

      removeSectionsAfterLastMeasure(state);

      return state;
    }
  }
});

const removeSectionsAfterLastMeasure: (state: AnalysisState) => void = (
  state
) => {
  const lastMeasure = state.measures.allIds.length - 1;
  let removalStart = -1;
  let removalStartMeasure = -1;

  for (let index = 0; index <= state.sections.allIds.length - 1; index++) {
    const section = state.sections.byId[state.sections.allIds[index]];
    const sectionEnd = parseInt(ArrayUtil.last(section.measures));

    if (sectionEnd > lastMeasure) {
      removalStart = index;
      removalStartMeasure = parseInt(section.measures[0]);
      break;
    }
  }

  if (removalStart === -1) return; // No sections after last measure

  replaceSections(
    state.sections,
    removalStart,
    state.sections.allIds.length - removalStart,
    [
      {
        measures: ArrayUtil.range(removalStartMeasure, lastMeasure),
        type: SectionType.UNDEFINED
      }
    ]
  );
};

const addSection: (
  state: AnalysisState,
  newSection: Section
) => AnalysisState = (state, newSection) => {
  if (sectionInvalid(newSection)) return state;

  const enclosingSection = enclosingSectionOf(newSection, state.sections);
  if (
    enclosingSection === undefined ||
    enclosingSection.section.type !== SectionType.UNDEFINED
  )
    return state;

  const mergedSections = mergeSections(enclosingSection.section, newSection);

  replaceSections(state.sections, enclosingSection.position, 1, mergedSections);

  return state;
};

const removeSection: (state: AnalysisState, sectionId: string) => void = (
  state,
  sectionId
) => {
  const position = state.sections.allIds.indexOf(sectionId);
  const section = state.sections.byId[sectionId];

  const before = state.sections.allIds[position - 1];
  const after = state.sections.allIds[position + 1];

  let { start: firstMeasure, end: lastMeasure } = ArrayUtil.bordersOf(
    section.measures
  );
  let removalStart = position;
  let removalCount = 1;

  if (
    before !== undefined &&
    state.sections.byId[before].type === SectionType.UNDEFINED
  ) {
    removalStart--;
    removalCount++;
    firstMeasure = parseInt(state.sections.byId[before].measures[0]);
  }

  if (
    after !== undefined &&
    state.sections.byId[after].type === SectionType.UNDEFINED
  ) {
    removalCount++;
    lastMeasure = parseInt(ArrayUtil.last(state.sections.byId[after].measures));
  }

  replaceSections(state.sections, removalStart, removalCount, [
    {
      measures: ArrayUtil.range(firstMeasure, lastMeasure),
      type: SectionType.UNDEFINED
    }
  ]);
};

export const { addedSection, removedSection, updatedRhythm, updatedSection } =
  analysisSlice.actions;

export default analysisSlice.reducer;
