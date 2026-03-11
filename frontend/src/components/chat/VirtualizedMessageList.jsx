import { memo, useEffect, useRef, useMemo } from "react"
import Message from "./Message"

const VirtualizedMessageList = memo(({ messages = [], onReaction, user }) => {

  const bottomRef = useRef(null)

  const userId = user?._id

  /* Normalize messages */

  const normalizedMessages = useMemo(() => {
    return messages.map((msg) => {
      const senderId = msg?.senderId || msg?.sender?._id
      return {
        ...msg,
        isOwn: senderId === userId
      }
    })
  }, [messages, userId])

  /* Auto-scroll */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [normalizedMessages.length])

  if (!normalizedMessages.length) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400 text-sm">
        No messages yet
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">

      {normalizedMessages.map((message) => (
        <Message
          key={message._id || message.id}
          message={message}
          isOwn={message.isOwn}
          onReaction={onReaction}
          user={user}
        />
      ))}

      <div ref={bottomRef} />

    </div>
  )
})

VirtualizedMessageList.displayName = "VirtualizedMessageList"

export default VirtualizedMessageList