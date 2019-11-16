import { Page, ProjectActionTypes } from "./types";

/** Switch to the given Page. */
export const switchPage = (page: Page) => ({
  type: ProjectActionTypes.SWITCH_PAGE,
  payload: { page }
});

/** Create a new project. */
export const createProject = (title: string, audioUrl: string) => ({
  type: ProjectActionTypes.CREATE,
  payload: { title: title, audioUrl: audioUrl }
});