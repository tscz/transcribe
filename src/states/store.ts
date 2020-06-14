import { configureStore, createAction } from "@reduxjs/toolkit";
import { AnyAction, combineReducers, Reducer } from "redux";

import analysisReducer, { AnalysisState } from "./analysis/analysisSlice";
import audioReducer, { AudioState } from "./audio/audioSlice";
import dialogReducer, { DialogState } from "./dialog/dialogsSlice";
import AudioMiddleware from "./middleware/audioMiddleware";
import projectReducer, { ProjectState } from "./project/projectSlice";

/** The top-level application state object. */
export interface ApplicationState {
  analysis: AnalysisState;
  audio: AudioState;
  dialog: DialogState;
  project: ProjectState;
}

export interface PersistedState {
  analysis: AnalysisState;
  project: ProjectState;
}

export const restoredPersistedState = createAction<PersistedState>(
  "restoredPersistedState"
);

export const sliceReducer = combineReducers({
  analysis: analysisReducer,
  audio: audioReducer,
  dialog: dialogReducer,
  project: projectReducer
});

export const createRootReducer: Reducer<ApplicationState, AnyAction> = (
  state,
  action
) => {
  state = sliceReducer(state, action);

  if (restoredPersistedState.match(action)) {
    return state;
  }

  return state;
};

const createAppStore = () => {
  const store = configureStore({
    reducer: createRootReducer,
    preloadedState: undefined,
    middleware: [new AudioMiddleware().createMiddleware]
  });

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./store", () => store.replaceReducer(createRootReducer));
  }
  return store;
};

export default createAppStore();
