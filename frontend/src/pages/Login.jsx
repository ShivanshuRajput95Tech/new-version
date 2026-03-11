import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useGlobalLoading } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const globalLoading = useGlobalLoading();

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();
    const { isAuthenticated, setAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        globalLoading.startLoading("Signing you in...", "pulse");

        try {
            const url = "/api/user/login";
            const response = await axios.post(url, data, {
                withCredentials: true,
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Login successful!");
                setAuthenticated(true);
            }
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                toast.error(error.response.data.message || "Login failed");
            } else {
                toast.error("Network error. Please try again.");
            }
        } finally {
            globalLoading.stopLoading();
        }
    };

    const isFormValid = data.email.trim() && data.password.trim();

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)] animate-pulse"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.12),transparent_50%)] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)] animate-pulse delay-2000"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl"
                />
                <motion.div
                    animate={{
                        x: [0, -25, 0],
                        y: [0, 15, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-green-500/8 to-blue-500/8 rounded-full blur-xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
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
                        Welcome Back
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Sign in to your account to continue
                    </p>
                </motion.div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    onChange={handleChange}
                                    value={data.email}
                                    type="email"
                                    name="email"
                                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-10 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 outline-none"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    onChange={handleChange}
                                    value={data.password}
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-10 pr-12 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 outline-none"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Remember Me & Forgot Password */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center justify-between"
                        >
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500 focus:ring-2"
                                />
                                <span className="ml-2 text-sm text-slate-400">Remember me</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={!isFormValid || globalLoading.isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:cursor-not-allowed"
                        >
                            <AnimatePresence mode="wait">
                                {globalLoading.isLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                        Signing in...
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="signin"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        Sign In
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex items-center my-6"
                    >
                        <div className="flex-1 h-px bg-slate-700"></div>
                        <span className="px-3 text-sm text-slate-500">or</span>
                        <div className="flex-1 h-px bg-slate-700"></div>
                    </motion.div>

                    {/* Social Login */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="grid grid-cols-2 gap-3"
                    >
                        <button className="flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 rounded-xl py-2.5 px-4 transition-all duration-200 hover:scale-105">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 rounded-xl py-2.5 px-4 transition-all duration-200 hover:scale-105">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                            </svg>
                            Twitter
                        </button>
                    </motion.div>

                    {/* Sign Up Link */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        className="text-center text-slate-400 text-sm mt-6"
                    >
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                        >
                            Sign up here
                        </Link>
                    </motion.p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;