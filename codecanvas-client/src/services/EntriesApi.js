import Interceptor from "./Interceptor";

export const getData = async () => {
  try {
    const response = await Interceptor.get("/get-snips");
    // console.log("Response in service: ", response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const postData = async (formData) => {
  try {
    const response = await Interceptor.post("/add-snip", formData);
    return response;
  } catch (error) {
    console.error(error);
  }
  return null;
};
