import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ChatMessages from "../components/chat/ChatMessages";
import MessageInputForm from "../components/chat/MessageInputForm";
import Nav from "../components/chat/Nav";
import OnlineUsersList from "../components/chat/OnlineUserList";
import TopBar from "../components/chat/TopBar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const socketUrl = "ws://localhost:4000";

const ChatHome = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleMessage = (ev) => {
    const messageData = JSON.parse(ev.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessages((prev) => [...prev, { ...messageData }]);
      }
    }
  };

  const connectToWebSocket = () => {
    const ws = new WebSocket(socketUrl);
    ws.addEventListener("message", handleMessage);
    setWs(ws);
  };

  const sendMessage = (ev) => {
    if (ev) ev.preventDefault();
    if (newMessage && selectedUserId && ws) {
      ws.send(JSON.stringify({ text: newMessage, recipient: selectedUserId }));
      setNewMessage("");
      setMessages((prev) => [
        ...prev,
        {
          text: newMessage,
          sender: user._id,
          recipient: selectedUserId,
          _id: Date.now(),
        },
      ]);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.06),transparent_50%)] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)] animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-24 h-24 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 right-32 w-32 h-32 bg-gradient-to-r from-green-500/8 to-blue-500/8 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10 flex w-full">
        <Nav />
        <OnlineUsersList
          onlinePeople={onlinePeople}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          offlinePeople={offlinePeople}
        />
        <section className="w-[71%] lg:w-[62%] relative pb-10">
          {selectedUserId && (
            <TopBar
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              offlinePeople={offlinePeople}
              onlinePeople={onlinePeople}
            />
          )}
          <ChatMessages
            messages={messages}
            userDetails={user}
            selectedUserId={selectedUserId}
          />
          <div className="absolute w-full bottom-0 flex justify-center">
            <MessageInputForm
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessage={sendMessage}
              selectedUserId={selectedUserId}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChatHome;