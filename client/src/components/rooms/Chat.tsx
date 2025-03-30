import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessageStore } from "@/stores/useMessageStore";
import { useAuthStore } from "@/stores/useAuthStore";

interface ChatProps {
  setShowEmojiPicker: (show: boolean) => void;
  emojiPickerRef: React.RefObject<HTMLDivElement | null>;
  roomId: string
}

const Chat = ({setShowEmojiPicker, emojiPickerRef, roomId}: ChatProps) => {
  const {user} = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {messages, getMessages, isGettingMessages} = useMessageStore();

  useEffect(() => {
   const res = getMessages(roomId);
   console.log(res);
   console.log("what is response")
  }, [getMessages])

  console.log(messages, roomId, "this is from Chat messages");

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle click outside emoji picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  // Format timestamp to readable time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col min-w-full mx-auto h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4">
        <h2 className="text-lg font-bold">Chat Room</h2>
      </div>

      {/* Messages Scrollable Area */}
      {
        !isGettingMessages ? (
          <div className="flex-grow overflow-auto p-4 bg-purple-900">
        <div className="space-y-4">
          {
            messages.length === 0 && (
              <div>
                <p className="text-center text-gray-400">No messages yet</p>
              </div>
            )
          }
          {messages.map((msg) => (
            <div key={msg._id} className={`chat ${msg.sender?._id === user?._id ? "chat-end" : "chat-start"}`}>
              <div className="chat-image avatar">
                <Avatar>
                  <AvatarImage src={`${msg.sender.profilePicture}`} />
                  <AvatarFallback>{msg.sender.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="chat-header">
                {msg.sender.name}
                <time className="text-xs opacity-50 ml-2">{formatTime(msg.createdAt?.toString() ?? "")}</time>
              </div>
              <div
                className={`chat-bubble ${
                  msg.sender._id === user?._id
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.message}
              </div>
              <div className="chat-footer opacity-50">{msg.sender._id === user?._id ? "Delivered" : ""}</div>
            </div>
          ))}
          {/* Scroll Anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>
        ):(
          <div>Loading...</div>
        )
      }

      {/* Fixed Input Bar */}
      
    </div>
  );
};

export default Chat;
