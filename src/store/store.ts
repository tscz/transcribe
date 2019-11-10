import { combineReducers, createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";

import { analysisReducer } from "./analysis/reducer";
import { AnalysisState } from "./analysis/types";
import { projectReducer } from "./project/reducer";
import { ProjectState } from "./project/types";

/** The top-level application state object. */
export interface ApplicationState {
  analysis: AnalysisState;
  project: ProjectState;
}

export const createRootReducer = combineReducers({
  analysis: analysisReducer,
  project: projectReducer
});

export default createStore(
  createRootReducer,
  devToolsEnhancer(
    {}
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  )
);
