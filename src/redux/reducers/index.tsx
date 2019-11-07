import { combineReducers } from "redux";
import currentPage from "./currentPage";
import segments from "./segments";

import peaks from "./peaks";

export default combineReducers({ currentPage, peaks, segments });
