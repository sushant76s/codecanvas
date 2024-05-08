import { combineReducers } from "@reduxjs/toolkit";

import EntriesReducer from "./EntriesReducer";
import ServerStatusReducer from "./ServerStatusReducer";

const reducers = combineReducers({
  EntriesReducer,
  ServerStatusReducer,
});

export default reducers;
