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
  Upload,
  Loader
} from "lucide-react";
import { sendMessage, startTyping, stopTyping } from "../../websocket/socket";
import toast from "react-hot-toast";

export default function MessageInput({ onSendMessage, placeholder = "Type a message..." }) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef();
  const fileRef = useRef();
  const typingTimeoutRef = useRef();

  const handleSend = useCallback(() => {
    if (!text.trim() && attachments.length === 0) return;

    const messageData = {
      text: text.trim(),
      attachments: attachments,
      timestamp: new Date().toISOString()
    };

    onSendMessage(messageData);

    // Clear input
    setText("");
    setAttachments([]);
    setIsTyping(false);
    stopTyping && stopTyping();
  }, [text, attachments, onSendMessage]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setText(value);

    // Handle typing indicators
    if (value && !isTyping) {
      setIsTyping(true);
      startTyping && startTyping();
    } else if (!value && isTyping) {
      setIsTyping(false);
      stopTyping && stopTyping();
    }

    // Clear typing timeout
    clearTimeout(typingTimeoutRef.current);
    if (value) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        stopTyping && stopTyping();
      }, 2000);
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const newAttachments = [];

      for (const file of files) {
        // Validate file size (100MB limit)
        if (file.size > 100 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum size is 100MB.`);
          continue;
        }

        // Create attachment object
        const attachment = {
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file), // Temporary URL for preview
          uploadProgress: 0
        };

        newAttachments.push(attachment);

        // Simulate upload progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            attachment.uploadProgress = 100;
            setAttachments(prev => [...prev]);
          } else {
            attachment.uploadProgress = progress;
            setAttachments(prev => [...prev]);
          }
        }, 200);
      }

      setAttachments(prev => [...prev, ...newAttachments]);
      toast.success(`Added ${newAttachments.length} file(s)`);
    } catch (error) {
      toast.error("Failed to add files");
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => {
      const attachment = prev.find(a => a.id === attachmentId);
      if (attachment && attachment.url.startsWith('blob:')) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter(a => a.id !== attachmentId);
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('audio/')) return <Mic className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div className="p-4 bg-slate-800 border-t border-slate-700">
      {/* Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 space-y-2"
          >
            {attachments.map((attachment) => (
              <motion.div
                key={attachment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 bg-slate-700 rounded-lg p-3"
              >
                {getFileIcon(attachment.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {attachment.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatFileSize(attachment.size)}
                  </div>
                  {attachment.uploadProgress < 100 && (
                    <div className="w-full bg-slate-600 rounded-full h-1 mt-1">
                      <div
                        className="bg-indigo-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${attachment.uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="flex items-end gap-3">
        {/* File Upload Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {isUploading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Paperclip className="w-5 h-5" />
          )}
        </motion.button>

        {/* Emoji Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
        >
          <Smile className="w-5 h-5" />
        </motion.button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={text}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            rows={1}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none min-h-[44px] max-h-32"
            style={{
              height: 'auto',
              minHeight: '44px'
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
            }}
          />

          {/* Hidden file input */}
          <input
            ref={fileRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar"
            className="hidden"
          />
        </div>

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!text.trim() && attachments.length === 0}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 text-white font-medium"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Typing Indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-xs text-slate-400 mt-2"
          >
            Typing...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}