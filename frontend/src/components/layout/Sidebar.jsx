import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Users,
  Bell,
  FileText,
  Star,
  Settings,
  Moon,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const topItems = [MessageSquare, Users, Bell, FileText, Star, Settings];

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

      <ul className="mt-4 flex flex-col gap-3">
        {topItems.map((Icon, idx) => (
          <li key={idx}>
            <button
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                idx < 2 ? "bg-indigo-500 text-white shadow-md shadow-indigo-200" : "text-slate-500 hover:bg-slate-200"
              }`}
            >
              <Icon size={18} />
            </button>
          </li>
        ))}
      </ul>

      <ul className="mt-auto flex flex-col gap-3">
        <li>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200">
            <Moon size={18} />
          </button>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-50"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </li>
      </ul>
    </aside>
  );
}
