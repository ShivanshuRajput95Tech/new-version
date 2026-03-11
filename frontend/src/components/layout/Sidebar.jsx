import { useNavigate } from "react-router-dom";
import { MessageSquare, Settings, LogOut, Plus, Bell, Moon, Users, Phone } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-24 bg-[#f3f5fb] border-r border-slate-200 flex flex-col items-center py-6 relative">
      <button onClick={onClose} className="md:hidden absolute top-2 right-2 text-slate-500 hover:bg-slate-100 p-1 rounded-lg">✕</button>

      <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-lg">C</div>

      <div className="mt-4 flex flex-col gap-4">
        <button className="w-11 h-11 rounded-2xl flex items-center justify-center bg-indigo-500 text-white shadow-md shadow-indigo-200">
          <MessageSquare size={18} />
        </button>
        <button className="w-11 h-11 rounded-2xl flex items-center justify-center bg-indigo-500 text-white shadow-md shadow-indigo-200">
          <Users size={18} />
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-7 text-slate-500">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-200"><Phone size={18} /></button>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-200"><Bell size={18} /></button>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-200"><Moon size={18} /></button>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-200"><Plus size={18} /></button>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-200"><Settings size={18} /></button>
      </div>

      <button
        onClick={handleLogout}
        className="mt-auto w-10 h-10 rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-50"
        title="Logout"
      >
        <LogOut size={18} />
      </button>
    </aside>
  );
}
