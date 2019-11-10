import { createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";

import rootReducer from "./reducers";

export default createStore(
  rootReducer,
  /* preloadedState, */ devToolsEnhancer(
    {}
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  )
);
