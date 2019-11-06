import { SWITCH_PAGE } from "./actionTypes";

export const switchPage = (page: String) => ({
  type: SWITCH_PAGE,
  payload: { page }
});
