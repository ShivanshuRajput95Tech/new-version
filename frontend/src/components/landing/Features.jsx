import React from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  FileText,
  Users,
  Shield,
  Bot,
  Search,
  Phone,
  Activity,
  Zap,
  Globe,
  Star,
  Heart
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Real-time Messaging",
      description: "Instant messaging with typing indicators, read receipts, and message reactions like WhatsApp and Telegram.",
      color: "from-blue-500 to-cyan-500",
      iconColor: "text-blue-400"
    },
    {
      icon: FileText,
      title: "File Sharing & Media",
      description: "Share images, videos, documents, and voice messages with drag-and-drop functionality.",
      color: "from-green-500 to-emerald-500",
      iconColor: "text-green-400"
    },
    {
      icon: Users,
      title: "Channels & Groups",
      description: "Create public channels and private groups for team collaboration, inspired by Slack.",
      color: "from-purple-500 to-pink-500",
      iconColor: "text-purple-400"
    },
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Secure messaging with encryption, ensuring privacy like WhatsApp's standards.",
      color: "from-red-500 to-orange-500",
      iconColor: "text-red-400"
    },
    {
      icon: Bot,
      title: "Bots & Integrations",
      description: "Integrate with third-party services and use bots for automation, Telegram-style.",
      color: "from-yellow-500 to-amber-500",
      iconColor: "text-yellow-400"
    },
    {
      icon: Search,
      title: "Advanced Search & Threads",
      description: "Powerful search across messages and threaded conversations for better organization.",
      color: "from-indigo-500 to-blue-500",
      iconColor: "text-indigo-400"
    },
    {
      icon: Phone,
      title: "Voice & Video Calls",
      description: "High-quality voice and video calling for seamless communication.",
      color: "from-teal-500 to-green-500",
      iconColor: "text-teal-400"
    },
    {
      icon: Activity,
      title: "Status Updates",
      description: "Share your status, availability, and updates with friends and colleagues.",
      color: "from-pink-500 to-rose-500",
      iconColor: "text-pink-400"
    }
  ];

  return (
    <section className="py-20 px-4 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 25, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-green-500/8 to-blue-500/8 rounded-full blur-2xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-600/30 mb-6"
          >
            <Zap className="w-5 h-5 text-indigo-400" />
            <span className="text-slate-300 font-medium">Powerful Features</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Everything You Need
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Experience the perfect blend of modern communication features inspired by the best messaging platforms
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative"
              >
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 h-full hover:border-slate-600/50 transition-all duration-300 shadow-xl hover:shadow-2xl">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:shadow-lg transition-all duration-300`}
                  >
                    <IconComponent className="w-full h-full text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 rounded-2xl text-white font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 cursor-pointer"
          >
            <Globe className="w-5 h-5" />
            Explore All Features
            <Star className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;