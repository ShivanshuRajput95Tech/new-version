import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import Nav from "../components/chat/Nav";
import { useAuth } from "../context/AuthContext";
import SelectAvatar from "../components/SelectAvatar";
import { User, Mail, Save, Sparkles, Heart, Star } from "lucide-react";
import { useGlobalLoading } from "../context/GlobalLoadingContext";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [selectedLink, setSelectedLink] = useState("");
  const globalLoading = useGlobalLoading();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    globalLoading.startLoading("Updating your profile...", "pulse");

    try {
      const response = await api.put("/api/profile/update", {
        ...formData,
        avatarLink: selectedLink,
      });
      console.log(response.data);
      // Also update status
      if (formData.status) {
        await api.put("/api/profile/status", { status: formData.status });
      }
      globalLoading.stopLoading();
    } catch (error) {
      console.error(error);
      globalLoading.stopLoading();
    }
  };

  useEffect(() => {
    setFormData(user);
  }, [user]);

  return (
    <div className="flex min-h-screen bg-slate-950 relative overflow-hidden">
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
          className="absolute bottom-32 left-32 p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-full backdrop-blur-sm border border-slate-600/30"
        >
          <Heart className="w-5 h-5 text-pink-400" />
        </motion.button>
      </div>

      <div className="relative z-10 flex w-full">
        <Nav />
        <div className="w-full flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Sparkles className="w-12 h-12 text-indigo-400" />
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Update Your Profile
              </h1>
              <p className="text-slate-400 text-sm">
                Customize your chat experience
              </p>
            </motion.div>

            {/* Profile Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Selection */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center mb-8"
                >
                  <SelectAvatar selectedLink={selectedLink} setSelectedLink={setSelectedLink} />
                </motion.div>

                {/* Name Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="firstName"
                        className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-10 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 outline-none"
                        value={formData?.firstName || ""}
                        placeholder="Enter your first name"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="lastName"
                        className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-10 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 outline-none"
                        value={formData?.lastName || ""}
                        placeholder="Enter your last name"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      disabled
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-10 py-3 text-slate-500 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 outline-none cursor-not-allowed"
                      value={user?.email || ""}
                      placeholder="Your email address"
                    />
                  </div>
                </motion.div>

                {/* Status Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status (Optional)
                  </label>
                  <textarea
                    name="status"
                    rows="3"
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 outline-none resize-none"
                    value={formData?.status || ""}
                    placeholder="What's on your mind?"
                    onChange={handleChange}
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={globalLoading.isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {globalLoading.isLoading ? "Updating..." : "Update Profile"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;