import { getData, postData } from "../../services/SubmissionsApi";
import { entriesConstants } from "../constants/entriesConstants";

export const getSubmittedData = () => async (dispatch) => {
  const response = await getData();
  if(response !== null) {
    dispatch({
      type: entriesConstants.TABLE_DATA,
      payload: response.data,
    });
  }
};

export const submitData = (data) => async (dispatch) => {
  const response = await postData(data);
  dispatch({
    type: entriesConstants.SUBMIT_RESPONSE,
    payload: response.data,
  });
};
