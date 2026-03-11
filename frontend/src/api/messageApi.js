import api from "./axios";

export const getMessages = async (userId) => {
  if (!userId) throw new Error("User ID is required to fetch messages");

  const res = await api.get(`/api/messages/${userId}`);
  return res.data;
};
