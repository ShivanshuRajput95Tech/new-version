// apiConfig.js
let baseUrl;
let socketUrl;

// Determine environment
const isProd = import.meta.env.MODE === 'production';

if (isProd) {
    // Production URLs from environment variables
    baseUrl = import.meta.env.VITE_API_URL || "https://your-deployed-app.herokuapp.com";
    socketUrl = import.meta.env.VITE_SOCKET_URL || "https://your-deployed-app.herokuapp.com";
} else {
    // Development URLs
    baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";
}

// Remove trailing slashes
baseUrl = baseUrl.replace(/\/$/, '');
socketUrl = socketUrl.replace(/\/$/, '');

console.log(`🌐 API Config - Mode: ${import.meta.env.MODE}, Base URL: ${baseUrl}`);

export { baseUrl, socketUrl };