import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RoomCard, { RoomData } from './RoomCard';

interface RoomsCarouselProps {
  rooms: RoomData[];
  category: string;
  onCategoryChange: (category: string) => void;
}

const RoomCarousel: React.FC<RoomsCarouselProps> = ({ 
  rooms, 
  category, 
  onCategoryChange 
}) => {
  const categories = [
    'All', 'Technology', 'Music', 'Gaming', 
    'Business', 'Education', 'Comedy', 'Sports', 'Science'
  ];

  const filteredRooms = rooms.filter(room => 
    category === 'All' || room.category === category
  );

  return (
    <motion.div 
      className="w-full py-8 px-4 md:px-8 lg:px-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
          {category} Rooms
        </h2>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full md:w-[180px] bg-indigo-800/50 border-indigo-700/50 text-white">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="bg-indigo-900 border-indigo-700/50 text-white">
            {categories.map((cat) => (
              <SelectItem 
                key={cat} 
                value={cat} 
                className="hover:bg-pink-500/20 focus:bg-pink-500/30"
              >
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {filteredRooms.map((room) => (
            <CarouselItem 
              key={room._id} 
              className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="h-full">
                <RoomCard room={room} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-4 bg-purple-500/20 hover:bg-purple-500/40 text-white" />
          <CarouselNext className="right-4 bg-purple-500/20 hover:bg-purple-500/40 text-white" />
        </div>
      </Carousel>

      {filteredRooms.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No rooms found in the {category} category
        </div>
      )}
    </motion.div>
  );
};

export default RoomCarousel;