import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Heart,
  Star,
  Wifi,
  Database,
  MessageCircle,
  Users,
  Shield,
  Rocket
} from "lucide-react";

const LoadingPage = ({
  message = "Loading your experience...",
  progress = null,
  variant = "default",
  size = "large"
}) => {

  const [currentStep, setCurrentStep] = useState(0)
  const [tipIndex, setTipIndex] = useState(0)

  const loadingSteps = [
    { icon: Wifi, text: "Connecting to servers...", color: "text-blue-400" },
    { icon: Database, text: "Loading your data...", color: "text-green-400" },
    { icon: Shield, text: "Securing connection...", color: "text-purple-400" },
    { icon: MessageCircle, text: "Preparing chat interface...", color: "text-indigo-400" },
    { icon: Users, text: "Syncing contacts...", color: "text-pink-400" },
    { icon: Rocket, text: "Launching your experience...", color: "text-orange-400" }
  ]

  const tips = [
    "Real-time messaging powered by WebSockets",
    "Messages sync instantly across devices",
    "End-to-end encryption keeps chats private",
    "SwiftChat supports reactions and threads"
  ]

  /* Particle generation (stable) */

  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.3
    }))
  }, [])

  /* Loading steps animation */

  useEffect(() => {
    if (variant !== "detailed") return

    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % loadingSteps.length)
    }, 1200)

    return () => clearInterval(interval)

  }, [variant])

  /* Rotate tips */

  useEffect(() => {

    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length)
    }, 4000)

    return () => clearInterval(interval)

  }, [])

  const sizeClasses = {
    small: "w-32 h-32",
    medium: "w-48 h-48",
    large: "w-64 h-64"
  }

  const renderLoadingAnimation = () => {

    switch (variant) {

      case "pulse":
        return (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
        )

      case "dots":
        return (
          <div className="flex gap-2">
            {[0,1,2].map(i => (
              <motion.div
                key={i}
                animate={{ y: [0,-15,0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                className="w-3 h-3 bg-indigo-500 rounded-full"
              />
            ))}
          </div>
        )

      case "detailed":

        const Icon = loadingSteps[currentStep].icon

        return (
          <div className="text-center">
            <Icon className={`w-16 h-16 mb-3 ${loadingSteps[currentStep].color}`} />
            <p className="text-sm text-slate-300">
              {loadingSteps[currentStep].text}
            </p>
          </div>
        )

      case "logo":
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
          >
            <MessageCircle className="text-white w-10 h-10" />
          </motion.div>
        )

      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-slate-600 border-t-indigo-500 rounded-full"
          />
        )
    }

  }

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">

      {/* Floating particles */}

      <div className="absolute inset-0">

        {particles.map(p => (

          <motion.div
            key={p.id}
            className="absolute bg-indigo-400/30 rounded-full blur-sm"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity
            }}
            animate={{ y: [-50, window.innerHeight + 50] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear"
            }}
          />

        ))}

      </div>

      {/* Main container */}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative z-10 ${sizeClasses[size]} flex flex-col items-center justify-center`}
      >

        <div className="mb-6">
          {renderLoadingAnimation()}
        </div>

        {/* Progress */}

        <AnimatePresence>

          {progress !== null && (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-48 mb-6"
            >

              <div className="text-xs text-slate-400 mb-1 flex justify-between">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>

              <div className="h-2 bg-slate-700 rounded-full">

                <motion.div
                  animate={{ width: `${progress}%` }}
                  className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                />

              </div>

            </motion.div>

          )}

        </AnimatePresence>

        {/* Message */}

        <h2 className="text-lg text-indigo-400 font-semibold mb-4">
          {message}
        </h2>

        {/* Fun rotating tip */}

        <motion.div
          key={tipIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-slate-500 text-center max-w-xs"
        >
          💡 {tips[tipIndex]}
        </motion.div>

        {/* Icons */}

        <div className="flex gap-4 mt-6">

          {[Star, Heart, Zap].map((Icon,i) => (

            <motion.div
              key={i}
              animate={{ y:[0,-6,0] }}
              transition={{ repeat:Infinity, duration:2, delay:i*0.3 }}
              className="p-2 bg-slate-800 rounded-full"
            >
              <Icon className="w-4 h-4 text-indigo-400"/>
            </motion.div>

          ))}

        </div>

      </motion.div>

    </div>

  )
}

export default LoadingPage