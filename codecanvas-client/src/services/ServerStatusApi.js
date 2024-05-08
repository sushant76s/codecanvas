import Interceptor from "./Interceptor";

export const checkServerStatus = async () => {
  try {
    const response = await Interceptor.get("/server-check");
    return response;
  } catch (error) {
    console.error(error);
  }
  return null;
};
