import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MessageCircle, Zap, Users, Shield, ArrowRight, Sparkles, Star, Heart } from "lucide-react";

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const [displayText, setDisplayText] = useState("");
  const fullText = "Swift Chat: Instant Connections, Effortless Conversations";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
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
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl flex items-center justify-center"
        >
          <MessageCircle className="w-8 h-8 text-indigo-400" />
        </motion.div>

        <motion.div
          animate={{
            x: [0, -35, 0],
            y: [0, 25, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 right-32 w-20 h-20 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-xl flex items-center justify-center"
        >
          <Users className="w-10 h-10 text-purple-400" />
        </motion.div>

        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-xl flex items-center justify-center"
        >
          <Zap className="w-6 h-6 text-green-400" />
        </motion.div>

        {/* Interactive Elements */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-32 right-20 p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-full backdrop-blur-sm border border-slate-600/30"
        >
          <Star className="w-5 h-5 text-yellow-400" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            y: [0, 10, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 left-32 p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-full backdrop-blur-sm border border-slate-600/30"
        >
          <Heart className="w-5 h-5 text-pink-400" />
        </motion.button>
      </div>

      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 relative z-10">
        <motion.div
          className="mr-auto place-self-center lg:col-span-7"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-600/30">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-slate-300">Professional Chat Experience</span>
            </div>
          </motion.div>

          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {displayText}
            </span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-indigo-400"
            >
              |
            </motion.span>
          </h1>

          <motion.p
            className="max-w-2xl mb-8 font-light text-slate-400 lg:mb-10 md:text-lg lg:text-xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            Connect Seamlessly, Chat Effortlessly: Elevate Your Communication with Our
            <span className="text-indigo-400 font-semibold"> Intuitive Chat Application </span>
            featuring real-time messaging, file sharing, and advanced features inspired by
            <span className="text-purple-400 font-semibold"> Slack, Telegram, and WhatsApp</span>!
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
            {!isAuthenticated && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-center text-white rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:ring-4 focus:ring-indigo-500/25 transform transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Link>
              </motion.div>
            )}
            {isAuthenticated && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/chathome"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-center text-white rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 focus:ring-4 focus:ring-green-500/25 transform transition-all duration-300 shadow-2xl hover:shadow-green-500/25"
                >
                  Open Chat
                  <MessageCircle className="w-5 h-5 ml-3" />
                </Link>
              </motion.div>
            )}
            {!isAuthenticated && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-center text-slate-300 border-2 border-slate-600/50 rounded-2xl hover:bg-slate-800/50 hover:border-slate-500/50 focus:ring-4 focus:ring-slate-500/25 backdrop-blur-sm transform transition-all duration-300"
                >
                  Sign Up Free
                  <Sparkles className="w-5 h-5 ml-3" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:mt-0 lg:col-span-5 lg:flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="relative">
            {/* Demo Chat Bubble */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-2xl p-4 max-w-sm">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">S</div>
                <span className="ml-2 text-sm font-medium">Swift Chat Demo</span>
              </div>
              <div className="space-y-2">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg text-sm">
                  Welcome to Swift Chat! 🚀
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-sm text-right">
                  Amazing features! ✨
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg text-sm">
                  Real-time messaging, file sharing, and more!
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💬
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              📎
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;