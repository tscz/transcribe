import { combineReducers, createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";

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

export default createStore(
  createRootReducer,
  devToolsEnhancer(
    {}
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  )
);
