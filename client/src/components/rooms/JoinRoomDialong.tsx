import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IRoom } from '@/utils/interfaces';

interface RoomJoinDialogProps {
  room: IRoom;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: () => void;
}

const RoomJoinDialog: React.FC<RoomJoinDialogProps> = ({
  room,
  isOpen,
  onOpenChange,
  onJoin
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-purple-800 to-indigo-900 border-none text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Join Room
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Are you sure you want to join the room?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-200 font-semibold">
            {room.name}
          </p>
        </div>
        
        <DialogFooter className="flex space-x-4">
          <Button 
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="
              border-purple-600 
              text-white 
              bg-transparent
              hover:bg-purple-700/30 
              transition-colors 
              duration-300
            "
          >
            Cancel
          </Button>
          <Button 
            onClick={onJoin}
            className="
              bg-gradient-to-r 
              from-pink-500 
              to-purple-600 
              hover:from-pink-600 
              hover:to-purple-700 
              text-white 
              transition-all 
              duration-300 
              hover:scale-105
            "
          >
            Join Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomJoinDialog;