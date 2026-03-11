import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Users,
  MessageCircle,
  TrendingUp,
  Clock,
  BarChart3,
  DollarSign,
  Activity,
  Zap,
  Star,
  Heart,
  Sparkles
} from "lucide-react";

const Developer = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({});
  const [revenue, setRevenue] = useState(0);
  const [researchData, setResearchData] = useState([]);

  useEffect(() => {
    // Mock data for demonstration
    setUserStats({
      totalUsers: 1250,
      activeUsers: 890,
      messagesSent: 45670,
      avgSessionTime: "24m 32s"
    });
    setRevenue(15420.50);
    setResearchData([
      { feature: "Real-time Messaging", usage: 95, feedback: 4.8 },
      { feature: "File Sharing", usage: 78, feedback: 4.6 },
      { feature: "Voice Calls", usage: 45, feedback: 4.3 },
      { feature: "Status Updates", usage: 67, feedback: 4.7 }
    ]);
  }, []);

  const handleGenerateRevenue = () => {
    // Mock revenue generation
    setRevenue(prev => prev + Math.random() * 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.06),transparent_50%)] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)] animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -35, 0],
            y: [0, 25, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-green-500/8 to-blue-500/8 rounded-full blur-xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 text-indigo-400" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Developer Dashboard
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Monitor your application's performance and user engagement metrics
          </p>
        </motion.div>

        {/* User Info Section */}
        <motion.div
          className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 mb-8 shadow-2xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-semibold text-white">User Analytics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-blue-400" />
                <div className="text-2xl font-bold text-blue-400">{userStats.totalUsers?.toLocaleString()}</div>
              </div>
              <div className="text-sm text-slate-400">Total Users</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-5 h-5 text-green-400" />
                <div className="text-2xl font-bold text-green-400">{userStats.activeUsers?.toLocaleString()}</div>
              </div>
              <div className="text-sm text-slate-400">Active Users</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-5 h-5 text-purple-400" />
                <div className="text-2xl font-bold text-purple-400">{userStats.messagesSent?.toLocaleString()}</div>
              </div>
              <div className="text-sm text-slate-400">Messages Sent</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <div className="text-2xl font-bold text-yellow-400">{userStats.avgSessionTime}</div>
              </div>
              <div className="text-sm text-slate-400">Avg Session Time</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Revenue Generation Section */}
        <motion.div
          className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 mb-8 shadow-2xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Revenue Generation</h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-green-400">${revenue.toFixed(2)}</div>
              <div className="text-sm text-gray-400">Total Revenue</div>
            </div>
            <button
              onClick={handleGenerateRevenue}
              className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
            >
              Generate Revenue
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-700 p-4 rounded-lg">
              <div className="text-xl font-bold text-blue-400">$2,450</div>
              <div className="text-sm text-gray-400">Premium Subscriptions</div>
            </div>
            <div className="bg-zinc-700 p-4 rounded-lg">
              <div className="text-xl font-bold text-purple-400">$8,970</div>
              <div className="text-sm text-gray-400">Ad Revenue</div>
            </div>
            <div className="bg-zinc-700 p-4 rounded-lg">
              <div className="text-xl font-bold text-yellow-400">$3,000</div>
              <div className="text-sm text-gray-400">Affiliate Sales</div>
            </div>
          </div>
        </motion.div>

        {/* Research & Analytics Section */}
        <motion.div
          className="bg-zinc-800 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Research & Analytics</h2>
          <div className="space-y-4">
            {researchData.map((item, index) => (
              <motion.div
                key={index}
                className="bg-zinc-700 p-4 rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{item.feature}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Usage: {item.usage}%</span>
                    <span className="text-sm text-yellow-400">⭐ {item.feedback}</span>
                  </div>
                </div>
                <div className="w-full bg-zinc-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${item.usage}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* API Testing Section */}
        <motion.div
          className="bg-zinc-800 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-semibold mb-4">API Testing Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Test Endpoints</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>GET /api/messages</span>
                  <span className="text-green-400">✅ 200 OK</span>
                </div>
                <div className="flex justify-between">
                  <span>POST /api/messages</span>
                  <span className="text-green-400">✅ 201 Created</span>
                </div>
                <div className="flex justify-between">
                  <span>GET /api/user/people</span>
                  <span className="text-green-400">✅ 200 OK</span>
                </div>
              </div>
            </div>
            <div className="bg-zinc-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">WebSocket Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Connection</span>
                  <span className="text-green-400">🟢 Connected</span>
                </div>
                <div className="flex justify-between">
                  <span>Ping/Pong</span>
                  <span className="text-green-400">✅ Working</span>
                </div>
                <div className="flex justify-between">
                  <span>Message Delivery</span>
                  <span className="text-green-400">✅ Real-time</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
          <div className="bg-zinc-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">API Usage</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Messages API</span>
                <span className="text-green-400">12,450 calls</span>
              </div>
              <div className="flex justify-between">
                <span>Users API</span>
                <span className="text-blue-400">8,920 calls</span>
              </div>
              <div className="flex justify-between">
                <span>WebSocket Connections</span>
                <span className="text-purple-400">1,245 active</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">System Health</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Server Uptime</span>
                <span className="text-green-400">99.9%</span>
              </div>
              <div className="flex justify-between">
                <span>Database Performance</span>
                <span className="text-blue-400">Excellent</span>
              </div>
              <div className="flex justify-between">
                <span>Cache Hit Rate</span>
                <span className="text-purple-400">94.2%</span>
              </div>
            </div>
          </div>

        {/* Feature Research & Development */}
        <motion.div
          className="bg-zinc-800 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Feature Research & Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🚀 In Development</h3>
              <ul className="text-sm space-y-1">
                <li>• Video Calling</li>
                <li>• Screen Sharing</li>
                <li>• Message Encryption</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-teal-600 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">📊 Analytics</h3>
              <ul className="text-sm space-y-1">
                <li>• User Engagement</li>
                <li>• Feature Usage</li>
                <li>• Performance Metrics</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-yellow-600 to-orange-600 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🔬 Research</h3>
              <ul className="text-sm space-y-1">
                <li>• AI Chat Bots</li>
                <li>• Voice Commands</li>
                <li>• AR Filters</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Developer;