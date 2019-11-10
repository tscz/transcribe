import { combineReducers } from "redux";

import currentPage from "./currentPage";
import peaks from "./peaks";
import segments from "./segments";

export default combineReducers({ currentPage, peaks, segments });
