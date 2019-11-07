import { combineReducers } from "redux";
import currentPage from "./currentPage";
import peaks from "./peaks";

export default combineReducers({ currentPage, peaks });
