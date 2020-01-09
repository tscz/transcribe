import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PersistedState } from "./store";

export interface ProjectState {
  readonly status: LoadingStatus;
  readonly currentPage: Page;
  readonly title: string;
  readonly audioUrl: string;
  readonly syncFirstMeasureStart: boolean;
}

export enum LoadingStatus {
  NOT_INITIALIZED = "not_initialized",
  INITIALIZING = "initializing",
  INITIALIZED = "initialized"
}

export enum Page {
  DEFAULT = "default",
  STRUCTURE = "structure",
  HARMONY = "harmony",
  GUITAR = "guitar",
  DRUM = "drum",
  PRINT = "print"
}

export const initialProjectState: ProjectState = {
  status: LoadingStatus.NOT_INITIALIZED,
  currentPage: Page.DEFAULT,
  title: "",
  audioUrl: "",
  syncFirstMeasureStart: false
};

const projectSlice = createSlice({
  name: "project",
  initialState: initialProjectState,
  reducers: {
    switchedPage(state, action: PayloadAction<Page>) {
      state.currentPage = action.payload;
    },
    createdProject(state, action: PayloadAction<PersistedState>) {
      return { ...action.payload.project, status: LoadingStatus.INITIALIZING };
    },
    hotReloaded(state) {
      state.status = LoadingStatus.INITIALIZING;
    },
    initializedProject(
      state,
      action: PayloadAction<{ audioDuration: number; audioSampleRate: number }>
    ) {
      state.status = LoadingStatus.INITIALIZED;
    },
    enabledSyncFirstMeasureStart(state, action: PayloadAction<boolean>) {
      state.syncFirstMeasureStart = action.payload;
    }
  }
});

export const {
  switchedPage,
  createdProject,
  initializedProject,
  hotReloaded,
  enabledSyncFirstMeasureStart
} = projectSlice.actions;

export default projectSlice.reducer;
