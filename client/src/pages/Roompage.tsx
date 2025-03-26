import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Filter, 
  Search, 
  Users,
  Play
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import Footer from '@/components/Footer';
import { data } from '@/lib/data';
import RoomCard, { RoomData } from '@/components/rooms/RoomCard';
import RoomNavbar from '@/components/rooms/RoomNavbar';

// Mock data - replace with actual data fetching logic
const mockRooms: RoomData[] = data

const RoomsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Categories for filtering
  const categories = [
    'All Categories', 
    'Technology', 
    'Music', 
    'Gaming', 
    'Business', 
    'Education', 
    'Comedy', 
    'Sports', 
    'Science'
  ];

  // Status options
  const statusOptions = [
    'All Status',
    'Live',
    'Upcoming',
    'Ended'
  ];

  // Filtering logic
  const filteredRooms = mockRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || 
                            room.category === selectedCategory;
    
    const matchesStatus = selectedStatus === 'All Status' || 
      (selectedStatus === 'Live' && room.isLive) ||
      (selectedStatus === 'Upcoming' && !room.isLive && new Date(room.startDateTime) > new Date()) ||
      (selectedStatus === 'Ended' && !room.isLive && new Date(room.startDateTime) < new Date());

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <>
    <RoomNavbar/>
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white">
      {/* Header with Carousel */}
      <header className="relative container mx-auto px-4 py-16">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {mockRooms.slice(0, 5).map((room) => (
              <CarouselItem key={room._id} className="md:basis-1/2 lg:basis-1/3">
                <RoomCard room={room} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 bg-pink-500/20 hover:bg-pink-500/40 text-white" />
          <CarouselNext className="right-0 bg-pink-500/20 hover:bg-pink-500/40 text-white" />
        </Carousel>
      </header>

      {/* Filtering Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="bg-indigo-900/50 backdrop-blur-md rounded-xl p-6 border border-indigo-700/50">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search rooms by name or category" 
                className="pl-10 bg-indigo-800/50 border-indigo-700/50 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <Select 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[200px] bg-indigo-800/50 border-indigo-700/50 text-white">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-indigo-900 border-indigo-700/50 text-white">
                {categories.map((category) => (
                  <SelectItem 
                    key={category} 
                    value={category}
                    className="hover:bg-pink-500/20 focus:bg-pink-500/30"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select 
              value={selectedStatus} 
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-full md:w-[200px] bg-indigo-800/50 border-indigo-700/50 text-white">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-indigo-900 border-indigo-700/50 text-white">
                {statusOptions.map((status) => (
                  <SelectItem 
                    key={status} 
                    value={status}
                    className="hover:bg-pink-500/20 focus:bg-pink-500/30"
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-16 bg-indigo-900/50 rounded-xl">
            <h3 className="text-2xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
              No Rooms Found
            </h3>
            <p className="text-gray-300 mb-6">
              Try adjusting your search or filters
            </p>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
                setSelectedStatus('All Status');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </section>

      {/* Create Room CTA */}
      <section className="container mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-indigo-800/30 to-purple-900/30 backdrop-blur-md rounded-xl p-12 text-center border border-indigo-700/50">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Create Your Own Watch Room
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Start a room, invite friends, and make watching videos a social experience.
          </p>
          <Button 
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 text-lg px-8 py-6"
          >
            Create Room <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
    </>
  );
};

export default RoomsPage;