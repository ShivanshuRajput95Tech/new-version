import { useState, useRef, useEffect, memo, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Avatar from "../ui/Avatar"
import { useChatStore } from "../../store/chatStore"
import { useAuthStore } from "../../store/authStore"
import Message from "./Message"

const ChatWindow = memo(() => {

  const { messages = [], selectedUser, onlineUsers = [], sendMessage } =
    useChatStore((s) => ({
      messages: s.messages,
      selectedUser: s.selectedUser,
      onlineUsers: s.onlineUsers,
      sendMessage: s.sendMessage
    }))

  const user = useAuthStore((s) => s.user)

  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  /* Auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /* Send message */
  const handleSend = useCallback(() => {
    const message = text.trim()
    if (!message || !selectedUser || !user?._id) return

    sendMessage({
      receiverId: selectedUser,
      text: message,
      senderId: user._id
    })

    setText("")
    setIsTyping(false)
  }, [text, selectedUser, sendMessage, user])

  /* Enter key send */
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  /* Typing indicator */
  const handleInputChange = useCallback((e) => {
    const value = e.target.value
    setText(value)

    if (!selectedUser || !value.trim()) return

    setIsTyping(true)

    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1000)

  }, [selectedUser])

  /* Header info */
  const chatInfo = useMemo(() => {

    if (!selectedUser) {
      return {
        name: "Select a user",
        status: "Realtime messaging",
        isOnline: false
      }
    }

    const onlineUser = onlineUsers.find(u => u.userId === selectedUser)

    return {
      name: onlineUser?.username || "User",
      status: onlineUser ? "Active" : "Away",
      isOnline: !!onlineUser
    }

  }, [selectedUser, onlineUsers])

  /* Empty state */
  if (!selectedUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-1 items-center justify-center text-gray-400"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <div className="text-xl font-medium text-gray-300 mb-2">
            Select a conversation
          </div>
          <div className="text-sm text-gray-500">
            Choose someone from the sidebar to start messaging
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col flex-1 overflow-hidden"
    >

      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-slate-900">

        <div className="flex items-center gap-4 flex-1">

          <Avatar
            username={chatInfo.name}
            userId={selectedUser}
          />

          <div className="min-w-0 flex-1">
            <div className="font-semibold text-white text-lg">
              {chatInfo.name}
            </div>

            <div
              className={`text-sm flex items-center gap-2 ${
                chatInfo.isOnline ? "text-green-400" : "text-gray-400"
              }`}
            >
              {chatInfo.isOnline && (
                <span className="w-2 h-2 bg-green-400 rounded-full"/>
              )}

              {chatInfo.status}

              {isTyping && (
                <span className="text-indigo-400 italic ml-2">
                  typing...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-1">

        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-4">🎯</div>
            <div className="text-lg text-gray-400">
              Start the conversation
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <motion.div
            key={msg._id || msg.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.25,
              delay: Math.min(index * 0.03, 0.2)
            }}
          >
            <Message
              message={msg}
              currentUser={user}
            />
          </motion.div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-slate-700 bg-slate-900">

        <div className="flex items-end gap-3 max-w-4xl mx-auto">

          <textarea
            ref={inputRef}
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white resize-none"
            style={{ minHeight: 44, maxHeight: 120 }}
            onInput={(e) => {
              e.target.style.height = "auto"
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
            }}
          />

          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-lg text-white"
          >
            Send
          </button>

        </div>
      </div>

    </motion.div>
  )
})

ChatWindow.displayName = "ChatWindow"

export default ChatWindow