import { serverStatusConstants } from "../constants/serverStatusConstants";

const initialState = {
  status: true,
};

const ServerStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case serverStatusConstants.STATE:
      return { ...state, status: action.payload };
    default:
      return state;
  }
};

export default ServerStatusReducer;
