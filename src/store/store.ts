import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import { analysisReducer } from "./analysis/reducer";
import { AnalysisState } from "./analysis/types";
import { audioReducer } from "./audio/reducer";
import { AudioState } from "./audio/types";
import { dialogReducer } from "./dialog/reducer";
import { DialogState } from "./dialog/types";
import { projectReducer } from "./project/reducer";
import { ProjectState } from "./project/types";

/** The top-level application state object. */
export interface ApplicationState {
  analysis: AnalysisState;
  dialog: DialogState;
  project: ProjectState;
  audio: AudioState;
}

export const createRootReducer = combineReducers({
  analysis: analysisReducer,
  dialog: dialogReducer,
  project: projectReducer,
  audio: audioReducer
});

export default configureStore({
  reducer: createRootReducer
});
