import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define message type
interface Message {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
  role: "host" | "participant";
}

const Chat = ({setShowEmojiPicker, emojiPickerRef}:{setShowEmojiPicker:any, emojiPickerRef:any}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample messages data
  const messages: Message[] = [
    { id: 1, sender: "John Doe", message: "Hello, how are you?", timestamp: "2022-01-01 12:00:00", role: "host" },
    { id: 2, sender: "Lolloy", message: "Hello, I am good", timestamp: "2022-01-01 01:05:00", role: "participant" },
    { id: 3, sender: "Kavya", message: "Hello, how are you John?", timestamp: "2022-01-01 02:10:00", role: "participant" },
    { id: 4, sender: "John Doe", message: "Hello, I am good Kavya", timestamp: "2022-01-01 04:54:00", role: "host" },
    { id: 5, sender: "Kavya", message: "Have you done that work?", timestamp: "2022-01-01 05:09:00", role: "participant" },
    { id: 6, sender: "John Doe", message: "No, not yet. I'll complete it soon.", timestamp: "2022-01-01 11:03:00", role: "host" },
    { id: 7, sender: "Lolloy", message: "You guys are lazy", timestamp: "2022-02-01 11:05:00", role: "participant" },
    { id: 5, sender: "Kavya", message: "Have you done that work?", timestamp: "2022-01-01 05:09:00", role: "participant" },
    { id: 6, sender: "John Doe", message: "No, not yet. I'll complete it soon.", timestamp: "2022-01-01 11:03:00", role: "host" },
    { id: 7, sender: "Lolloy", message: "You guys are lazy", timestamp: "2022-02-01 11:05:00", role: "participant" },
  ];

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
      <div className="flex-grow overflow-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat ${msg.role === "host" ? "chat-end" : "chat-start"}`}>
              <div className="chat-image avatar">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${msg.sender}`} />
                  <AvatarFallback>{msg.sender.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="chat-header">
                {msg.sender}
                <time className="text-xs opacity-50 ml-2">{formatTime(msg.timestamp)}</time>
              </div>
              <div
                className={`chat-bubble ${
                  msg.role === "host"
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.message}
              </div>
              <div className="chat-footer opacity-50">{msg.role === "host" ? "Delivered" : ""}</div>
            </div>
          ))}
          {/* Scroll Anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Bar */}
      
    </div>
  );
};

export default Chat;
