import api from "./axios";

/* -------- Generic API handler -------- */

const handleRequest = async(request, defaultMessage) => {
    try {
        const { data } = await request();
        return data;
    } catch (error) {
        let message = defaultMessage;

        const responseData = error ? .response ? .data;

        if (responseData) {
            if (typeof responseData === "object" && responseData.message) {
                message = responseData.message;
            } else if (typeof responseData === "string") {
                message = responseData;
            }
        } else if (error ? .message) {
            message = error.message;
        }

        console.error(defaultMessage + ":", message);
        throw new Error(message);
    }
};

/* ---------------- GET GROUPS ---------------- */

export const getGroups = () =>
    handleRequest(
        () => api.get("/api/group"),
        "Failed to fetch groups"
    );

/* ---------------- CREATE GROUP ---------------- */

export const createGroup = (data) =>
    handleRequest(
        () => api.post("/api/group", data),
        "Failed to create group"
    );