import { getData, postData } from "../../services/EntriesApi";
import { entriesConstants } from "../constants/entriesConstants";

export const fetchEntries = () => async (dispatch) => {
  const response = await getData();
  // console.log("Response in action: ", response);
  let allEntries = [];
  if (response !== null) {
    if (response.db) {
      allEntries = response.db;
    } else {
      allEntries = response.redis.map((item) => JSON.parse(item));
      allEntries.sort((a, b) => b.id - a.id);
    }
    allEntries.forEach((snippet) => {
      snippet.createdAt = new Date(snippet.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      snippet.stdout = snippet.stdout ? snippet.stdout : "pending";
    });
  }
  dispatch({
    type: entriesConstants.TABLE_DATA,
    payload: allEntries,
  });
};

export const submitEntry = (data) => async (dispatch) => {
  const response = await postData(data);
  dispatch({
    type: entriesConstants.SUBMIT_RESPONSE,
    payload: response.data,
  });
};
