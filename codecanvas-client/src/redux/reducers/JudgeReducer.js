import { judgeConstants } from "../constants/judgeConstants";

const initialState = {
    data: null,
};

const JudgeReducer = (state = initialState, action) => {
    switch (action.type) {
      case judgeConstants.LANGUAGES:
        return { ...state, data: action.payload };
      default:
        return state;
    }
  };
  
  export default JudgeReducer;