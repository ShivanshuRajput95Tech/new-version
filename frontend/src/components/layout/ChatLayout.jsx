import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import Conversations from "./Conversations";
import ChatArea from "../chat/ChatArea";
import { createMessage, fetchMessages, fetchPeople } from "../../api/chatApi";
import { useAuth } from "../../context/AuthContext";

export default function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversationsOpen, setConversationsOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("chat");
  const [subMode, setSubMode] = useState("direct");
  const { user } = useAuth();

  useEffect(() => {
    const loadPeople = async () => {
      try {
        const data = await fetchPeople();
        setUsers(data || []);
      } catch {
        setUsers([]);
      }
    };

    loadPeople();
  }, []);

  const loadMessages = useCallback(async (targetUserId) => {
    if (!targetUserId) return;

    setLoading(true);
    try {
      const data = await fetchMessages(targetUserId);
      const normalized = (data || []).map((m) => ({
        ...m,
        isMine: String(m.sender?._id || m.sender) === String(user?._id),
      }));
      setMessages(normalized);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  const handleSelectUser = async (target) => {
    setSelectedUser(target);
    setConversationsOpen(false);
    await loadMessages(target._id);
  };

  const handleSendMessage = async (text) => {
    if (!selectedUser) return;

    const optimistic = {
      _id: `temp-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      isMine: true,
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      const saved = await createMessage({ recipientId: selectedUser._id, text });
      const normalized = { ...saved, isMine: true };
      setMessages((prev) => prev.map((m) => (m._id === optimistic._id ? normalized : m)));
    } catch {
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
    }
  };

  const selectedUserId = useMemo(() => selectedUser?._id || null, [selectedUser]);

  return (
    <div className="flex h-screen bg-[#f1f4fb] text-slate-800 overflow-hidden">
      <div className="md:hidden fixed top-4 left-4 z-50 flex gap-2">
        <button onClick={() => setSidebarOpen((v) => !v)} className="bg-white shadow px-3 py-2 rounded-xl">☰</button>
        <button onClick={() => setConversationsOpen((v) => !v)} className="bg-white shadow px-3 py-2 rounded-xl">💬</button>
      </div>

      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 transition-transform duration-300`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className={`${conversationsOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 md:left-24 z-30 transition-transform duration-300`}>
        <Conversations
          onToggle={() => setConversationsOpen(false)}
          users={users}
          selectedUserId={selectedUserId}
          onSelectUser={handleSelectUser}
          mode={mode}
          setMode={setMode}
          subMode={subMode}
          setSubMode={setSubMode}
        />
      </div>

      <div className="flex-1 min-w-0">
        <ChatArea
          selectedUser={selectedUser}
          messages={messages}
          loading={loading}
          onSendMessage={handleSendMessage}
          mode={mode}
          subMode={subMode}
        />
      </div>

      {(sidebarOpen || conversationsOpen) && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-20" onClick={() => {
          setSidebarOpen(false);
          setConversationsOpen(false);
        }} />
      )}
    </div>
  );
}
