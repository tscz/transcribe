import { createStore } from "redux";
import rootReducer from "./reducers";
import { devToolsEnhancer } from "redux-devtools-extension";

export default createStore(
  rootReducer,
  /* preloadedState, */ devToolsEnhancer(
    {}
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  )
);
