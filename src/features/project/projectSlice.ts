import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProjectState {
  readonly currentPage: Page;
  readonly title: string;
  readonly audioUrl: string;
  readonly syncFirstMeasureStart: boolean;
  readonly loaded: boolean;
}

export enum Page {
  DEFAULT = "default",
  STRUCTURE = "structure",
  HARMONY = "harmony",
  GUITAR = "guitar",
  DRUM = "drum",
  PRINT = "print"
}

export const initialState: ProjectState = {
  currentPage: Page.DEFAULT,
  title: "",
  audioUrl: "",
  syncFirstMeasureStart: false,
  loaded: false
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    switchedPage(state, action: PayloadAction<Page>) {
      state.currentPage = action.payload;
    },
    createdProject(
      state,
      action: PayloadAction<{ title: string; audioUrl: string }>
    ) {
      state.title = action.payload.title;
      state.audioUrl = action.payload.audioUrl;
      state.loaded = true;
    },
    enabledSyncFirstMeasureStart(state, action: PayloadAction<boolean>) {
      state.syncFirstMeasureStart = action.payload;
    }
  }
});

export const {
  switchedPage,
  createdProject,
  enabledSyncFirstMeasureStart
} = projectSlice.actions;

export default projectSlice.reducer;
