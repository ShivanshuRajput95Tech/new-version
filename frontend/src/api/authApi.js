import api from "./axios";

const handleRequest = async (request) => {
  try {
    const res = await request();
    return res.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "API request failed";

    throw new Error(message);
  }
};

export const loginUser = (data) => handleRequest(() => api.post("/api/auth/login", data));
export const registerUser = (data) => handleRequest(() => api.post("/api/auth/register", data));
export const getProfile = () => handleRequest(() => api.get("/api/auth/me"));
export const logoutUser = () => handleRequest(() => api.post("/api/auth/logout"));
