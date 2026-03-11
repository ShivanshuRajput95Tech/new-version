import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useGlobalLoading } from "../App";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, setAuthenticated } = useAuth();
  const navigate = useNavigate();
  const globalLoading = useGlobalLoading();

  useEffect(() => {
    if (isAuthenticated) navigate("/chat");
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    globalLoading.startLoading("Signing you in...", "pulse");

    try {
      const response = await api.post("/api/auth/login", data);
      if (response.status === 200) {
        setAuthenticated(true);
        toast.success(response.data.message || "Login successful");
        navigate("/chat");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
      globalLoading.stopLoading();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid md:grid-cols-2">
        <section className="hidden md:flex flex-col justify-between bg-indigo-600 text-white p-10">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">Chatzy Style</p>
            <h1 className="text-4xl font-bold mt-4 leading-tight">Welcome back to your messenger workspace.</h1>
            <p className="mt-4 text-indigo-100">Manage chats, track activity, and collaborate with your team in one place.</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 text-sm text-indigo-100">"Great communication starts with a clean interface."</div>
        </section>

        <section className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-slate-800">Login</h2>
          <p className="text-slate-500 text-sm mt-1">Enter your credentials to continue.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-sm text-slate-600">Email</span>
              <div className="mt-1 flex items-center border border-slate-200 rounded-xl px-3 bg-slate-50">
                <Mail size={16} className="text-slate-400" />
                <input
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  type="email"
                  required
                  className="w-full bg-transparent px-2 py-3 outline-none text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Password</span>
              <div className="mt-1 flex items-center border border-slate-200 rounded-xl px-3 bg-slate-50">
                <Lock size={16} className="text-slate-400" />
                <input
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  type="password"
                  required
                  className="w-full bg-transparent px-2 py-3 outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Login"}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-5">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
