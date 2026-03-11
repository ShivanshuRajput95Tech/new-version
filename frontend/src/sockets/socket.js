import { io } from "socket.io-client"
import { SOCKET_URL, API_BASE_URL } from "../constants"

let socket = null
let currentToken = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5

/**
 * Connect Socket.io with authentication token
 * @param {string} token - JWT authentication token
 * @returns {Object} Socket instance
 */
export const connectSocket = (token) => {
    if (!token) {
        console.warn("❌ Socket connection skipped: missing token")
        return socket
    }

    // Reuse existing connection if token hasn't changed
    if (socket?.connected && currentToken === token) {
        console.log("♻️  Reusing existing socket connection")
        return socket
    }

    // Disconnect previous connection
    if (socket) {
        console.log("🔄 Disconnecting previous socket connection...")
        socket.removeAllListeners()
        socket.disconnect()
        socket = null
    }

    currentToken = token
    reconnectAttempts = 0

    console.log(`🔗 Connecting to Socket.io at: ${SOCKET_URL}`)

    socket = io(SOCKET_URL || API_BASE_URL, {
        autoConnect: true,
        withCredentials: true,
        auth: { token },
        reconnection: true,
        reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        transports: ["websocket", "polling"]
    })

    // Connection successful
    socket.on("connect", () => {
        console.log("✅ Socket connected - ID:", socket.id)
        reconnectAttempts = 0
    })

    // Connection failed
    socket.on("disconnect", (reason) => {
        console.warn("⚠️  Socket disconnected - Reason:", reason)
    })

    // Reconnection attempt
    socket.on("reconnect_attempt", () => {
        reconnectAttempts++
        console.log(`🔄 Reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`)
    })

    // Reconnection successful
    socket.on("reconnect", () => {
        console.log("✅ Socket reconnected after failure")
        reconnectAttempts = 0
    })

    // Connection error
    socket.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error.message)
    })

    // Generic error handler
    socket.on("error", (error) => {
        console.error("❌ Socket error:", error)
    })

    return socket
}

/**
 * Get current socket instance
 * @returns {Object|null} Socket instance or null
 */
export const getSocket = () => socket

/**
 * Check if socket is connected
 * @returns {boolean} Connection status
 */
export const isSocketConnected = () => {
    return socket?.connected || false
}

/**
 * Emit event with loading state (interactive)
 * @param {string} event - Event name
 * @param {Object} data - Event data
 * @param {Function} callback - Callback function
 */
export const emitEvent = (event, data = {}, callback) => {
    if (!socket?.connected) {
        console.warn(`⚠️  Socket not connected. Cannot emit event: ${event}`)
        if (callback) callback({ error: "Socket not connected" })
        return
    }

    console.log(`📤 Emitting event: ${event}`, data)
    
    if (callback) {
        socket.emit(event, data, callback)
    } else {
        socket.emit(event, data)
    }
}

/**
 * Listen to socket event
 * @param {string} event - Event name
 * @param {Function} callback - Callback function
 */
export const onEvent = (event, callback) => {
    if (!socket) {
        console.warn(`⚠️  Socket not initialized. Cannot listen to: ${event}`)
        return
    }

    console.log(`📥 Listening to event: ${event}`)
    socket.on(event, callback)
}

/**
 * Stop listening to socket event
 * @param {string} event - Event name
 * @param {Function} callback - Callback function
 */
export const offEvent = (event, callback) => {
    if (!socket) return
    socket.off(event, callback)
}

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
    if (!socket) return

    console.log("🔌 Disconnecting socket...")
    socket.removeAllListeners()
    socket.disconnect()

    socket = null
    currentToken = null
    reconnectAttempts = 0

    console.log("✅ Socket manually disconnected")
}