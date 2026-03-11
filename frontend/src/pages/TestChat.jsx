import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const TestChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Alice", text: "Hey! How are you?", time: "10:30 AM", type: "text" },
    { id: 2, sender: "Bob", text: "I'm good! Thanks for asking.", time: "10:31 AM", type: "text" },
    { id: 3, sender: "Alice", text: "Great! Check out this image", time: "10:32 AM", type: "image", url: "https://via.placeholder.com/300x200" },
    { id: 4, sender: "Bob", text: "Nice! 👍", time: "10:33 AM", type: "text" },
    { id: 5, sender: "Alice", text: "Voice message test", time: "10:34 AM", type: "voice", duration: "00:15" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedTest, setSelectedTest] = useState("basic");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollTo({
      top: messagesEndRef.current.scrollHeight,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "You",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text"
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const addTestMessage = (type) => {
    let message;
    switch (type) {
      case "image":
        message = {
          id: messages.length + 1,
          sender: "Test Bot",
          text: "Image message",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "image",
          url: "https://via.placeholder.com/300x200/4f46e5/ffffff?text=Test+Image"
        };
        break;
      case "voice":
        message = {
          id: messages.length + 1,
          sender: "Test Bot",
          text: "Voice message",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "voice",
          duration: "00:23"
        };
        break;
      case "file":
        message = {
          id: messages.length + 1,
          sender: "Test Bot",
          text: "document.pdf",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "file",
          size: "2.5 MB"
        };
        break;
      case "typing":
        // Simulate typing indicator
        setTimeout(() => {
          const message = {
            id: messages.length + 1,
            sender: "Test Bot",
            text: "This message was sent after typing indicator",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: "text"
          };
          setMessages(prev => [...prev, message]);
        }, 2000);
        return;
      default:
        message = {
          id: messages.length + 1,
          sender: "Test Bot",
          text: `Test message: ${type}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "text"
        };
    }
    setMessages([...messages, message]);
  };

  const renderMessage = (message) => {
    const isOwn = message.sender === "You";

    return (
      <motion.div
        key={message.id}
        className={`flex mb-4 ${isOwn ? "justify-end" : "justify-start"}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-zinc-700 text-white rounded-bl-none"
        }`}>
          {!isOwn && (
            <div className="text-xs text-gray-300 mb-1 font-semibold">
              {message.sender}
            </div>
          )}

          {message.type === "text" && (
            <div className="text-sm">{message.text}</div>
          )}

          {message.type === "image" && (
            <div>
              <img src={message.url} alt="Shared image" className="rounded-lg max-w-full h-auto" />
              <div className="text-xs mt-1">{message.text}</div>
            </div>
          )}

          {message.type === "voice" && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-xs">🎵</span>
              </div>
              <div>
                <div className="text-sm">{message.text}</div>
                <div className="text-xs text-gray-300">{message.duration}</div>
              </div>
            </div>
          )}

          {message.type === "file" && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                <span className="text-xs">📄</span>
              </div>
              <div>
                <div className="text-sm font-semibold">{message.text}</div>
                <div className="text-xs text-gray-300">{message.size}</div>
              </div>
            </div>
          )}

          <div className={`text-xs mt-1 ${isOwn ? "text-blue-200" : "text-gray-400"}`}>
            {message.time}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-zinc-800 p-6 border-r border-zinc-700">
        <h2 className="text-xl font-bold mb-6">Chat Test Suite</h2>

        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-gray-300">Test Scenarios</h3>
          <div className="space-y-2">
            {[
              { id: "basic", name: "Basic Messaging", desc: "Text messages" },
              { id: "media", name: "Media Sharing", desc: "Images & files" },
              { id: "voice", name: "Voice Messages", desc: "Audio content" },
              { id: "reactions", name: "Reactions", desc: "Message reactions" },
              { id: "threads", name: "Threaded Conversations", desc: "Reply threads" },
              { id: "status", name: "Status Updates", desc: "User status" },
              { id: "channels", name: "Channels", desc: "Group channels" },
              { id: "encryption", name: "Encryption", desc: "Secure messaging" }
            ].map((test) => (
              <button
                key={test.id}
                onClick={() => setSelectedTest(test.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                  selectedTest === test.id
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-700 hover:bg-zinc-600"
                }`}
              >
                <div className="font-semibold">{test.name}</div>
                <div className="text-sm text-gray-400">{test.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-gray-300">Quick Tests</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addTestMessage("text")}
              className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm font-semibold transition-colors"
            >
              Add Text
            </button>
            <button
              onClick={() => addTestMessage("image")}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm font-semibold transition-colors"
            >
              Add Image
            </button>
            <button
              onClick={() => addTestMessage("voice")}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm font-semibold transition-colors"
            >
              Add Voice
            </button>
            <button
              onClick={() => addTestMessage("file")}
              className="bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded text-sm font-semibold transition-colors"
            >
              Add File
            </button>
            <button
              onClick={() => addTestMessage("typing")}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm font-semibold transition-colors col-span-2"
            >
              Simulate Typing
            </button>
          </div>
        </div>

        <div className="bg-zinc-700 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Test Status</h4>
          <div className="text-sm text-gray-300">
            <div>Messages: {messages.length}</div>
            <div>Test Mode: {selectedTest}</div>
            <div>Mock Data: Enabled</div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-zinc-800 p-4 border-b border-zinc-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                T
              </div>
              <div>
                <h3 className="font-semibold">Test Chat</h3>
                <p className="text-sm text-gray-400">Testing environment - No real data</p>
              </div>
            </div>
            <div className="text-sm text-green-400">🟢 Online</div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesEndRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {messages.map(renderMessage)}
        </div>

        {/* Message Input */}
        <div className="bg-zinc-800 p-4 border-t border-zinc-700">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a test message..."
              className="flex-1 bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestChat;