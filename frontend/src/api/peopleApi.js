import api from "./axios";

export const getPeople = async () => {
  const res = await api.get("/api/people");
  return res.data;
};
