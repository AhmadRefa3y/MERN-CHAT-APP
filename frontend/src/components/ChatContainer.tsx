import { useEffect, useRef } from "react";
import useChatStore from "../store/chatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletonMessages ";
import useAuthStore from "../store/authstore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
    const {
        messages,
        selectedUser,
        getMessages,
        isMessagesLoading,
        subscribeToMessages,
        unSubscribeToMessages,
        subscribeToTyping,
        unSubscribeToTyping,
        isUserTyping,
    } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        getMessages(selectedUser?._id as string);
        subscribeToMessages();
        subscribeToTyping();

        return () => {
            unSubscribeToMessages();
            unSubscribeToTyping();
        };
    }, [getMessages, selectedUser]);
    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isUserTyping]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${
                            message.senderId === authUser._id
                                ? "chat-end"
                                : "chat-start"
                        }`}
                        ref={messageEndRef}
                    >
                        <div className=" chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.senderId === authUser._id
                                            ? authUser.profilePic ||
                                              "/avatar.png"
                                            : selectedUser?.profilePic ||
                                              "/avatar.png"
                                    }
                                    alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="Attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2 "
                                />
                            )}
                            {message.text && (
                                <p className="break-words">{message.text}</p>
                            )}
                        </div>
                    </div>
                ))}
                {isUserTyping && (
                    <div className="chat chat-start" ref={messageEndRef}>
                        <div className=" chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        selectedUser?.profilePic ||
                                        "/avatar.png"
                                    }
                                    alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className="chat-bubble flex items-center justify-center bg-secondary">
                            <div className="typingIndicatorBubbleDot"></div>
                            <div className="typingIndicatorBubbleDot"></div>
                            <div className="typingIndicatorBubbleDot"></div>
                        </div>
                    </div>
                )}
            </div>

            <MessageInput />
        </div>
    );
};
export default ChatContainer;
