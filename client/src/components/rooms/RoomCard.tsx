import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Play,
  Zap,
  Globe,
  Lock,
  Clock,
  ChevronDown,
  ChevronUp,
  Edit
} from "lucide-react";
import { IRoom } from "@/utils/interfaces";
import { useAuthStore } from "@/stores/useAuthStore";
import RoomJoinDialog from "./JoinRoomDialong";
import { useRoomStore } from "@/stores/useRoomStore";
import { BeatLoader } from "react-spinners";

interface RoomCardProps {
  room: IRoom;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const [isNameExpanded, setIsNameExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {user} = useAuthStore()
  const {joinPublicRoom, isJoiningPublicRoom} = useRoomStore();

  const handleJoinRoom = async() =>{
    if(isJoiningPublicRoom) return;
    const res = await joinPublicRoom(room._id);
    if(res){
      setIsOpen(false);
    }
  }

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const truncateText = (text: string, maxLength: number, isExpanded: boolean) => {
    if (isExpanded) return text;
    return text.length > maxLength 
      ? text.slice(0, maxLength).trim() + "..." 
      : text;
  };

  return (
    <motion.div
      className="w-full h-full"
    //   whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col border border-indigo-700 bg-gradient-to-br from-indigo-900 to-purple-900 shadow-lg hover:border-purple-700 rounded-xl overflow-hidden">
        <div className="relative w-full aspect-video">
          <img
            src={room.thumbnailUrl}
            alt={room.name}
            className="w-full h-full object-cover brightness-75 transition-all duration-300 hover:brightness-90"
          />
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <Badge
              variant="outline"
              className={
                room.isLive
                  ? "bg-red-500/80 text-white border-red-500/50"
                  : "bg-gray-600/80 text-gray-200 border-gray-500/50"
              }
            >
              {room.isLive ? <Zap className="h-4 w-4 mr-1" /> : <Clock className="h-4 w-4 mr-1" />}
              {room.isLive ? "LIVE" : "UPCOMING"}
            </Badge>
            <Badge
              variant="outline"
              className="bg-indigo-500/80 text-indigo-100 border-indigo-500/80"
            >
              {room.isPrivate ? <Lock className="h-4 w-4 mr-1" /> : <Globe className="h-4 w-4 mr-1" />}
              {room.isPrivate ? "PRIVATE" : "PUBLIC"}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-white bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-300 flex-grow">
              {truncateText(room.name, 50, isNameExpanded)}
            </h3>
            {room.name.length > 50 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsNameExpanded(!isNameExpanded)}
                className="ml-2"
              >
                {isNameExpanded ? (
                  <ChevronUp className="h-4 w-4 text-pink-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-pink-400" />
                )}
              </Button>
            )}
          </div>

          <div className="mb-4">
            <p className={`text-gray-300 text-sm ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
              {truncateText(room.description, 100, isDescriptionExpanded)}
            </p>
            {room.description.length > 100 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-1 text-pink-400 hover:text-pink-300"
              >
                {isDescriptionExpanded ? "Collapse" : "Read More"}
              </Button>
            )}
          </div>

          <Separator className="my-3 bg-indigo-700/50" />

          <div className="flex justify-between text-gray-400 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-pink-500" />
              <span>{room.participants.length} Participants</span>
            </div>
            <span>{formatDateTime(room.startDateTime)}</span>
          </div>

          {
            user?._id !== room.createdBy._id && !user?.joinedRooms.includes(room._id) && (
              <Button 
            onClick={() => setIsOpen(true)}
            className="mt-auto w-full bg-pink-500/20 border-2 border-pink-500/50 text-white hover:bg-pink-500/30 transition-all flex items-center justify-center"
          >
            <Play className="mr-2 h-4 w-4 text-pink-400" />
            {isJoiningPublicRoom ? <BeatLoader color="white" size={8} /> : "Join room"}
          </Button>
            ) 
          }
          {
            user?._id === room.createdBy._id && (
              <Button 
            className="mt-auto w-full bg-pink-500/20 border-2 border-pink-500/50 text-white hover:bg-pink-500/30 transition-all flex items-center justify-center"
          >
            <Edit className="mr-2 h-4 w-4 text-pink-400" />
            Edit room
          </Button>
            )
          }

          {
            user?.joinedRooms.includes(room._id) && user?._id !== room.createdBy._id && (
              <Button 
            className="mt-auto w-full bg-pink-500/20 border-2 border-pink-500/50 text-white hover:bg-pink-500/30 transition-all flex items-center justify-center"
          >
            <Play className="mr-2 h-4 w-4 text-pink-400" />
            Open room
          </Button>
            )
          }
        </CardContent>
      </Card>
      <RoomJoinDialog
        room={room}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onJoin={handleJoinRoom}
      />
    </motion.div>
  );
};

export default RoomCard;