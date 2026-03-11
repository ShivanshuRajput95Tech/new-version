import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  MessageCircle,
  Zap,
  Users,
  ArrowRight,
  Sparkles,
  Star,
  Heart
} from "lucide-react";

const HERO_TEXT =
  "Swift Chat: Instant Connections, Effortless Conversations";

const floatingAnimation = {
  duration: 15,
  repeat: Infinity,
  ease: "easeInOut"
};

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const [displayText, setDisplayText] = useState("");

  /* Typing effect */

  useEffect(() => {
    let i = 0;

    const timer = setInterval(() => {
      setDisplayText(HERO_TEXT.slice(0, i + 1));
      i++;

      if (i >= HERO_TEXT.length) clearInterval(timer);
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const cta = isAuthenticated
    ? {
        link: "/chathome",
        label: "Open Chat",
        icon: MessageCircle,
        style:
          "from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500"
      }
    : {
        link: "/login",
        label: "Get Started",
        icon: ArrowRight,
        style:
          "from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
      };

  const CTAIcon = cta.icon;

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], rotate: [0, 360] }}
          transition={floatingAnimation}
          className="absolute top-20 left-20 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl flex items-center justify-center"
        >
          <MessageCircle className="w-8 h-8 text-indigo-400" />
        </motion.div>

        <motion.div
          animate={{ x: [0, -35, 0], y: [0, 25, 0], scale: [1, 1.2, 1] }}
          transition={{ ...floatingAnimation, delay: 2 }}
          className="absolute bottom-32 right-32 w-20 h-20 bg-purple-500/15 rounded-full blur-xl flex items-center justify-center"
        >
          <Users className="w-10 h-10 text-purple-400" />
        </motion.div>

        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], rotate: [0, -360] }}
          transition={{ ...floatingAnimation, delay: 4 }}
          className="absolute top-1/2 left-1/4 w-12 h-12 bg-green-500/20 rounded-full blur-xl flex items-center justify-center"
        >
          <Zap className="w-6 h-6 text-green-400" />
        </motion.div>

      </div>

      {/* Content */}

      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:grid-cols-12 relative z-10">

        {/* Left Content */}

        <motion.div
          className="mr-auto lg:col-span-7"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <div className="flex items-center gap-2 mb-6 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-600/30 w-fit">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-slate-300">
              Professional Chat Experience
            </span>
          </div>

          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold md:text-5xl xl:text-6xl">
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

          <p className="max-w-2xl mb-8 text-slate-400 md:text-lg">
            Connect seamlessly and elevate your communication with real-time
            messaging, file sharing, and collaboration tools inspired by
            <span className="text-indigo-400 font-semibold">
              {" "}Slack, Telegram, and WhatsApp.
            </span>
          </p>

          {/* CTA */}

          <div className="flex flex-col sm:flex-row gap-4">

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={cta.link}
                className={`inline-flex items-center px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r ${cta.style}`}
              >
                {cta.label}
                <CTAIcon className="w-5 h-5 ml-3" />
              </Link>
            </motion.div>

            {!isAuthenticated && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-slate-300 border border-slate-600 rounded-2xl hover:bg-slate-800"
                >
                  Sign Up Free
                  <Sparkles className="w-5 h-5 ml-3" />
                </Link>
              </motion.div>
            )}

          </div>

        </motion.div>

      </div>

    </section>
  );
};

export default Hero;