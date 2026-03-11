import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Message from "./Message";

export default function MessageList({
  messages,
  isTyping,
  selectedUser,
  onReaction,
  onReply
}) {
  const bottomRef = useRef();
  const [visibleMessages, setVisibleMessages] = useState([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentGroup = null;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.createdAt || message.timestamp).toDateString();

      if (!currentGroup || currentGroup.date !== messageDate) {
        currentGroup = {
          date: messageDate,
          messages: []
        };
        groups.push(currentGroup);
      }

      currentGroup.messages.push({
        ...message,
        showAvatar: index === 0 || messages[index - 1].sender !== message.sender,
        showTimestamp: index === 0 || messages[index - 1].sender !== message.sender,
        isConsecutive: index > 0 && messages[index - 1].sender === message.sender
      });
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {messageGroups.map((group, groupIndex) => (
          <div key={group.date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-6">
              <div className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full font-medium">
                {formatDate(group.date)}
              </div>
            </div>

            {/* Messages in this date group */}
            <div className="space-y-1">
              {group.messages.map((message, messageIndex) => (
                <motion.div
                  key={message.id || messageIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: messageIndex * 0.05 }}
                  className="animate-fade-in"
                >
                  <Message
                    {...message}
                    onReaction={onReaction}
                    onReply={onReply}
                    showAvatar={message.showAvatar}
                    showTimestamp={message.showTimestamp}
                    isConsecutive={message.isConsecutive}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
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
                    {selectedUser[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="bg-slate-700 px-4 py-2 rounded-2xl">
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-slate-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-slate-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-slate-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll anchor */}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}