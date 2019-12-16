import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import analysisReducer, { AnalysisState } from "./analysisSlice";
import audioReducer, { AudioState } from "./audioSlice";
import dialogReducer, { DialogState } from "./dialogsSlice";
import projectReducer, { ProjectState } from "./projectSlice";
import waveReducer, { WaveState } from "./waveSlice";

/** The top-level application state object. */
export interface ApplicationState {
  analysis: AnalysisState;
  audio: AudioState;
  dialog: DialogState;
  project: ProjectState;
  wave: WaveState;
}

export const createRootReducer = combineReducers({
  analysis: analysisReducer,
  audio: audioReducer,
  dialog: dialogReducer,
  project: projectReducer,
  wave: waveReducer
});

export default configureStore({
  reducer: createRootReducer
});
