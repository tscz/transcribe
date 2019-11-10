import { PeaksInstance } from "peaks.js";

import { Page } from "../../constants";
import { ProjectActionTypes } from "./types";

/** Switch to the given Page. */
export const switchPage = (page: Page) => ({
  type: ProjectActionTypes.SWITCH_PAGE,
  payload: { page }
});

/** Initialize the peaks instance. */
export const initPeaks = (peaksInstance: PeaksInstance) => ({
  type: ProjectActionTypes.PEAKS_INIT,
  payload: { peaksInstance }
});
