import { memo } from "react";
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
  Star
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Real-time Messaging",
    description:
      "Instant messaging with typing indicators, read receipts, and message reactions like WhatsApp and Telegram.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: FileText,
    title: "File Sharing & Media",
    description:
      "Share images, videos, documents, and voice messages with drag-and-drop functionality.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Users,
    title: "Channels & Groups",
    description:
      "Create public channels and private groups for team collaboration, inspired by Slack.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Shield,
    title: "End-to-End Encryption",
    description:
      "Secure messaging with encryption, ensuring privacy like WhatsApp's standards.",
    color: "from-red-500 to-orange-500"
  },
  {
    icon: Bot,
    title: "Bots & Integrations",
    description:
      "Integrate with third-party services and use bots for automation, Telegram-style.",
    color: "from-yellow-500 to-amber-500"
  },
  {
    icon: Search,
    title: "Advanced Search & Threads",
    description:
      "Powerful search across messages and threaded conversations for better organization.",
    color: "from-indigo-500 to-blue-500"
  },
  {
    icon: Phone,
    title: "Voice & Video Calls",
    description:
      "High-quality voice and video calling for seamless communication.",
    color: "from-teal-500 to-green-500"
  },
  {
    icon: Activity,
    title: "Status Updates",
    description:
      "Share your status, availability, and updates with friends and colleagues.",
    color: "from-pink-500 to-rose-500"
  }
];

const cardAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 }
};

function Features() {
  return (
    <section className="py-20 px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl"
        />

        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 25, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-green-500/8 to-blue-500/8 rounded-full blur-2xl"
        />

      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}

        <motion.div
          {...cardAnimation}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >

          <div className="inline-flex items-center gap-2 bg-slate-800/50 px-6 py-3 rounded-full border border-slate-600/30 mb-6">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span className="text-slate-300 font-medium">
              Powerful Features
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Everything You Need
            </span>
          </h2>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Experience modern communication inspired by the best messaging platforms.
          </p>

        </motion.div>

        {/* Features */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                {...cardAnimation}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative"
              >

                <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 h-full transition-all duration-300">

                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4`}
                  >
                    <Icon className="w-full h-full text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-300">
                    {feature.title}
                  </h3>

                  <p className="text-slate-400 group-hover:text-slate-300">
                    {feature.description}
                  </p>

                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}
                  />

                </div>

              </motion.div>
            );
          })}

        </div>

        {/* CTA */}

        <div className="text-center mt-16">

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 rounded-2xl text-white font-semibold text-lg shadow-2xl"
          >
            <Globe className="w-5 h-5" />
            Explore All Features
            <Star className="w-5 h-5" />
          </motion.button>

        </div>

      </div>
    </section>
  );
}

export default memo(Features);