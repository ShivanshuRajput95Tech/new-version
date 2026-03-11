import ChatLayout from "../components/layout/ChatLayout"
import Conversations from "../components/chat/Conversations"
import ChatArea from "../components/chat/ChatArea"

export default function Chat() {

  return (
    <ChatLayout
      sidebar={<Conversations />}
      main={<ChatArea />}
    />
  )

}