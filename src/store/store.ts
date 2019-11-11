import { combineReducers, createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";

import { analysisReducer } from "./analysis/reducer";
import { AnalysisState } from "./analysis/types";
import { dialogReducer } from "./dialog/reducer";
import { DialogState } from "./dialog/types";
import { projectReducer } from "./project/reducer";
import { ProjectState } from "./project/types";
import { structureReducer } from "./structure/reducer";
import { StructureState } from "./structure/types";

/** The top-level application state object. */
export interface ApplicationState {
  analysis: AnalysisState;
  dialog: DialogState;
  project: ProjectState;
  structure: StructureState;
}

export const createRootReducer = combineReducers({
  analysis: analysisReducer,
  dialog: dialogReducer,
  project: projectReducer,
  structure: structureReducer
});

export default createStore(
  createRootReducer,
  devToolsEnhancer(
    {}
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  )
);
