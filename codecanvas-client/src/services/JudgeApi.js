import Interceptor from "./Interceptor";


// Service to get all the languages of Judge0 API
export const getLanguages = async () => {
  try {
    const response = await Interceptor.get("/languages");
    return response;
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const submitCode = async (data) => {
  try {
    const response = await Interceptor.post("/submit_code", data);
    return response;
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const getSubmission = async (token) => {
  try {
    const response = await Interceptor.get(`/submit_code/${token}`);
    return response;
  } catch (error) {
    console.error(error);
  }
  return null;
};
