import api from "./axios";

export const fetchPeople = async () => {
  const { data } = await api.get("/api/people");
  return data;
};

export const fetchMessages = async (userId) => {
  const { data } = await api.get(`/api/messages/${userId}`);
  return data;
};

export const createMessage = async (payload) => {
  const { data } = await api.post("/api/messages", payload);
  return data;
};
