/* =========================
   Environment
========================= */

const ENV =
    import.meta.env

const DEFAULT_LOCAL_URL = "http://localhost:4000"

/* =========================
   API / Socket URLs
========================= */

export const API_BASE_URL =
    ENV.VITE_API_URL ? .trim() || DEFAULT_LOCAL_URL

export const SOCKET_URL =
    ENV.VITE_SOCKET_URL ? .trim() || API_BASE_URL


/* =========================
   App Info
========================= */

export const APP = Object.freeze({
    NAME: "SwiftChat",
    VERSION: "1.0.0"
})


/* =========================
   UI Colors
========================= */

export const COLORS = Object.freeze({
    primary: "bg-indigo-600",
    primaryHover: "hover:bg-indigo-700",

    secondary: "bg-slate-800",
    secondaryHover: "hover:bg-slate-700",

    success: "bg-green-600",
    successHover: "hover:bg-green-700",

    danger: "bg-red-600",
    dangerHover: "hover:bg-red-700"
})


/* =========================
   Message Types
========================= */

export const MESSAGE_TYPES = Object.freeze({
    TEXT: "text",
    IMAGE: "image",
    FILE: "file",
    SYSTEM: "system"
})


/* =========================
   Chat Types
========================= */

export const CHAT_TYPES = Object.freeze({
    DIRECT: "direct",
    GROUP: "group"
})


/* =========================
   Socket Events
========================= */

export const SOCKET_EVENTS = Object.freeze({
    CONNECT: "connect",
    DISCONNECT: "disconnect",

    SEND_MESSAGE: "sendMessage",
    RECEIVE_MESSAGE: "receiveMessage",

    USER_TYPING: "userTyping",
    USER_STOP_TYPING: "userStopTyping",

    ONLINE_USERS: "onlineUsers"
})


/* =========================
   Local Storage Keys
========================= */

export const STORAGE_KEYS = Object.freeze({
    USER: "swiftchat_user",
    TOKEN: "swiftchat_token",
    THEME: "swiftchat_theme"
})


/* =========================
   Pagination
========================= */

export const PAGINATION = Object.freeze({
    MESSAGES_PER_PAGE: 20,
    USERS_PER_PAGE: 50
})


/* =========================
   Timing Config
========================= */

export const TIMERS = Object.freeze({
    TYPING_INDICATOR_MS: 3000,
    RECONNECT_DELAY_MS: 2000
})