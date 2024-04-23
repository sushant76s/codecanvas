import { combineReducers } from "@reduxjs/toolkit";
import JudgeReducer from "./JudgeReducer";
import JudgeTokenReducer from "./JudgeTokenReducer";
import SubmissionReducer from "./SubmissionReducer";
import TableDataReducer from "./TableDataReducer";

const reducers = combineReducers({
  JudgeReducer,
  JudgeTokenReducer,
  SubmissionReducer,
  TableDataReducer,
});

export default reducers;
