import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import analysisReducer, {
  AnalysisState
} from "../features/analysis/analysisSlice";
import audioReducer, { AudioState } from "../features/audio/audioSlice";
import dialogReducer, { DialogState } from "../features/dialogs/dialogsSlice";
import projectReducer, { ProjectState } from "../features/project/projectSlice";
import waveReducer, { WaveState } from "../features/wave/waveSlice";

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
