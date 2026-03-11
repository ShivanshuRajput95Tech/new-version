import { useCallback } from "react"
import { useChatStore } from "../store/chatStore"
import { useAuthStore } from "../store/authStore"

export const useChat = () => {

    const user = useAuthStore((s) => s.user)
    const userId = user ? ._id || null

    const messages = useChatStore((s) => s.messages)
    const selectedUser = useChatStore((s) => s.selectedUser)
    const selectedGroup = useChatStore((s) => s.selectedGroup)
    const onlineUsers = useChatStore((s) => s.onlineUsers)
    const groups = useChatStore((s) => s.groups)
    const storeSendMessage = useChatStore((s) => s.sendMessage)

    /* Send message */

    const sendMessage = useCallback((text) => {

        const message = text ? .trim()

        if (!message || !userId) return
        if (!selectedUser && !selectedGroup) return

        storeSendMessage({
            text: message,
            senderId: userId,
            receiverId: selectedUser || null,
            groupId: selectedGroup || null
        })

    }, [storeSendMessage, userId, selectedUser, selectedGroup])

    /* Ownership check */

    const isOwnMessage = useCallback((message) => {

        const senderId =
            message ? .senderId ||
            message ? .sender ? ._id

        return senderId === userId

    }, [userId])

    return {
        user,
        messages,
        selectedUser,
        selectedGroup,
        onlineUsers,
        groups,
        sendMessage,
        isOwnMessage
    }

}