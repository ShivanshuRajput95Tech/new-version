const express = require("express");

const router = express.Router();

router.get("/review", (_req, res) => {
  res.json({
    product: "Real-time Chat SaaS Platform",
    positioning: "Stripe-for-chat infrastructure for multi-tenant applications",
    frontend: {
      focus: [
        "Tenant-aware dashboard UX",
        "SDK-first integration docs",
        "Channels, threads, and moderation controls",
        "Usage analytics and billing visibility",
      ],
      stack: ["React", "Tailwind", "Socket.IO client", "Axios API client"],
    },
    backend: {
      architecture: [
        "API Gateway",
        "Auth Service",
        "Chat Service",
        "Presence Service",
        "Notification Service",
      ],
      data: ["PostgreSQL", "Redis cache", "Message queue (Kafka/RabbitMQ)", "Object storage for media"],
      requirements: [
        "Tenant isolation (tenant_id scoped data)",
        "Token-based API access + RBAC",
        "Rate limiting and moderation hooks",
        "Horizontal websocket scaling",
      ],
    },
    mvp: [
      "Authentication",
      "Realtime messaging",
      "Channels",
      "Message persistence",
      "Basic dashboard",
      "Public API + JS SDK",
    ],
  });
});

router.get("/project", (_req, res) => {
  res.json({
    name: "Connected Chat SaaS Prototype",
    status: "active",
    modules: [
      { name: "Auth", owner: "backend", endpoint: "/api/auth/me", status: "ready" },
      { name: "People", owner: "backend", endpoint: "/api/people", status: "ready" },
      { name: "Messaging", owner: "backend", endpoint: "/api/messages/:userId", status: "ready" },
      { name: "Platform Review", owner: "fullstack", endpoint: "/api/platform/review", status: "ready" },
      { name: "Platform Project", owner: "fullstack", endpoint: "/api/platform/project", status: "ready" },
      { name: "Developer UI", owner: "frontend", endpoint: "/developer", status: "ready" },
    ],
    roadmap: [
      "Add tenant CRUD and API key management",
      "Add channel CRUD endpoints",
      "Add usage metering + billing reports",
      "Add webhook delivery + retries",
    ],
  });
});

module.exports = router;
