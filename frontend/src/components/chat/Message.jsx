import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Reply,
  MoreHorizontal,
  Smile,
  MessageCircle,
  Download,
  File,
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
  isMine = false
}) {
  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);

  const commonReactions = ["❤️", "👍", "👎", "😂", "😮", "😢", "😡"];

  const handleReaction = useCallback((emoji) => {
    onReaction?.(id, emoji);
    setShowReactionPicker(false);
  }, [id, onReaction]);

  const time = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  const renderAttachment = (attachment, index) => {
    const { type, url, name, size } = attachment;

    if (type?.startsWith("image/")) {
      return (
        <motion.img
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          src={url}
          alt={name}
          className="max-w-sm mt-2 rounded-lg cursor-pointer hover:opacity-90"
          onClick={() => window.open(url, "_blank")}
        />
      );
    }

    if (type?.startsWith("audio/")) {
      const isPlaying = playingAudio === index;

      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-2 flex items-center gap-3 bg-slate-600 rounded-lg p-3"
        >
          <button
            onClick={() => setPlayingAudio(isPlaying ? null : index)}
            className="text-white hover:text-indigo-400"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <div className="flex-1">
            <div className="text-sm text-white">{name}</div>
            <div className="text-xs text-slate-400">{size}</div>
          </div>

          <a href={url} download className="text-slate-400 hover:text-white">
            <Download className="w-4 h-4" />
          </a>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => window.open(url, "_blank")}
        className="mt-2 flex items-center gap-3 bg-slate-600 rounded-lg p-3 cursor-pointer hover:bg-slate-500"
      >
        <File className="w-5 h-5 text-slate-400" />

        <div className="flex-1">
          <div className="text-sm text-white">{name}</div>
          <div className="text-xs text-slate-400">{size}</div>
        </div>

        <Download className="w-4 h-4 text-slate-400" />
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex gap-3 px-4 py-2 rounded-lg hover:bg-slate-800/30 ${
        isMine ? "justify-end" : "justify-start"
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isMine && showAvatar && (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold">
          {sender?.username?.[0]?.toUpperCase() || "U"}
        </div>
      )}

      <div className={`flex flex-col max-w-2xl ${isMine ? "items-end" : "items-start"}`}>
        {!isMine && showTimestamp && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-white font-medium">
              {sender?.username || "User"}
            </span>

            <span className="text-xs text-slate-400">{time}</span>

            {edited && (
              <span className="text-xs text-slate-500 italic">(edited)</span>
            )}
          </div>
        )}

        <div className="relative">
          <div
            className={`px-4 py-3 rounded-2xl max-w-2xl break-words ${
              isMine
                ? "bg-indigo-600 text-white rounded-br-md"
                : "bg-slate-700 text-white rounded-bl-md"
            }`}
          >
            {text && (
              <div className="text-sm whitespace-pre-wrap">{text}</div>
            )}

            {attachments?.map(renderAttachment)}
          </div>

          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className={`absolute top-0 flex gap-1 bg-slate-800 rounded-lg px-2 py-1 shadow ${
                  isMine ? "left-0 -translate-x-full" : "right-0 translate-x-full"
                }`}
              >
                <button
                  onClick={() => setShowReactionPicker(v => !v)}
                  className="p-1 text-slate-400 hover:text-yellow-400"
                >
                  <Smile className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onReply?.(id)}
                  className="p-1 text-slate-400 hover:text-blue-400"
                >
                  <Reply className="w-4 h-4" />
                </button>

                <button className="p-1 text-slate-400 hover:text-slate-300">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showReactionPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="absolute top-12 left-0 bg-slate-800 rounded-lg p-2 border border-slate-600"
              >
                <div className="flex gap-1">
                  {commonReactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-700 text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {reactions.map((reaction, i) => (
              <button
                key={i}
                onClick={() => handleReaction(reaction.emoji)}
                className="bg-slate-600 hover:bg-slate-500 px-2 py-1 rounded-full text-xs flex gap-1"
              >
                <span>{reaction.emoji}</span>
                <span className="text-slate-300">{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {threadCount > 0 && (
          <button className="flex items-center gap-2 text-xs text-slate-400 hover:text-blue-400 mt-1">
            <MessageCircle className="w-3 h-3" />
            {threadCount} replies
          </button>
        )}

        {isMine && readBy.length > 0 && (
          <div className="text-xs text-slate-500 mt-1">
            Read by {readBy.length} people
          </div>
        )}
      </div>
    </motion.div>
  );
}