import { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Message from "./Message";

export default function MessageList({
  messages = [],
  isTyping,
  selectedUser,
  onReaction,
  onReply
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* -------- Group messages by date -------- */

  const messageGroups = useMemo(() => {
    const groups = [];
    let currentGroup = null;

    messages.forEach((message, index) => {
      const date = new Date(
        message.createdAt || message.timestamp
      ).toDateString();

      if (!currentGroup || currentGroup.date !== date) {
        currentGroup = { date, messages: [] };
        groups.push(currentGroup);
      }

      const prev = messages[index - 1];

      currentGroup.messages.push({
        ...message,
        showAvatar: !prev || prev.sender !== message.sender,
        showTimestamp: !prev || prev.sender !== message.sender,
        isConsecutive: prev?.sender === message.sender
      });
    });

    return groups;
  }, [messages]);

  /* -------- Date formatting -------- */

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {messageGroups.map((group) => (
          <div key={group.date}>

            {/* Date separator */}
            <div className="flex justify-center my-6">
              <div className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full font-medium">
                {formatDate(group.date)}
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-1">
              {group.messages.map((message, i) => (
                <motion.div
                  key={message._id || message.id || i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <Message
                    {...message}
                    onReaction={onReaction}
                    onReply={onReply}
                  />
                </motion.div>
              ))}
            </div>

          </div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-3 max-w-xs">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-slate-300">
                    {selectedUser?.[0]?.toUpperCase()}
                  </span>
                </div>

                <div className="bg-slate-700 px-4 py-2 rounded-2xl">
                  <div className="flex gap-1">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}