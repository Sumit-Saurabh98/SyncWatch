import { useRoomStore } from "@/stores/useRoomStore";
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  Smile,
  Send,
  FastForward,
  Rewind,
  Sliders,
  VolumeX,
  Volume,
  Users,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  MessageSquare,
  X,
  Captions,
} from "lucide-react";
import LoadingPage from "@/components/LoadingPage";
import Chat from "@/components/rooms/Chat";
import { useMessageStore } from "@/stores/useMessageStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { BeatLoader } from "react-spinners";
import { getSocket } from "@/socket/socket.client";
import ReactPlayer from "react-player";

const SingleRoomPage = () => {
  // Player related state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState<boolean>(false);
  const [playedPercentage, setPlayedPercentage] = useState<number>(0);
  const playerRef = useRef<ReactPlayer>(null);

  // Chat related state
  const [message, setMessage] = useState<string>("");
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showChat, setShowChat] = useState(true);

  // Get room ID from URL
  const { _id } = useParams<{ _id: string }>();

  // Store hooks
  const { user } = useAuthStore();
  const { sendMessages, isSendingMessages } = useMessageStore();
  const { isGettingRoomById, singleRoom, getRoomById } = useRoomStore();

  // Join room socket on component mount
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join_room", _id as string);

    return () => {
      socket.off("join_room");
    };
  }, [_id]);

  // Fetch room data
  useEffect(() => {
    getRoomById(_id as string);
  }, [getRoomById, _id]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && user) {
      await sendMessages(message, _id as string);
      setMessage("");
    }
  };

  // Video player controls
  const handleSeekForward = () => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime() || 0;
    playerRef.current.seekTo(currentTime + 10);
  };

  const handleSeekBackward = () => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime() || 0;
    playerRef.current.seekTo(Math.max(0, currentTime - 10));
  };

  const toggleSubtitles = () => {
    const youtubePlayer = playerRef.current?.getInternalPlayer() as any;
    if (youtubePlayer?.loadModule && youtubePlayer?.unloadModule) {
      if (subtitlesEnabled) {
        youtubePlayer.unloadModule("captions");
      } else {
        youtubePlayer.loadModule("captions");
      }
      setSubtitlesEnabled(!subtitlesEnabled);
    }
  };

  // Show loading while fetching room data
  if (isGettingRoomById || !singleRoom || !singleRoom[0]) {
    return <LoadingPage />;
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-6 py-3 border-b border-indigo-700/50 bg-indigo-900/30 backdrop-blur-md flex-shrink-0">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
              SyncWatch
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-gray-300">
              <span
                className={`h-2 w-2 ${
                  singleRoom[0].isLive
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-500"
                } rounded-full`}
              ></span>
              <span>{singleRoom[0].isLive ? "LIVE" : "UPCOMING"}</span>
            </div>
            <span className="text-xs text-gray-300">•</span>
            <div className="flex items-center gap-1 text-xs text-gray-300">
              <Users className="h-3 w-3" />
              <span>{singleRoom[0].participants?.length || 1} watching</span>
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
                  <X size={16} /> Hide Chat
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Section - Left Side (adjusts based on chat visibility) */}
        <div
          className={`${
            !showChat ? "w-full" : "w-2/3"
          } h-full flex flex-col p-4 transition-all duration-300`}
        >
          <div className="flex-1 flex flex-col bg-indigo-900/30 backdrop-blur-sm rounded-xl border border-indigo-500/40 shadow-xl overflow-hidden relative">
            {/* Video Controls Header */}
            <div className="flex justify-between items-center p-3 border-b border-indigo-700/50">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={singleRoom[0].createdBy.profilePicture} />
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-xs">
                    {singleRoom[0].createdBy.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium">
                    {singleRoom[0].createdBy.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-xs text-gray-300">Host</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-pink-400 hover:bg-transparent"
                  onClick={toggleSubtitles}
                >
                  <Captions
                    size={16}
                    className={
                      subtitlesEnabled ? "text-pink-400" : "text-white"
                    }
                  />
                </Button>
              </div>
            </div>

            {/* Video Player Container */}
            <div className="relative w-full h-full flex-1">
              <ReactPlayer
                url={singleRoom[0].videoUrl}
                ref={playerRef}
                playing={isPlaying}
                volume={volume}
                muted={isMuted}
                playbackRate={playbackRate}
                onProgress={(state) => {
                  setPlayedPercentage(state.played * 100);
                }}
                width="100%"
                height="100%"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  pointerEvents: "none",
                }}
                config={{
                  youtube: {
                    playerVars: {
                      cc_load_policy: 1,
                      modestbranding: 1,
                      disablekb: 1,
                      rel: 0,
                      fs: 0,
                      playsinline: 1,
                    },
                  },
                }}
              />
            </div>

            {/* Video Controls */}
            <div className="p-3 border-t border-indigo-700/50 bg-indigo-900/50 backdrop-blur-sm">
              <div className="flex flex-col gap-2">
                {/* Progress Bar (Could be implemented with actual progress) */}
                <div className="w-full h-1 bg-indigo-700/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
                    style={{ width: `${playedPercentage}%` }}
                  ></div>
                </div>

                {/* Control Buttons */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-pink-400 hover:bg-transparent p-1"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-pink-400 hover:bg-transparent p-1"
                      onClick={handleSeekBackward}
                    >
                      <Rewind size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-pink-400 hover:bg-transparent p-1"
                      onClick={handleSeekForward}
                    >
                      <FastForward size={18} />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:text-pink-400 hover:bg-transparent p-1"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <VolumeX size={18} /> : <Volume size={18} />}
                      </Button>
                      <div className="w-24">
                        <Slider
                          value={[volume * 100]}
                          onValueChange={(value: number[]) =>
                            setVolume(value[0] / 100)
                          }
                          className="h-1"
                          disabled={isMuted}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-pink-400 hover:bg-transparent p-1"
                      onClick={() =>
                        setPlaybackRate(playbackRate === 1 ? 1.5 : 1)
                      }
                    >
                      {playbackRate === 1 ? "1x" : "1.5x"}
                    </Button>
                  </div>
                </div>
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
                  emojiPickerRef={emojiPickerRef}
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
                    disabled={isSendingMessages}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 rounded-full p-1 h-8 w-8"
                  >
                    {isSendingMessages ? (
                      <BeatLoader color="white" size={6} />
                    ) : (
                      <Send className="h-4 w-4 text-white" />
                    )}
                  </Button>

                  {showEmojiPicker && (
                    <div
                      ref={emojiPickerRef}
                      className="absolute bottom-12 left-0 z-10"
                    >
                      <EmojiPicker
                        onEmojiClick={(emojiObject: EmojiClickData) => {
                          setMessage(
                            (prevMessage) => prevMessage + emojiObject.emoji
                          );
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
