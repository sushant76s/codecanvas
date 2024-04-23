import { judgeConstants } from "../constants/judgeConstants";

const initialState = {
    data: null,
};

const SubmissionReducer = (state = initialState, action) => {
    switch (action.type) {
      case judgeConstants.SUBMISSION:
        return { ...state, data: action.payload };
      default:
        return state;
    }
  };
  
  export default SubmissionReducer;