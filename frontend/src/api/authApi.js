import api from "./axios";

/* --------- Generic request handler --------- */

const handleRequest = async(request) => {
    try {
        const { data } = await request();
        return data;
    } catch (error) {
        const message =
            error ? .response ? .data ? .message ||
            error ? .message ||
            "API request failed";

        console.error("API Error:", message);
        throw new Error(message);
    }
};

/* ---------------- AUTH ---------------- */

export const loginUser = (data) =>
    handleRequest(() => api.post("/api/user/login", data));

export const registerUser = (data) =>
    handleRequest(() => api.post("/api/user/register", data));

/* ---------------- PROFILE ---------------- */

export const getProfile = () =>
    handleRequest(() => api.get("/api/user/profile"));