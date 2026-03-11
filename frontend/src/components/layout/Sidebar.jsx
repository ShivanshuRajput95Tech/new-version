import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Settings, LogOut, Plus, Bell, Moon, Users, Phone } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const railItems = [
  { id: "messages", icon: MessageSquare },
  { id: "contacts", icon: Users },
  { id: "calls", icon: Phone },
  { id: "alerts", icon: Bell },
  { id: "theme", icon: Moon },
];

export default function Sidebar({ onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("messages");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-24 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-4 shadow-[0_0_30px_rgba(15,23,42,0.06)] relative">
      <button onClick={onClose} className="md:hidden absolute top-2 right-2 text-slate-500 hover:bg-slate-100 p-1 rounded-lg">✕</button>

      <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-lg">C</div>

      {railItems.map(({ id, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveItem(id)}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
            activeItem === id
              ? "bg-indigo-500 text-white shadow-md shadow-indigo-200"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <Icon size={18} />
        </button>
      ))}

      <button className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-slate-100">
        <Plus size={18} />
      </button>

      <div className="mt-auto flex flex-col gap-3">
        <button className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-slate-100">
          <Settings size={18} />
        </button>

        <button
          onClick={handleLogout}
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-rose-500 hover:bg-rose-50"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
