import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Reply,
  Edit3,
  Trash2,
  Download,
  File,
  Image,
  Mic,
  Phone,
  Video,
  Hash,
  Users,
  Settings,
  Search
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const selectedUser = "Alice"; // Placeholder

  const channels = [
    { id: "general", name: "General", type: "channel", memberCount: 12 },
    { id: "random", name: "Random", type: "channel", memberCount: 8 },
    { id: "development", name: "Development", type: "channel", memberCount: 5 },
    { id: "alice", name: "Alice", type: "dm", status: "online" },
    { id: "bob", name: "Bob", type: "dm", status: "offline" }
  ];

  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");
      if (token) {
        const socket = connectSocket(token);
        if (socket) {
          socket.on("receiveMessage", (data) => {
            setMessages((prev) => [...prev, {
              ...data,
              status: 'delivered',
              reactions: [],
              threadCount: 0
            }]);
            setIsTyping(false);
          });

          socket.on("onlineUsers", (users) => {
            setOnlineUsers(users);
          });

          socket.on("userTyping", (data) => {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 3000);
          });

          socket.on("userStopTyping", () => {
            setIsTyping(false);
          });
        }
      }
    }
  }, [user]);

  const handleSendMessage = (messageData) => {
    // Handle sending message with attachments, etc.
    console.log("Sending message:", messageData);
  };

  const handleReaction = (messageId, emoji) => {
    // Handle adding/removing reactions
    console.log("Adding reaction:", messageId, emoji);
  };

  const handleReply = (messageId) => {
    // Handle replying to messages
    console.log("Replying to:", messageId);
  };

  const currentChannel = channels.find(c => c.id === selectedChannel);

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Workspace Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-white">ChatApp</h1>
            <Settings className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-700">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
              Channels
            </div>
            {channels.filter(c => c.type === "channel").map(channel => (
              <motion.button
                key={channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center gap-2 transition-all duration-200 ${
                  selectedChannel === channel.id
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Hash className="w-4 h-4" />
                <span className="flex-1">{channel.name}</span>
                <span className="text-xs text-slate-400">{channel.memberCount}</span>
              </motion.button>
            ))}

            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4 px-2">
              Direct Messages
            </div>
            {channels.filter(c => c.type === "dm").map(user => (
              <motion.button
                key={user.id}
                onClick={() => setSelectedChannel(user.id)}
                className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center gap-2 transition-all duration-200 ${
                  selectedChannel === user.id
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="flex-1">{user.name}</span>
                <div className={`w-2 h-2 rounded-full ${
                  user.status === "online" ? "bg-green-500" : "bg-slate-500"
                }`}></div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* User Status */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              Y
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">You</div>
              <div className="text-xs text-green-400">Online</div>
            </div>
            <div className="flex gap-1">
              <Mic className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
              <Phone className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
              <Video className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            {currentChannel?.type === "channel" ? (
              <Hash className="w-5 h-5 text-slate-400" />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {currentChannel?.name[0]}
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-white">
                {currentChannel?.type === "channel" ? `#${currentChannel.name}` : currentChannel?.name}
              </h2>
              <p className="text-sm text-slate-400">
                {currentChannel?.type === "channel"
                  ? `${currentChannel.memberCount} members`
                  : currentChannel?.status === "online" ? "Online" : "Offline"
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <Users className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <MessageList
            messages={messages}
            isTyping={isTyping}
            selectedUser={selectedUser}
            onReaction={handleReaction}
            onReply={handleReply}
          />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-slate-800 border-t border-slate-700">
          <MessageInput
            onSendMessage={handleSendMessage}
            placeholder={`Message ${currentChannel?.type === "channel" ? `#${currentChannel.name}` : currentChannel?.name}`}
          />
        </div>
      </div>
    </div>
  );
}