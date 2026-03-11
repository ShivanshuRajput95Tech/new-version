import api from "./axios";

/* -------- Generic request handler -------- */

const handleRequest = async(request, defaultMessage) => {
    try {
        const { data } = await request();
        return data;
    } catch (error) {
        const message =
            error ? .response ? .data ? .message ||
            (typeof error ? .response ? .data === "string" && error.response.data) ||
            error ? .message ||
            defaultMessage;

        console.error(defaultMessage + ":", message);
        throw new Error(message);
    }
};

/* ---------------- GET MESSAGES ---------------- */

export const getMessages = async(userId) => {
    if (!userId) {
        throw new Error("User ID is required to fetch messages");
    }

    return handleRequest(
        () => api.get(`/api/user/messages/${userId}`),
        "Failed to fetch messages"
    );
};