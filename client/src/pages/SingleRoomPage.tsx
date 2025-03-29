import { useRoomStore } from "@/stores/useRoomStore";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Maximize2,
  Minimize2,
  Send,
  Users,
  MessageSquare,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  Smile,
  ClosedCaptions
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/useAuthStore";
import LoadingPage from "@/components/LoadingPage";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any; // Add YT to the window interface
  }
}

const EMOJIS = [
  "😀",
  "😂",
  "🤣",
  "😊",
  "😍",
  "🔥",
  "👍",
  "❤️",
  "👏",
  "😮",
  "🎉",
  "🙌",
  "😭",
  "🤔",
  "👀",
  "💯",
];

interface ChatMessage {
  id: number;
  user: {
    name: string;
    profilePicture: string;
  };
  message: string;
  timestamp: Date;
}

const SingleRoomPage = () => {
  const { _id } = useParams<{ _id: string }>(); //useParams can return undefined so it need type check
  const {
    isGettingRoomById,
    singleRoom,
    getRoomById,
    getAllRooms,
    isGettingAllRooms,
    rooms,
  } = useRoomStore();
  const { user } = useAuthStore();
  const [isMaximized, setIsMaximized] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      user: { name: "Alice", profilePicture: "" },
      message: "This is amazing! 🔥",
      timestamp: new Date(),
    },
    {
      id: 2,
      user: { name: "Bob", profilePicture: "" },
      message:
        "I love this part! The way they explained the concept is brilliant.",
      timestamp: new Date(Date.now() - 5 * 60000),
    },
    {
      id: 3,
      user: { name: "Charlie", profilePicture: "" },
      message:
        "Can't wait to see what happens next! Anyone else excited about the upcoming section?",
      timestamp: new Date(Date.now() - 10 * 60000),
    },
    {
      id: 4,
      user: { name: "David", profilePicture: "" },
      message: "First time watching this, and I'm already hooked! 👍",
      timestamp: new Date(Date.now() - 15 * 60000),
    },
    {
      id: 5,
      user: { name: "Emily", profilePicture: "" },
      message: "Does anyone know if there's a follow-up video to this one?",
      timestamp: new Date(Date.now() - 20 * 60000),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [showReactions, setShowReactions] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const playerRef = useRef<any>(null);

  // Function to extract video ID from URL
  const getVideoId = useCallback((url: string) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : "";
  }, []);

  // YouTube API initialization function
  const initializeYoutubePlayer = useCallback((videoId: string) => {
    if (window.YT && window.YT.Player) {
      // If the YouTube API is already loaded, create the player immediately
      createPlayer(videoId);
    } else {
      // If the YouTube API is not loaded, set the onYouTubeIframeAPIReady callback
      window.onYouTubeIframeAPIReady = () => {
        createPlayer(videoId);
      };

      // Check if the script is already added
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      if (!existingScript) {
        // Load the YouTube API script
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    }
  }, []);

  const createPlayer = (videoId: string) => {
    playerRef.current = new window.YT.Player("youtube-player", {
      videoId: videoId,
      playerVars: {
        playsinline: 1,
        controls: 0,
        disablekb: 1,
        rel: 0,
        modestbranding: 1,
        showinfo: 0,
        enablejsapi: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
    setPlayer(playerRef.current);
  };

  useEffect(() => {
    getRoomById(_id as string);
    if (!isGettingAllRooms && rooms.length === 0) {
      getAllRooms();
    }
  }, [getRoomById, getAllRooms, _id, isGettingAllRooms, rooms.length]);

  useEffect(() => {
    // Load YouTube iframe API when singleRoom is available
    if (singleRoom && singleRoom[0]) {
      const videoId = getVideoId(singleRoom[0].videoUrl);
      if (videoId) {
        initializeYoutubePlayer(videoId);
      }
    }

    return () => {
      // Cleanup function to destroy the player when the component unmounts
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
      window.onYouTubeIframeAPIReady = () => {}; // Reset the callback
    };
  }, [singleRoom, getVideoId, initializeYoutubePlayer]);

  useEffect(() => {
    // Scroll to bottom of chat when new messages arrive
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const onPlayerReady = (event: any) => {
    // Player is ready
    event.target.playVideo();
    setIsPlaying(true);
  };

  const onPlayerStateChange = (event: any) => {
    // Update playing state based on player state
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
  };

  const handlePlayPause = () => {
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }

    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    if (!player) return;

    const currentTime = player.getCurrentTime();
    player.seekTo(currentTime + 5, true);
  };

  const handleSkipBackward = () => {
    if (!player) return;

    const currentTime = player.getCurrentTime();
    player.seekTo(Math.max(0, currentTime - 5), true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: chatMessages.length + 1,
      user: {
        name: user?.name || "You",
        profilePicture: user?.profilePicture || "",
      },
      message: newMessage,
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage("");
  };

  const addEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isGettingRoomById || !singleRoom || !singleRoom[0]) {
    return <LoadingPage />;
  }

  const {
    videoUrl,
    name,
    description,
    createdBy,
    category,
    participants,
    isLive,
  } = singleRoom[0];

  const otherRooms = rooms.filter((room) => room._id !== _id);

  return (
    <div className="bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white">
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="px-6 py-3 border-b border-indigo-700/50 bg-indigo-900/30 backdrop-blur-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl cursor-pointer font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
                SyncWatch
              </span>
            </Link>
            <Link to="/rooms">
              <Button
                variant="ghost"
                className="text-white hover:text-pink-400 hover:bg-transparent"
              >
                Back to Rooms
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 container mx-auto px-4 py-2 flex flex-col h-[calc(100vh-60px)]">
          {/* Room Info */}
          <div className="mb-2">
            <h1 className="text-xl font-medium mb-1">{name}</h1>
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <div className="flex items-center gap-1">
                <span
                  className={`h-2 w-2 ${
                    isLive ? "bg-green-500 animate-pulse" : "bg-gray-500"
                  } rounded-full`}
                ></span>
                <span>{isLive ? "LIVE" : "UPCOMING"}</span>
              </div>
              <span>•</span>
              <span>{category}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{participants?.length || 1} watching</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
            {/* Left Panel (Video + Chat) */}
            <div
              className={`${
                isMaximized ? "w-full" : "w-2/3"
              } flex flex-col gap-3 min-h-0`}
            >
              {/* Video Container */}
              <div className="relative flex-none rounded-xl overflow-hidden border border-indigo-500/40 shadow-xl bg-indigo-900/30 backdrop-blur-sm">
                <div className="flex justify-between items-center p-2 border-b border-indigo-700/50">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={createdBy.profilePicture} />
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-xs">
                        {createdBy.name?.split(" ")[0][0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium">{createdBy.name}</p>
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="text-xs text-gray-300">Host</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border-2 border-indigo-900 bg-gradient-to-br from-pink-400 to-purple-600"
                        ></div>
                      ))}
                      {participants?.length > 3 && (
                        <div className="w-6 h-6 rounded-full border-2 border-indigo-900 bg-indigo-800 flex items-center justify-center text-xs">
                          +{participants.length - 3}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-white hover:bg-indigo-700/50 h-8 w-8"
                      onClick={() => setShowReactions(!showReactions)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>

                    {showReactions && (
                      <div className="absolute top-12 right-12 bg-indigo-800/70 backdrop-blur-md rounded-xl p-2 shadow-lg border border-indigo-700/50 z-10">
                        <div className="flex gap-2">
                          {/* Example reactions - implement actual functionality */}
                          <div className="h-8 w-8 rounded-full bg-pink-500/20 flex items-center justify-center cursor-pointer hover:bg-pink-500/80 transition-all text-lg">
                            ❤️
                          </div>
                          <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center cursor-pointer hover:bg-blue-500/80 transition-all text-lg">
                            👍
                          </div>
                          <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center cursor-pointer hover:bg-yellow-500/80 transition-all text-lg">
                            🔥
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-indigo-700/50 h-8 w-8"
                      onClick={() => setIsMaximized(!isMaximized)}
                    >
                      {isMaximized ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="aspect-video w-full relative">
                  {/* YouTube Player */}
                  <div id="youtube-player" className="w-full h-full"></div>

                  {/* Custom Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-4">
                    <Button
                      onClick={handleSkipBackward}
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full bg-indigo-500/30 hover:bg-indigo-500/70 text-white border-0"
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>

                    <Button
                      onClick={handlePlayPause}
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-pink-500/80 hover:bg-pink-500 text-white border-0"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>

                    <Button
                      onClick={handleSkipForward}
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full bg-indigo-500/30 hover:bg-indigo-500/70 text-white border-0"
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chat Section */}
              <div className="flex-1 overflow-hidden rounded-xl border border-indigo-500/40 shadow-lg bg-indigo-900/30 backdrop-blur-sm flex flex-col">
                <div className="p-2 border-b border-indigo-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-pink-500" />
                    <h2 className="font-medium text-sm">Live Chat</h2>
                  </div>
                  <div className="text-xs px-2 py-0.5 bg-pink-500/90 rounded-md">
                    LIVE
                  </div>
                </div>

                <ScrollArea className="flex-1 h-full px-2">
                  <div className="py-3 space-y-3">
                    {chatMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        className="flex items-start gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Avatar className="h-7 w-7 flex-shrink-0">
                          <AvatarImage src={msg.user.profilePicture} />
                          <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-600 text-xs">
                            {msg.user.name?.split(" ")[0][0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-sm">
                              {msg.user.name}
                            </p>
                            <span className="text-xs text-gray-400">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-200 break-words">
                            {msg.message}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-2 border-t border-indigo-700/50">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="bg-indigo-800/50 border-indigo-700 focus:border-pink-500 text-white text-sm h-8"
                    />

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="bg-indigo-800/50 hover:bg-indigo-700 border-indigo-700 h-8 w-8 p-0"
                        >
                          <Smile className="h-4 w-4 text-gray-300" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2 bg-indigo-800/90 backdrop-blur-md border-indigo-700 shadow-xl">
                        <div className="grid grid-cols-8 gap-1">
                          {EMOJIS.map((emoji, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-indigo-700/70"
                              onClick={() => addEmoji(emoji)}
                            >
                              <span className="text-lg">{emoji}</span>
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 h-8 w-8 p-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Panel (Other Rooms) - Only visible when not maximized */}
            {!isMaximized && (
              <div className="w-1/3 flex flex-col rounded-xl border border-indigo-500/40 shadow-lg bg-indigo-900/30 backdrop-blur-sm overflow-hidden">
                <div className="p-2 border-b border-indigo-700/50 flex items-center justify-between">
                  <h2 className="font-medium flex items-center gap-2 text-sm">
                    <Play className="h-4 w-4 text-pink-500" />
                    <span>Other Rooms</span>
                  </h2>
                  <div className="text-xs px-2 py-0.5 bg-indigo-800/80 rounded-full flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{rooms.length}</span>
                  </div>
                </div>

                <ScrollArea className="flex-1 h-full">
                  <div className="grid grid-cols-1 gap-2 p-2">
                    {isGettingAllRooms ? (
                      <div className="text-center py-4 text-sm">
                        Loading rooms...
                      </div>
                    ) : otherRooms.length > 0 ? (
                      <>
                        {/* First 3 rooms shown by default */}
                        {otherRooms.slice(0, 3).map((room, index) => (
                          <motion.div
                            key={room._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="mb-2"
                          >
                            <Link to={`/room/${room._id}`}>
                              <Card className="bg-indigo-800/40 border-indigo-700/50 hover:border-pink-500/50 transition cursor-pointer hover:bg-indigo-800/60 group">
                                <CardContent className="p-2">
                                  <div className="aspect-video w-full mb-2 overflow-hidden rounded-md relative group-hover:shadow-md group-hover:shadow-pink-500/20 transition">
                                    <img
                                      src={
                                        room.thumbnailUrl ||
                                        `/api/placeholder/400/225`
                                      }
                                      alt={room.name}
                                      className="w-full h-full object-cover transition group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent opacity-70"></div>
                                    <div className="absolute bottom-1 right-1 text-xs px-1 py-0.5 bg-pink-500/90 rounded-md">
                                      {room.isLive ? "LIVE" : "UPCOMING"}
                                    </div>
                                  </div>
                                  <h3 className="font-medium text-xs truncate group-hover:text-pink-400 transition">
                                    {room.name}
                                  </h3>
                                  <div className="flex items-center justify-between mt-1 text-xs text-gray-300">
                                    <div className="flex items-center gap-1">
                                      <Avatar className="h-4 w-4">
                                        <AvatarImage
                                          src={room.createdBy.profilePicture}
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-600 text-[8px]">
                                          {
                                            room.createdBy.name?.split(
                                              " "
                                            )[0][0]
                                          }
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-xs truncate max-w-20">
                                        {room.createdBy.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      <span>
                                        {room.participants?.length || 0}
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </motion.div>
                        ))}

                        {/* Scrollable additional rooms */}
                        {otherRooms.length > 3 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-2 px-1">
                              More rooms:
                            </p>
                            {otherRooms.slice(3).map((room, index) => (
                              <motion.div
                                key={room._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: (index + 3) * 0.1,
                                }}
                                className="mb-2"
                              >
                                <Link to={`/room/${room._id}`}>
                                  <Card className="bg-indigo-800/40 border-indigo-700/50 hover:border-pink-500/50 transition cursor-pointer hover:bg-indigo-800/60 group">
                                    <CardContent className="p-2">
                                      <div className="aspect-video w-full mb-2 overflow-hidden rounded-md relative group-hover:shadow-md group-hover:shadow-pink-500/20 transition">
                                        <img
                                          src={
                                            room.thumbnailUrl ||
                                            `/api/placeholder/400/225`
                                          }
                                          alt={room.name}
                                          className="w-full h-full object-cover transition group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent opacity-70"></div>
                                        <div className="absolute bottom-1 right-1 text-xs px-1 py-0.5 bg-pink-500/90 rounded-md">
                                          {room.isLive ? "LIVE" : "UPCOMING"}
                                        </div>
                                      </div>
                                      <h3 className="font-medium text-xs truncate group-hover:text-pink-400 transition">
                                        {room.name}
                                      </h3>
                                      <div className="flex items-center justify-between mt-1 text-xs text-gray-300">
                                        <div className="flex items-center gap-1">
                                          <Avatar className="h-4 w-4">
                                            <AvatarImage
                                              src={
                                                room.createdBy.profilePicture
                                              }
                                            />
                                            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-600 text-[8px]">
                                              {
                                                room.createdBy.name?.split(
                                                  " "
                                                )[0][0]
                                              }
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="text-xs truncate max-w-20">
                                            {room.createdBy.name}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Users className="h-3 w-3" />
                                          <span>
                                            {room.participants?.length || 0}
                                          </span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-400 text-sm">
                        No other rooms available
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-2 border-t border-indigo-700/50">
                  <Link to="/rooms">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 text-xs py-1 h-8">
                      Browse All Rooms
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleRoomPage;
