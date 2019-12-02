import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import analysisReducer, {
  AnalysisState
} from "../features/analysis/analysisSlice";
import audioReducer, { AudioState } from "../features/audio/audioSlice";
import dialogReducer, { DialogState } from "../features/dialogs/dialogsSlice";
import projectReducer, { ProjectState } from "../features/project/projectSlice";

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
