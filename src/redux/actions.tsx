import { SWITCH_PAGE } from "./actionTypes";
import { PEAKS_INIT } from "./actionTypes";
import { PeaksInstance } from "peaks.js";

export const switchPage = (page: String) => ({
  type: SWITCH_PAGE,
  payload: { page }
});

export const initPeaks = (peaksInstance: PeaksInstance) => ({
  type: PEAKS_INIT,
  payload: { peaksInstance }
});
