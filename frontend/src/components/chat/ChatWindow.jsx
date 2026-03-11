import { useState, useRef, useEffect, memo, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Avatar from "../ui/Avatar"
import { useChatStore } from "../../store/chatStore"
import { useAuthStore } from "../../store/authStore"
import Message from "./Message"

const ChatWindow = memo(() => {

    const messages = useChatStore((s) => s.messages) || []
    const selectedUser = useChatStore((s) => s.selectedUser)
    const onlineUsers = useChatStore((s) => s.onlineUsers) || []
    const sendMessage = useChatStore((s) => s.sendMessage)

    const user = useAuthStore((s) => s.user)

    const [text, setText] = useState("")
    const [isTyping, setIsTyping] = useState(false)

    const bottomRef = useRef(null)
    const inputRef = useRef(null)

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
        setText(e.target.value)
        if (selectedUser && e.target.value.trim()) {
            setIsTyping(true)
            setTimeout(() => setIsTyping(false), 1000)
        }
    }, [selectedUser])

    /* Header info */
    const chatInfo = useMemo(() => {

        if (!selectedUser) {
            return {
                name: "Select a user",
                avatar: "C",
                status: "Realtime messaging",
                isOnline: false
            }
        }

        const onlineUser = onlineUsers.find(u => u.userId === selectedUser)

        return {
            name: onlineUser?.username || "User",
            avatar: onlineUser?.username?.[0] || "U",
            status: onlineUser ? "Active" : "Away",
            isOnline: !!onlineUser
        }

    }, [selectedUser, onlineUsers])

    /* Empty chat state */
    if (!selectedUser) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-1 items-center justify-center text-gray-400 relative overflow-hidden"
            >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)] animate-pulse delay-1000"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.1),transparent_50%)] animate-pulse delay-2000"></div>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center relative z-10"
                >
                    <div className="text-6xl mb-4">💬</div>
                    <div className="text-xl font-medium text-gray-300 mb-2">Select a conversation</div>
                    <div className="text-sm text-gray-500">Choose someone from the sidebar to start messaging</div>
                </motion.div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col flex-1 relative overflow-hidden"
        >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.05),transparent_70%)] animate-pulse"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.05),transparent_70%)] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.05),transparent_70%)] animate-pulse delay-2000"></div>
            </div>

            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="h-16 flex items-center px-6 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl relative z-10 shadow-lg"
            >
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                        <Avatar name={chatInfo.avatar} />
                        <AnimatePresence>
                            {chatInfo.isOnline && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full flex items-center justify-center"
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-2 h-2 bg-green-300 rounded-full"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="min-w-0 flex-1">
                        <motion.div
                            className="font-semibold text-white text-lg"
                            layoutId={`chat-name-${selectedUser}`}
                        >
                            {chatInfo.name}
                        </motion.div>
                        <motion.div
                            className={`text-sm flex items-center gap-2 ${
                                chatInfo.isOnline ? "text-green-400" : "text-gray-400"
                            }`}
                            layoutId={`chat-status-${selectedUser}`}
                        >
                            {chatInfo.isOnline && (
                                <motion.div
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-2 h-2 bg-green-400 rounded-full"
                                />
                            )}
                            {chatInfo.status}
                            {isTyping && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-indigo-400 italic ml-2"
                                >
                                    typing...
                                </motion.span>
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-1 relative z-10 custom-scrollbar">
                <AnimatePresence>
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center text-gray-500 py-12"
                        >
                            <div className="text-4xl mb-4">🎯</div>
                            <div className="text-lg font-medium text-gray-400 mb-2">Start the conversation</div>
                            <div className="text-sm text-gray-600">Send your first message to begin chatting</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={msg._id || msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                                type: "spring",
                                stiffness: 100
                            }}
                        >
                            <Message
                                message={msg}
                                currentUser={user}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-6 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-xl relative z-10"
            >
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                    <div className="flex-1 relative">
                        <motion.textarea
                            ref={inputRef}
                            value={text}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            rows={1}
                            className="w-full bg-slate-800/80 border border-slate-600/50 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none transition-all duration-200 placeholder-gray-400 text-white custom-scrollbar"
                            style={{
                                minHeight: '44px',
                                maxHeight: '120px'
                            }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                            }}
                        />

                        <AnimatePresence>
                            {text.trim() && (
                                <motion.button
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    onClick={handleSend}
                                    className="absolute right-3 bottom-3 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-slate-700 hover:bg-slate-600 text-gray-300 p-3 rounded-xl transition-all duration-200 shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    )

})

ChatWindow.displayName = "ChatWindow"

export default ChatWindow