import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from 'timeago.js';
import {
  Reply,
  MoreHorizontal,
  Edit3,
  Trash2,
  Heart,
  ThumbsUp,
  Smile,
  MessageCircle,
  Download,
  File,
  Image as ImageIcon,
  Mic,
  Play,
  Pause
} from "lucide-react";

export default function Message({
  id,
  text,
  sender,
  timestamp,
  attachments = [],
  reactions = [],
  threadCount = 0,
  edited = false,
  readBy = [],
  onReaction,
  onReply,
  showAvatar = true,
  showTimestamp = true,
  isConsecutive = false,
  isMine = false
}) {
  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const commonReactions = ["❤️", "👍", "👎", "😂", "😮", "😢", "😡"];

  const handleReaction = (emoji) => {
    onReaction && onReaction(id, emoji);
    setShowReactionPicker(false);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderAttachment = (attachment, index) => {
    const { type, url, name, size } = attachment;

    if (type.startsWith('image/')) {
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2"
        >
          <img
            src={url}
            alt={name}
            className="max-w-sm rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(url, '_blank')}
          />
        </motion.div>
      );
    }

    if (type.startsWith('audio/')) {
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-2 flex items-center gap-3 bg-slate-600 rounded-lg p-3"
        >
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:text-indigo-400 transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <div className="flex-1">
            <div className="text-sm font-medium text-white">{name}</div>
            <div className="text-xs text-slate-400">{size}</div>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </motion.div>
      );
    }

    // File attachment
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mt-2 flex items-center gap-3 bg-slate-600 rounded-lg p-3 hover:bg-slate-500 transition-colors cursor-pointer"
        onClick={() => window.open(url, '_blank')}
      >
        <File className="w-5 h-5 text-slate-400" />
        <div className="flex-1">
          <div className="text-sm font-medium text-white">{name}</div>
          <div className="text-xs text-slate-400">{size}</div>
        </div>
        <Download className="w-4 h-4 text-slate-400" />
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex gap-3 mb-1 hover:bg-slate-800/30 px-4 py-2 rounded-lg transition-all duration-200 ${
        isMine ? "justify-end" : "justify-start"
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {!isMine && showAvatar && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {sender?.username?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      )}

      <div className={`flex flex-col max-w-2xl ${isMine ? "items-end" : "items-start"}`}>
        {/* Sender name and timestamp */}
        {!isMine && showTimestamp && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-white">
              {sender?.username || "User"}
            </span>
            <span className="text-xs text-slate-400">
              {formatTime(timestamp)}
            </span>
            {edited && (
              <span className="text-xs text-slate-500 italic">(edited)</span>
            )}
          </div>
        )}

        {/* Message content */}
        <div className={`relative ${isMine ? "items-end" : "items-start"}`}>
          <motion.div
            className={`px-4 py-3 rounded-2xl shadow-sm max-w-2xl break-words ${
              isMine
                ? "bg-indigo-600 text-white rounded-br-md"
                : "bg-slate-700 text-white rounded-bl-md"
            }`}
          >
            {/* Text content */}
            {text && (
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {text}
              </div>
            )}

            {/* Attachments */}
            {attachments.map((attachment, index) => renderAttachment(attachment, index))}
          </motion.div>

          {/* Message actions */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute top-0 ${
                  isMine ? "left-0 -translate-x-full" : "right-0 translate-x-full"
                } flex items-center gap-1 bg-slate-800 rounded-lg px-2 py-1 shadow-lg ml-2`}
              >
                <button
                  onClick={() => setShowReactionPicker(!showReactionPicker)}
                  className="p-1 text-slate-400 hover:text-yellow-400 transition-colors rounded"
                >
                  <Smile className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onReply && onReply(id)}
                  className="p-1 text-slate-400 hover:text-blue-400 transition-colors rounded"
                >
                  <Reply className="w-4 h-4" />
                </button>
                <button className="p-1 text-slate-400 hover:text-slate-300 transition-colors rounded">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reaction picker */}
          <AnimatePresence>
            {showReactionPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="absolute top-12 left-0 bg-slate-800 rounded-lg p-2 shadow-xl border border-slate-600 z-10"
              >
                <div className="flex gap-1">
                  {commonReactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className="w-8 h-8 hover:bg-slate-700 rounded flex items-center justify-center text-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reactions */}
        {reactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-1 mt-2"
          >
            {reactions.map((reaction, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReaction(reaction.emoji)}
                className="bg-slate-600 hover:bg-slate-500 px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-colors"
              >
                <span>{reaction.emoji}</span>
                <span className="text-slate-300">{reaction.count}</span>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Thread indicator */}
        {threadCount > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-blue-400 mt-1 transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            <span>{threadCount} replies</span>
          </motion.button>
        )}

        {/* Read receipts for own messages */}
        {isMine && readBy.length > 0 && (
          <div className="text-xs text-slate-500 mt-1">
            Read by {readBy.length} people
          </div>
        )}
      </div>
    </motion.div>
  );
}