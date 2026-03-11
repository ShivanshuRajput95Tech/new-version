import { API_BASE_URL } from "../constants";

const API_URL = `${API_BASE_URL}/api`;

const request = async(endpoint, options = {}) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    });

    return res.json();
};

export const registerUser = async(data) => {
    return request("/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
    });
};

export const loginUser = async(data) => {
    return request("/auth/login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data)
    });
};

export const getUnreadCounts = async() => {
    return request("/messages/unread/counts", {
        method: "GET",
        credentials: "include"
    });
};

export const uploadImage = async(file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_URL}/upload/image`, {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            throw new Error("Upload failed");
        }

        return res.json();
    } catch (err) {
        console.error("Upload error:", err);
    }
};