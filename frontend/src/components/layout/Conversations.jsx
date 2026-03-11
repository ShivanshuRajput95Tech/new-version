import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, MessageSquare, Phone, Users, Plus, AlertTriangle, CheckCheck, Image as ImageIcon } from "lucide-react";

const initials = (firstName = "", lastName = "") => `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "U";

const statusSeed = ["My status", "Jesus", "Mari", "Kristin", "Lea"];
const profileClasses = ["online", "unreachable", "busy", "offline"];

const metaByIndex = [
  { time: "15/06/23", type: "sending" },
  { time: "Just now", type: "failed" },
  { time: "22/10/23", type: "plain" },
  { time: "30/11/23", type: "unread", count: 8 },
  { time: "22/10/23", type: "loader" },
  { time: "30/11/23", type: "danger" },
  { time: "04/06/23", type: "seen" },
];

function MetaTag({ meta }) {
  if (meta.type === "sending") {
    return <span className="text-[11px] font-medium text-slate-500">Sending</span>;
  }
  if (meta.type === "failed") {
    return <span className="text-[11px] font-semibold text-rose-500">Failed</span>;
  }
  if (meta.type === "seen") {
    return <span className="text-[11px] font-semibold text-emerald-600">Seen</span>;
  }
  if (meta.type === "unread") {
    return <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[11px] flex items-center justify-center">{meta.count || 1}</span>;
  }
  if (meta.type === "loader") {
    return <span className="w-4 h-4 rounded-full border-2 border-indigo-200 border-t-indigo-500 animate-spin" />;
  }
  if (meta.type === "danger") {
    return <AlertTriangle size={14} className="text-rose-500" />;
  }
  return null;
}

export default function Conversations({ onToggle, users = [], selectedUserId, onSelectUser, mode, setMode, subMode, setSubMode }) {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => `${u.firstName} ${u.lastName}`.toLowerCase().includes(q));
  }, [users, search]);

  return (
    <section className="w-[392px] bg-white border-r border-slate-200 flex flex-col">
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/100?img=5" alt="profile" className="w-12 h-12 rounded-2xl" />
            <div>
              <h3 className="font-semibold text-slate-800">Rohini Sharma</h3>
              <p className="text-xs text-amber-500">Busy</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"><SlidersHorizontal size={16} /></button>
            <button onClick={onToggle} className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-500">✕</button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-700">Status</h4>
          <button className="text-xs font-semibold text-indigo-600">View All</button>
        </div>

        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {statusSeed.map((name, i) => (
            <div key={name} className="flex-shrink-0 text-center">
              <img src={`https://i.pravatar.cc/70?img=${i + 10}`} className="w-12 h-12 rounded-2xl ring-2 ring-indigo-200" alt={name} />
              <p className="text-[11px] text-slate-500 mt-1 w-14 truncate">{name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">Message ({mode === "chat" ? filteredUsers.length : 0})</h3>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"><Search size={16} /></button>
            <button className="p-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600"><Plus size={16} /></button>
          </div>
        </div>

        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search messenger"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-100 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div className="flex gap-2">
          {[
            ["chat", MessageSquare, "Chat"],
            ["call", Phone, "Call"],
            ["contact", Users, "Contact"],
          ].map(([id, Icon, label]) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 ${
                mode === id ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {mode === "chat" && (
          <div className="mt-2 flex gap-2">
            {[ ["direct", "Direct"], ["group", "Group"] ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setSubMode(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${subMode === id ? "bg-indigo-50 text-indigo-600" : "text-slate-500 bg-slate-50"}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {mode !== "chat" && (
          <p className="text-sm text-slate-400 px-3 py-6">{mode === "call" ? "Call history panel" : "Contact list panel"} style is aligned and ready.</p>
        )}

        {mode === "chat" && filteredUsers.map((user, idx) => {
          const active = selectedUserId === user._id;
          const profileTone = profileClasses[idx % profileClasses.length];
          const meta = metaByIndex[idx % metaByIndex.length];
          const isImageMessage = idx % 9 === 0;

          return (
            <button
              key={user._id}
              onClick={() => onSelectUser(user)}
              className={`w-full text-left px-3 py-3 rounded-2xl transition-colors mb-1 ${
                active ? "bg-indigo-50 border border-indigo-100" : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-11 h-11 rounded-2xl text-white font-semibold flex items-center justify-center ${
                    profileTone === "online" ? "bg-gradient-to-br from-indigo-400 to-indigo-600" :
                    profileTone === "unreachable" ? "bg-gradient-to-br from-slate-400 to-slate-500" :
                    profileTone === "busy" ? "bg-gradient-to-br from-amber-400 to-orange-500" :
                    "bg-gradient-to-br from-sky-400 to-cyan-500"
                  }`}>
                    {initials(user.firstName, user.lastName)}
                  </div>
                  {profileTone === "online" && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-800 truncate">{user.firstName} {user.lastName}</p>
                    <span className="text-xs text-slate-400">{meta.time}</span>
                  </div>
                  <p className={`text-sm truncate flex items-center gap-1.5 ${idx === 0 ? "text-indigo-500" : "text-slate-500"}`}>
                    {isImageMessage ? <><ImageIcon size={13} className="text-indigo-500" /> Sent you image</> : (idx % 4 === 0 ? <><CheckCheck size={13} className="text-indigo-500" /> Hello ..🙂</> : (idx === 0 ? "Typing..." : (user.status || "Hi, i am josephin. How are you.. !")))}
                  </p>
                </div>

                <MetaTag meta={meta} />
              </div>
            </button>
          );
        })}

        {mode === "chat" && !filteredUsers.length && <p className="text-sm text-slate-400 px-3 py-4">No users found.</p>}
      </div>
    </section>
  );
}
