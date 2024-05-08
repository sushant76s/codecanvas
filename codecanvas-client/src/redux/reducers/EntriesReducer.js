import { entriesConstants } from "../constants/entriesConstants";

const initialState = {
  entries: [],
  submitResponse: null,
};

const EntriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case entriesConstants.TABLE_DATA:
      return { ...state, entries: action.payload };
    case entriesConstants.SUBMIT_RESPONSE:
      return { ...state, submitResponse: action.payload };
    default:
      return state;
  }
};

export default EntriesReducer;
