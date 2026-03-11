import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/register", data);
      toast.success(response.data?.message || "Registration successful");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid md:grid-cols-2">
        <section className="hidden md:flex flex-col justify-between bg-indigo-600 text-white p-10">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">Chatzy Style</p>
            <h1 className="text-4xl font-bold mt-4 leading-tight">Create your account and start chatting.</h1>
            <p className="mt-4 text-indigo-100">Set up your profile and access your messenger dashboard instantly.</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 text-sm text-indigo-100">"Simple onboarding, powerful communication."</div>
        </section>

        <section className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-slate-800">Register</h2>
          <p className="text-slate-500 text-sm mt-1">Create your account details below.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-slate-600">First name</span>
                <div className="mt-1 flex items-center border border-slate-200 rounded-xl px-3 bg-slate-50">
                  <User size={16} className="text-slate-400" />
                  <input name="firstName" value={data.firstName} onChange={handleChange} required className="w-full bg-transparent px-2 py-3 outline-none text-sm" />
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-slate-600">Last name</span>
                <div className="mt-1 flex items-center border border-slate-200 rounded-xl px-3 bg-slate-50">
                  <User size={16} className="text-slate-400" />
                  <input name="lastName" value={data.lastName} onChange={handleChange} required className="w-full bg-transparent px-2 py-3 outline-none text-sm" />
                </div>
              </label>
            </div>

            <label className="block">
              <span className="text-sm text-slate-600">Email</span>
              <div className="mt-1 flex items-center border border-slate-200 rounded-xl px-3 bg-slate-50">
                <Mail size={16} className="text-slate-400" />
                <input name="email" type="email" value={data.email} onChange={handleChange} required className="w-full bg-transparent px-2 py-3 outline-none text-sm" />
              </div>
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Password</span>
              <div className="mt-1 flex items-center border border-slate-200 rounded-xl px-3 bg-slate-50">
                <Lock size={16} className="text-slate-400" />
                <input name="password" type="password" value={data.password} onChange={handleChange} required className="w-full bg-transparent px-2 py-3 outline-none text-sm" />
              </div>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? "Creating account..." : "Register"}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Register;
