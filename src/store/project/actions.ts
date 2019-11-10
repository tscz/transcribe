import { PeaksInstance } from "peaks.js";

import { Page, ProjectActionTypes } from "./types";

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

/** Create a new project. */
export const createProject = (title: string, audioUrl: string) => ({
  type: ProjectActionTypes.CREATE,
  payload: { title: title, audioUrl: audioUrl }
});
