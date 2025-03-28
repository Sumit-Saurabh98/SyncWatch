import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  TrendingUp,
  PlusCircle,
  Layout,
  Video,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";
import RoomCard from "@/components/rooms/RoomCard";
import RoomNavbar from "@/components/rooms/RoomNavbar";
import { useRoomStore } from "@/stores/useRoomStore";
import { categories } from "../utils/category";

const RoomsPage: React.FC = () => {
  const {
    rooms,
    userCreatedRooms,
    userJoinedRooms,
    trendingRooms,
    getAllRooms,
    getRoomsCreatedByUser,
    getRoomsJoinedByUser,
    isGettingAllRooms,
    isGettingRoomsCreatedByUser,
    isGettingRoomsJoinedByUser,
  } = useRoomStore();

  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [globalCategory, setGlobalCategory] = useState("All Categories");
  const [isSearching, setIsSearching] = useState(false);

  // Combine all rooms into a single array for global search
  const allRoomsCombined = [
    ...trendingRooms,
    ...userCreatedRooms,
    ...userJoinedRooms,
    ...rooms,
  ];

  const uniqueRooms = Array.from(
    new Map(allRoomsCombined.map((room) => [room._id, room])).values()
  );

  // Global search and filter function
  const filteredRooms = uniqueRooms.filter(
    (room) =>
      (globalCategory === "All Categories" || room.category === globalCategory) &&
      (globalSearchTerm === "" ||
        room.name.toLowerCase().includes(globalSearchTerm.toLowerCase()))
  );

  useEffect(() => {
    getAllRooms();
    getRoomsCreatedByUser();
    getRoomsJoinedByUser();
  }, []);

  // Skeleton Loader for Carousel
  const CarouselSkeleton = () => (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-44 w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );

  // Global search section
  const GlobalSearchSection = () => (
    <section className="container mx-auto px-4 mb-16">
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold mb-4 text-white">
          {`Search Results for ${globalSearchTerm}`}
        </h2>
        {filteredRooms.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {filteredRooms.map((room) => (
                <CarouselItem
                  key={room._id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <RoomCard room={room} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 bg-pink-500/20 hover:bg-pink-500/40 text-white" />
            <CarouselNext className="right-0 bg-pink-500/20 hover:bg-pink-500/40 text-white" />
          </Carousel>
        ) : (
          <p className="text-xl text-gray-300">No rooms found</p>
        )}
      </div>
    </section>
  );

  // Regular room sections
  const RoomSection = ({
    title,
    icon: Icon,
    rooms,
    isLoading,
    emptyMessage,
    createAction,
  }: {
    title: string;
    icon: React.ElementType;
    rooms: any[];
    isLoading: boolean;
    emptyMessage: string;
    createAction?: () => void;
  }) => (
    <section className="container mx-auto px-4 mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex items-center gap-2 font-bold text-2xl text-white">
          <Icon className="text-pink-500" /> {title}
        </h2>
        {/* {createAction && (
          <Button
            onClick={createAction}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <PlusCircle className="mr-2" /> Create
          </Button>
        )} */}
      </div>

      {isLoading ? (
        <CarouselSkeleton />
      ) : rooms.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {rooms.map((room) => (
              <CarouselItem
                key={room._id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <RoomCard room={room} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 bg-pink-500/20 hover:bg-pink-500/40 text-white" />
          <CarouselNext className="right-0 bg-pink-500/20 hover:bg-pink-500/40 text-white" />
        </Carousel>
      ) : (
        <div className="text-center py-12 bg-gradient-to-br from-indigo-800/30 to-purple-900/30 rounded-xl border border-indigo-700/50">
          <p className="text-xl text-gray-300">{emptyMessage}</p>
          {createAction && (
            <Button
              onClick={createAction}
              className="mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <PlusCircle className="mr-2" /> {title}
            </Button>
          )}
        </div>
      )}
    </section>
  );

  return (
    <>
      <RoomNavbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white"
      >
        {/* Global Search and Filter */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 justify-center">
            <div className="relative w-full max-w-2xl">
              <Input
                placeholder="Search rooms..."
                className="w-full pr-12 bg-purple-800/30 border-indigo-700/50"
                value={globalSearchTerm}
                onChange={(e) => {
                  setGlobalSearchTerm(e.target.value);
                  setIsSearching(e.target.value.trim() !== "");
                }}
                onFocus={() => {}}  // Explicitly set onFocus to prevent auto-blur
              />
              {globalSearchTerm ? (
                <X
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer"
                  onClick={() => {
                    setGlobalSearchTerm("");
                    setIsSearching(false);
                  }}
                />
              ) : null}
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <Select
              value={globalCategory} 
              onValueChange={(value) => {
                setGlobalCategory(value);
                setIsSearching(globalSearchTerm.trim() !== "" || value !== "All Categories");
              }}
            >
              <SelectTrigger className="w-[180px] bg-purple-800/30 border-indigo-700/50">
                <SelectValue placeholder="Categories" />
              </SelectTrigger>
              <SelectContent
                className="bg-gradient-to-br from-purple-900 via-violet-800 text-white border-indigo-700/50"
              >
                {["All Categories", ...categories].map((category) => (
                  <SelectItem key={category} value={category}
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Hero Section */}
        {!isSearching && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-16 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Discover Live Streams
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Join live streams from around the world and connect with like-minded
              individuals
            </p>
          </motion.div>
        )}

        {/* Conditional Rendering */}
        {isSearching ? (
          <GlobalSearchSection />
        ) : (
          <>
            <RoomSection
              title="Trending Rooms"
              icon={TrendingUp}
              rooms={trendingRooms}
              isLoading={isGettingAllRooms}
              emptyMessage="No trending rooms at the moment"
            />

            <RoomSection
              title="Your Created Rooms"
              icon={Layout}
              rooms={userCreatedRooms}
              isLoading={isGettingRoomsCreatedByUser}
              emptyMessage="You haven't created any rooms yet"
              createAction={() => {
                /* Create Room Modal */
              }}
            />

            <RoomSection
              title="Rooms You've Joined"
              icon={Users}
              rooms={userJoinedRooms}
              isLoading={isGettingRoomsJoinedByUser}
              emptyMessage="You haven't joined any rooms yet"
            />

            <RoomSection
              title="All Rooms"
              icon={Video}
              rooms={rooms}
              isLoading={isGettingAllRooms}
              emptyMessage="No rooms available"
            />
          </>
        )}

        <Footer />
      </motion.div>
    </>
  );
};

export default RoomsPage;