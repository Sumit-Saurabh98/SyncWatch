import { useRoomStore } from "@/stores/useRoomStore";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Smile, Send } from "lucide-react";
import {
  Users,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  MessageSquare,
  X,
} from "lucide-react";
import { Captions } from "lucide-react";
import LoadingPage from "@/components/LoadingPage";
import Chat from "@/components/rooms/Chat";
import { useMessageStore } from "@/stores/useMessageStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { BeatLoader } from "react-spinners";
import { getSocket } from "@/socket/socket.client";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const SingleRoomPage = () => {
  const [message, setMessage] = useState<string>("");
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const { _id } = useParams<{ _id: string }>();
  const {user} = useAuthStore();
  const {sendMessages, isSendingMessages} = useMessageStore();
  const {
    isGettingRoomById,
    singleRoom,
    getRoomById
  } = useRoomStore();
  const [showChat, setShowChat] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const playerRef = useRef<any>(null);
  const [captionsOn, setCaptionsOn] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join_room", _id as string)

    return () =>{
      socket.off("join_room")
    }
  }, [_id])

  const initializeYoutubePlayer = useCallback((videoId: string) => {
    if (window.YT && window.YT.Player) {
      createPlayer(videoId);
    } else {
      window.onYouTubeIframeAPIReady = () => {
        createPlayer(videoId);
      };
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      if (!existingScript) {
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
        cc_load_policy: 0,
        autoplay: 0,
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
  }, [getRoomById, _id]);

  useEffect(() => {
    if (singleRoom && singleRoom[0]) {
      const videoId = singleRoom[0].videoId;
      if (videoId) {
        initializeYoutubePlayer(videoId);
      }
    }
    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, [singleRoom, initializeYoutubePlayer]);

  const onPlayerReady = (event: any) => {
    event.target.pauseVideo();
    setIsPlaying(false);
  };

  const onPlayerStateChange = (event: any) => {
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

  const handleToggleCaptions = () => {
    if (!player) return;
    if (captionsOn) {
      player.unloadModule("captions");
    } else {
      player.loadModule("captions");
      player.setOption("captions", "track", { languageCode: "en" });
    }
    setCaptionsOn(!captionsOn);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  if (isGettingRoomById || !singleRoom || !singleRoom[0]) {
    return <LoadingPage />;
  }

  const {
    createdBy,
    participants,
    isLive,
  } = singleRoom[0];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      if(!user) return;
      await sendMessages(message, _id as string);
      setMessage("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white h-screen flex flex-col overflow-hidden">
      <header className="px-6 py-3 border-b border-indigo-700/50 bg-indigo-900/30 backdrop-blur-md flex-shrink-0">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
              SyncWatch
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-gray-300">
              <span className={`h-2 w-2 ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-500"} rounded-full`}></span>
              <span>{isLive ? "LIVE" : "UPCOMING"}</span>
            </div>
            <span className="text-xs text-gray-300">•</span>
            <div className="flex items-center gap-1 text-xs text-gray-300">
              <Users className="h-3 w-3" />
              <span>{participants?.length || 1} watching</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Chat Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleChat}
              className="flex items-center gap-1 text-white hover:text-pink-400 hover:bg-transparent"
            >
              {showChat ? (
                <>
                  <X onClick={()=>setShowChat(false)} size={16} /> Hide Chat
                </>
              ) : (
                <>
                  <MessageSquare size={16} /> Show Chat
                </>
              )}
            </Button>
            <Link to="/rooms">
              <Button
                variant="ghost"
                className="text-white hover:text-pink-400 hover:bg-transparent"
              >
                Back to Rooms
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Video Section - Left Side (larger) */}
        <div className={`${!showChat ? 'w-full' : 'w-2/3'} h-full flex flex-col p-4 transition-all duration-300`}>
          <div className="flex-1 flex flex-col bg-indigo-900/30 backdrop-blur-sm rounded-xl border border-indigo-500/40 shadow-xl overflow-hidden">
            {/* Video Controls Header */}
            <div className="flex justify-between items-center p-3 border-b border-indigo-700/50">
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
              
              
            </div>

            {/* YouTube Player */}
            <div className="flex-1 relative">
              <div id="youtube-player" className="absolute inset-0 w-full h-full"></div>
              
              {/* Video Controls Overlay */}
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
                  className="h-12 w-12 rounded-full bg-pink-500/80 hover:bg-pink-500 text-white border-0"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 pl-1" />
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
                <Button
                  onClick={handleToggleCaptions}
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 rounded-full ${
                    captionsOn
                      ? "bg-indigo-500/70 hover:bg-indigo-600"
                      : "bg-indigo-500/30 hover:bg-indigo-500/70"
                  } text-white border-0`}
                >
                  <Captions className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat Section - Right Side */}
        {showChat && (
          <div className="w-1/3 h-full flex flex-col p-4">
            <div className="flex-1 flex flex-col bg-indigo-900/30 backdrop-blur-sm rounded-xl border border-indigo-500/40 shadow-xl overflow-hidden">
              <div className="p-3 border-b border-indigo-700/50 flex justify-between items-center">
                <h2 className="text-sm font-medium">Live Chat</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-300 hover:text-white"
                  onClick={toggleChat}
                >
                  <X size={16} />
                </Button>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <Chat 
                  setShowEmojiPicker={setShowEmojiPicker} 
                  emojiPickerRef={emojiPickerRef!} 
                  roomId={_id as string}
                />
              </div>
              
              {/* Chat Input */}
              <div className="p-3 border-t border-indigo-700/50">
                <form onSubmit={handleSendMessage} className="flex relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-indigo-300 hover:text-pink-500"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile size={20} />
                  </Button>
                  
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full py-2 pl-10 pr-12 rounded-lg bg-indigo-800/40 border-indigo-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white placeholder-indigo-300"
                    placeholder="Type a message..."
                  />
                  
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 rounded-full p-1 h-8 w-8"
                  >
                    {
                      isSendingMessages ? (
                        <BeatLoader color="white" size={10} className="h-5 w-5 text-white" />
                      ) : (
                        <Send className="h-5 w-5 text-white" />
                      )
                    }
                  </Button>
                  
                  {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-12 left-0 z-10">
                      <EmojiPicker
                        onEmojiClick={(emojiObject: EmojiClickData) => {
                          setMessage((prevMessage) => prevMessage + emojiObject.emoji);
                          setShowEmojiPicker(false);
                        }}
                      />
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleRoomPage;