import { useCallback } from "react";

export default function MessageInputForm({
  selectedUserId,
  newMessage,
  setNewMessage,
  sendMessage,
}) {

  if (!selectedUserId) return null;

  const handleChange = useCallback((e) => {
    setNewMessage(e.target.value);
  }, [setNewMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(e);
  };

  return (
    <form onSubmit={handleSubmit} className="relative m-4 w-full">
      <input
        type="text"
        id="message-input"
        value={newMessage}
        onChange={handleChange}
        placeholder="Your Message"
        className="w-full px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="off"
      />

      <button
        type="submit"
        disabled={!newMessage.trim()}
        className="absolute right-0 top-0 aspect-square h-full text-white hover:text-blue-400 disabled:opacity-40"
        aria-label="Send message"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12.73a59.769 59.769 0 0 1-18.216 9.605L6 12Z"
          />
        </svg>
      </button>
    </form>
  );
}