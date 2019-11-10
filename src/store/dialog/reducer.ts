import { Reducer } from "redux";

import { DialogActionTypes, DialogState, DialogType } from "./types";

export const initialState: DialogState = {
  currentDialog: DialogType.NONE
};

const reducer: Reducer<DialogState> = (state = initialState, action) => {
  switch (action.type) {
    case DialogActionTypes.OPEN: {
      return { ...state, currentDialog: action.payload };
    }
    default: {
      return state;
    }
  }
};

export { reducer as dialogReducer };
