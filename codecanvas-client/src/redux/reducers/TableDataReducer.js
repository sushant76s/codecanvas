import { entriesConstants } from "../constants/entriesConstants";

const initialState = {
  current: null,
  total: null,
};

const TableDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case entriesConstants.SUBMIT_RESPONSE:
      return { ...state, current: action.payload };
    case entriesConstants.TABLE_DATA:
      return { ...state, total: action.payload };
    default:
      return state;
  }
};

export default TableDataReducer;
