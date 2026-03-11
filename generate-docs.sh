#!/bin/bash

OUTPUT_FILE="CODE_DOCUMENTATION.md"
WORKSPACE="/workspaces/Chat_appV1.2"

# Start documentation
cat > "$OUTPUT_FILE" << 'DOCSTART'
# Chat App V1.2 - Complete Code Documentation

**Generated:** March 10, 2026  
**Project:** Chat Application - Full Stack (Node.js + React)  
**Repository:** Chat_appV1.2

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Structure](#architecture--structure)
3. [Server Documentation](#server-documentation)
4. [Frontend Documentation](#frontend-documentation)
5. [API Endpoints](#api-endpoints)
6. [Environment Configuration](#environment-configuration)
7. [Setup & Deployment](#setup--deployment)

---

## Project Overview

Chat App V1.2 is a full-stack real-time chat application built with:
- **Frontend:** React 18+ with Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Cache:** Redis
- **Real-time Communication:** WebSocket
- **Authentication:** JWT

**Key Features:**
- User authentication & registration
- Real-time messaging
- Online user presence
- Message reactions & interactions
- Profile management
- Avatar selection
- Group chat support

---

## Architecture & Structure

### Directory Layout

\`\`\`
Chat_appV1.2/
├── frontend/                    # React application
│   ├── src/
│   │   ├── api/               # API integration layer
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React context for state
│   │   ├── store/             # State management (Zustand/Redux)
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utility functions
│   │   ├── styles/            # CSS/Tailwind
│   │   └── sockets/           # WebSocket client
│   └── package.json
│
├── server/                      # Node.js backend
│   ├── controllers/            # Request handlers
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── middleware/             # Express middleware
│   ├── services/               # Business logic
│   ├── sockets/                # WebSocket server
│   ├── config/                 # Configuration files
│   └── package.json
│
├── .env                        # Environment variables
├── Procfile                    # Deployment configuration
└── README.md                   # Project documentation

\`\`\`

DOCSTART

# Add server code structure
echo -e "\n## Server Documentation\n" >> "$OUTPUT_FILE"
echo "### Server Entry Point" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "\`\`\`javascript" >> "$OUTPUT_FILE"
cat "$WORKSPACE/server/server.js" 2>/dev/null | head -100 >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"

# Add all server controllers
echo -e "\n### Controllers\n" >> "$OUTPUT_FILE"
for file in "$WORKSPACE/server/controllers"/*.js; do
    if [ -f "$file" ]; then
        echo "#### $(basename "$file")" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "\`\`\`javascript" >> "$OUTPUT_FILE"
        head -50 "$file" >> "$OUTPUT_FILE"
        echo "\n... [file continues] ..." >> "$OUTPUT_FILE"
        echo "\`\`\`" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
done

# Add server models
echo -e "\n### Database Models\n" >> "$OUTPUT_FILE"
for file in "$WORKSPACE/server/models"/*.js; do
    if [ -f "$file" ]; then
        echo "#### $(basename "$file")" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "\`\`\`javascript" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo "\`\`\`" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
done

# Add routes documentation
echo -e "\n### API Routes\n" >> "$OUTPUT_FILE"
for file in "$WORKSPACE/server/routes"/*.js; do
    if [ -f "$file" ]; then
        echo "#### $(basename "$file")" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "\`\`\`javascript" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo "\`\`\`" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
done

# Add middleware
echo -e "\n### Middleware\n" >> "$OUTPUT_FILE"
for file in "$WORKSPACE/server/middleware"/*.js; do
    if [ -f "$file" ]; then
        echo "#### $(basename "$file")" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "\`\`\`javascript" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo "\`\`\`" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
done

# Add frontend components
echo -e "\n## Frontend Documentation\n" >> "$OUTPUT_FILE"
echo "### React Components\n" >> "$OUTPUT_FILE"

# Main pages
echo "#### Pages\n" >> "$OUTPUT_FILE"
for file in "$WORKSPACE/frontend/src/pages"/*.jsx; do
    if [ -f "$file" ]; then
        echo "**$(basename "$file")**" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "\`\`\`jsx" >> "$OUTPUT_FILE"
        head -80 "$file" >> "$OUTPUT_FILE"
        echo "\n... [component continues] ..." >> "$OUTPUT_FILE"
        echo "\`\`\`" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
done

# UI Components
echo -e "\n#### UI Components\n" >> "$OUTPUT_FILE"
for file in "$WORKSPACE/frontend/src/components/chat"/*.jsx; do
    if [ -f "$file" ]; then
        echo "**$(basename "$file")**" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "\`\`\`jsx" >> "$OUTPUT_FILE"
        head -60 "$file" >> "$OUTPUT_FILE"
        echo "\n... [component continues] ..." >> "$OUTPUT_FILE"
        echo "\`\`\`" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
done

# API layer
echo -e "\n### API Layer\n" >> "$OUTPUT_FILE"
for file in "$WORKSPACE/frontend/src/api"/*.js; do
    if [ -f "$file" ]; then
        echo "#### $(basename "$file")" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "\`\`\`javascript" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo "\`\`\`" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
done

# Environment
echo -e "\n## Environment Configuration\n" >> "$OUTPUT_FILE"
echo "### .env File (Development Template)\n" >> "$OUTPUT_FILE"
echo "\`\`\`bash" >> "$OUTPUT_FILE"
cat "$WORKSPACE/.env" 2>/dev/null >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"

# Deployment info
echo -e "\n## Setup & Deployment\n" >> "$OUTPUT_FILE"
echo "### Prerequisites\n" >> "$OUTPUT_FILE"
cat >> "$OUTPUT_FILE" << 'DEPLOY'

- Node.js >= 14.0.0
- npm >= 6.0.0
- MongoDB instance or MongoDB Atlas account
- Redis server
- SMTP credentials (optional, for email features)

### Installation

\`\`\`bash
# Install dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
\`\`\`

### Development Setup

\`\`\`bash
npm run dev
\`\`\`

### Building for Production

\`\`\`bash
# Build frontend
cd frontend && npm run build

# Build server (if applicable)
cd server && npm run build
\`\`\`

### Environment Variables Required

- `NODE_ENV`: Development or production
- `PORT`: Server port (default: 4000)
- `DB`: MongoDB connection string
- `JWTPRIVATEKEY`: JWT secret key
- `REDIS_URL`: Redis connection URL
- `BASE_URL`: Frontend base URL
- SMTP credentials for email service

### Deployment Options

1. **Netlify** (Frontend only)
2. **Railway** (Full-stack)
3. **Heroku** (Legacy, using Procfile)
4. **Custom VPS** (Docker supported)

DEPLOY

echo "Documentation generated successfully!"
echo "Output file: $OUTPUT_FILE"
wc -l "$OUTPUT_FILE"
