import { judgeConstants } from "../constants/judgeConstants";

const initialState = {
    token: '',
};

const JudgeTokenReducer = (state = initialState, action) => {
    switch (action.type) {
      case judgeConstants.SUBMIT_CODE:
        return { ...state, token: action.payload };
      default:
        return state;
    }
  };
  
  export default JudgeTokenReducer;