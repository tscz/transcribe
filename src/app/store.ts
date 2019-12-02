import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import dialogReducer, { DialogState } from "../features/dialogs/dialogsSlice";
import { analysisReducer } from "../store/analysis/reducer";
import { AnalysisState } from "../store/analysis/types";
import { audioReducer } from "../store/audio/reducer";
import { AudioState } from "../store/audio/types";
import { projectReducer } from "../store/project/reducer";
import { ProjectState } from "../store/project/types";

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
