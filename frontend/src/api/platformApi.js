import api from "./axios";

export const fetchPlatformReview = async () => {
  const { data } = await api.get("/api/platform/review");
  return data;
};

export const fetchPlatformProject = async () => {
  const { data } = await api.get("/api/platform/project");
  return data;
};
