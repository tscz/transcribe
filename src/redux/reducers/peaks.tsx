import { PEAKS_INIT } from "../actionTypes";

const initialState = null;

const peaks = (state = initialState, action: any) => {
  switch (action.type) {
    case PEAKS_INIT: {
      return action.payload.peaksInstance;
    }
    default: {
      return state;
    }
  }
};

export default peaks;
