import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Image,
  File,
  X,
  Loader
} from "lucide-react";
import { startTyping, stopTyping } from "../../websocket/socket";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export default function MessageInput({ onSendMessage, placeholder = "Type a message..." }) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fileRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleSend = useCallback(() => {
    const message = text.trim();
    if (!message && attachments.length === 0) return;

    onSendMessage({
      text: message,
      attachments,
      timestamp: new Date().toISOString()
    });

    attachments.forEach(a => {
      if (a.url?.startsWith("blob:")) URL.revokeObjectURL(a.url);
    });

    setText("");
    setAttachments([]);
    setIsTyping(false);
    stopTyping?.();
  }, [text, attachments, onSendMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setText(value);

    if (value && !isTyping) {
      setIsTyping(true);
      startTyping?.();
    }

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping?.();
    }, 2000);
  }, [isTyping]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);

    try {
      const newAttachments = files
        .filter(file => {
          if (file.size > MAX_FILE_SIZE) {
            toast.error(`${file.name} exceeds 100MB`);
            return false;
          }
          return true;
        })
        .map(file => ({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          uploadProgress: 100
        }));

      setAttachments(prev => [...prev, ...newAttachments]);

      if (newAttachments.length)
        toast.success(`Added ${newAttachments.length} file(s)`);
    } catch {
      toast.error("Failed to add files");
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = (id) => {
    setAttachments(prev => {
      const target = prev.find(a => a.id === id);
      if (target?.url?.startsWith("blob:")) URL.revokeObjectURL(target.url);
      return prev.filter(a => a.id !== id);
    });
  };

  const formatFileSize = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (type.startsWith("audio/")) return <Mic className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div className="p-4 bg-slate-800 border-t border-slate-700">

      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 space-y-2"
          >
            {attachments.map(a => (
              <div key={a.id} className="flex items-center gap-3 bg-slate-700 rounded-lg p-3">
                {getFileIcon(a.type)}

                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{a.name}</div>
                  <div className="text-xs text-slate-400">{formatFileSize(a.size)}</div>
                </div>

                <button
                  onClick={() => removeAttachment(a.id)}
                  className="text-slate-400 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-3">

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg disabled:opacity-50"
        >
          {isUploading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Paperclip className="w-5 h-5" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowEmojiPicker(v => !v)}
          className="p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
        >
          <Smile className="w-5 h-5" />
        </motion.button>

        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white resize-none min-h-[44px] max-h-32"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
            }}
          />

          <input
            ref={fileRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar"
            className="hidden"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!text.trim() && attachments.length === 0}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 px-6 py-3 rounded-lg flex items-center gap-2 text-white"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-slate-400 mt-2"
          >
            Typing...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}