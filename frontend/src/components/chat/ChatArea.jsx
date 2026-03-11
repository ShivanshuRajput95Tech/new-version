import { useEffect, useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Settings,
  Hash,
  Users,
  MoreVertical
} from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import { connectSocket } from "../../sockets/socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatArea() {

  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");

  const typingTimeoutRef = useRef(null);

  const { user } = useAuthStore();

  const channels = useMemo(() => [
    { id: "general", name: "General", type: "channel", memberCount: 12 },
    { id: "random", name: "Random", type: "channel", memberCount: 8 },
    { id: "development", name: "Development", type: "channel", memberCount: 5 },
    { id: "alice", name: "Alice", type: "dm", status: "online" },
    { id: "bob", name: "Bob", type: "dm", status: "offline" }
  ], []);

  const { channelList, dmList, currentChannel } = useMemo(() => {
    const channelList = channels.filter(c => c.type === "channel");
    const dmList = channels.filter(c => c.type === "dm");
    const currentChannel = channels.find(c => c.id === selectedChannel);

    return { channelList, dmList, currentChannel };
  }, [channels, selectedChannel]);

  useEffect(() => {

    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = connectSocket(token);
    if (!socket) return;

    const handleReceive = (data) => {
      setMessages(prev => [
        ...prev,
        {
          ...data,
          status: "delivered",
          reactions: [],
          threadCount: 0
        }
      ]);

      setIsTyping(false);
    };

    const handleOnlineUsers = (users) => setOnlineUsers(users);

    const handleTyping = () => {
      setIsTyping(true);

      clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    };

    const handleStopTyping = () => setIsTyping(false);

    socket.on("receiveMessage", handleReceive);
    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("userTyping", handleTyping);
    socket.on("userStopTyping", handleStopTyping);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("userTyping", handleTyping);
      socket.off("userStopTyping", handleStopTyping);
    };

  }, [user]);

  const handleSendMessage = (messageData) => {
    console.log("Sending message:", messageData);
  };

  const handleReaction = (messageId, emoji) => {
    console.log("Adding reaction:", messageId, emoji);
  };

  const handleReply = (messageId) => {
    console.log("Replying to:", messageId);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white">

      {/* Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">

        <div className="p-4 border-b border-slate-700 flex justify-between">
          <h1 className="text-lg font-semibold">ChatApp</h1>
          <Settings className="w-5 h-5 text-slate-400 cursor-pointer" />
        </div>

        <div className="p-4 border-b border-slate-700 relative">
          <Search className="w-4 h-4 absolute left-7 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-8 pr-4 py-2 bg-slate-700 rounded-lg text-white"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2">

          <div className="text-xs text-slate-400 px-2 mb-2">Channels</div>

          {channelList.map(channel => (
            <motion.button
              key={channel.id}
              onClick={()=>setSelectedChannel(channel.id)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center gap-2 ${
                selectedChannel === channel.id
                  ? "bg-indigo-600"
                  : "hover:bg-slate-700"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Hash className="w-4 h-4"/>
              <span className="flex-1">{channel.name}</span>
              <span className="text-xs text-slate-400">
                {channel.memberCount}
              </span>
            </motion.button>
          ))}

          <div className="text-xs text-slate-400 px-2 mt-4 mb-2">
            Direct Messages
          </div>

          {dmList.map(dm => (
            <button
              key={dm.id}
              onClick={()=>setSelectedChannel(dm.id)}
              className="w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center gap-2 hover:bg-slate-700"
            >
              <div className={`w-2 h-2 rounded-full ${
                dm.status === "online" ? "bg-green-500" : "bg-slate-500"
              }`}/>
              <span>{dm.name}</span>
            </button>
          ))}

        </div>

      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">

        <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-slate-400"/>
            <h2 className="text-lg font-semibold">
              {currentChannel?.name}
            </h2>
          </div>

          <div className="flex gap-2">
            <Users className="w-5 h-5 text-slate-400 cursor-pointer"/>
            <MoreVertical className="w-5 h-5 text-slate-400 cursor-pointer"/>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <MessageList
            messages={messages}
            isTyping={isTyping}
            selectedUser="Alice"
            onReaction={handleReaction}
            onReply={handleReply}
          />
        </div>

        <div className="p-4 bg-slate-800 border-t border-slate-700">
          <MessageInput
            onSendMessage={handleSendMessage}
            placeholder={`Message ${currentChannel?.name}`}
          />
        </div>

      </div>
    </div>
  );
}