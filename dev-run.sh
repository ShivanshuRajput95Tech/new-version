#!/bin/bash

# Chat App Development Runner
# This script starts both the frontend and backend servers for development

echo "🚀 Starting Chat App Development Environment"
echo "==========================================="

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start backend server in background
echo "📡 Starting backend server..."
cd server
node local-server.js &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server in background
echo "🌐 Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for both to start
sleep 5

echo ""
echo "✅ Development servers started!"
echo "📡 Backend: http://localhost:4000"
echo "🌐 Frontend: http://localhost:5173"
echo "❤️  Health check: http://localhost:4000/api/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
wait