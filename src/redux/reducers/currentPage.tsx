import { SWITCH_PAGE } from "../actionTypes";
import { PAGES } from "../../constants";

const initialState = PAGES.DEFAULT;

const currentPage = (state = initialState, action: any) => {
  switch (action.type) {
    case SWITCH_PAGE: {
      return action.payload.page;
    }
    default: {
      return state;
    }
  }
};

export default currentPage;
