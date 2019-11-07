import { SEGMENT_ADD, SEGMENT_REMOVE, SEGMENT_UPDATE } from "../actionTypes";

const initialState: any[] = [];

const segments = (state = initialState, action: any) => {
  console.log(
    "Reducer segments: state=" +
      state +
      ",action=" +
      JSON.stringify(action.type)
  );
  switch (action.type) {
    case SEGMENT_ADD: {
      return [...state, action.payload.segment];
    }
    case SEGMENT_REMOVE: {
      return state;
    }
    case SEGMENT_UPDATE: {
      return state;
    }
    default: {
      return state;
    }
  }
};

export default segments;
