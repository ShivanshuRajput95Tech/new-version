import { useEffect, useRef, memo } from "react";

const ChatMessages = ({ messages = [], userDetails, selectedUserId }) => {
  const messagesContainerRef = useRef(null);

  /* Auto-scroll when messages update */
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  if (!selectedUserId) return null;

  const userId = userDetails?._id;

  return (
    <div
      ref={messagesContainerRef}
      className="absolute bottom-24 left-0 w-full px-7 lg:px-20 overflow-y-auto"
    >
      {messages.length ? (
        <div className="flex flex-col gap-2">
          {messages.map((message) => {
            const isSender = message.sender === userId;

            return (
              <div
                key={message._id || message.id}
                className={`text-white relative rounded-b-2xl px-5 py-3 max-w-[500px] break-words ${
                  isSender
                    ? "bg-blue-700 self-end rounded-l-2xl"
                    : "bg-blue-600 self-start rounded-r-2xl"
                }`}
              >
                {message.text}

                <div
                  className={`absolute top-0 w-0 h-0 border-b-[20px] border-b-transparent ${
                    isSender
                      ? "-right-4 border-l-blue-700 border-l-[20px]"
                      : "-left-4 border-r-blue-600 border-r-[20px]"
                  }`}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-500 flex items-center justify-center h-full">
          Start a conversation
        </div>
      )}
    </div>
  );
};

export default memo(ChatMessages);