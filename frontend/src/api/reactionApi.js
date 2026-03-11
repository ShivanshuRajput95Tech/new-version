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

        console.error(`${defaultMessage}:`, message);
        throw new Error(message);
    }
};

/* ---------------- ADD REACTION ---------------- */

export const addReaction = async(messageId, emoji) => {
    if (!messageId || !emoji) {
        throw new Error("Message ID and emoji are required");
    }

    return handleRequest(
        () =>
        api.post("/api/user/reaction", {
            messageId,
            emoji,
        }),
        "Failed to add reaction"
    );
};