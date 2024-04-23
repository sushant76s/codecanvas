import {
  getLanguages,
  getSubmission,
  submitCode,
} from "../../services/JudgeApi";
import { judgeConstants } from "../constants/judgeConstants";

export const getAllLanguages = () => async (dispatch) => {
  const response = await getLanguages();
  dispatch({
    type: judgeConstants.LANGUAGES,
    payload: response.data,
  });
};

export const getSubmissionToken = (data) => async (dispatch) => {
  const response = await submitCode(data);
  dispatch({
    type: judgeConstants.SUBMIT_CODE,
    payload: response.data,
  });
};

export const getSubmissionData = (token) => async (dispatch) => {
  const response = await getSubmission(token);
  dispatch({
    type: judgeConstants.SUBMISSION,
    payload: response.data,
  });
};
