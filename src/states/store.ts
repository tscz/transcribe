import { configureStore, createAction } from "@reduxjs/toolkit";
import { AnyAction, combineReducers, Reducer } from "redux";

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

export interface PersistedState {
  analysis: AnalysisState;
  project: ProjectState;
}

export interface NormalizedObjects<T> {
  byId: { [id: string]: T };
  allIds: string[];
}

export const restoredPersistedState = createAction<PersistedState>(
  "restoredPersistedState"
);

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

export const sliceReducer = combineReducers({
  analysis: analysisReducer,
  audio: audioReducer,
  dialog: dialogReducer,
  project: projectReducer,
  wave: waveReducer
});

const createAppStore = () => {
  const store = configureStore({
    reducer: createRootReducer,
    preloadedState: undefined
  });

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./store", () => store.replaceReducer(createRootReducer));
  }
  return store;
};

export default createAppStore();
