import Interceptor from "./Interceptor";

// Service to ensute server is running or not
export const serverCheck = async () => {
  try {
    const response = await Interceptor.get("/server-check");
    return response;
  } catch (error) {
    // console.error(error);
    const data = {data: {status: false, message: "Something went wrong!"}};
    return data;
  }
  return null;
};