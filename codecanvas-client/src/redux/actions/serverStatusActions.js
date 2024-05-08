import { checkServerStatus } from "../../services/ServerStatusApi";
import { serverStatusConstants } from "../constants/serverStatusConstants";

export const serverStatus = () => async (dispatch) => {
  const response = await checkServerStatus();
  dispatch({
    type: serverStatusConstants.STATE,
    payload: response?.status === 200,
  });
};
