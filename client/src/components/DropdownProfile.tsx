"use client";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { LogOut, Settings, User, Bell, History } from "lucide-react";

const DropdownProfile = () => {
  const { user, logout } = useAuthStore();

  if (!user) {
    return (
      <div className="flex gap-4">
        <Link to="/login">
          <Button
            variant="ghost"
            className="text-white hover:text-pink-400 hover:bg-transparent"
          >
            Sign In
          </Button>
        </Link>
        <Link to="/register">
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 border-2 border-indigo-600/40 hover:border-pink-500/80 transition-all duration-300"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user.profilePicture || "/placeholder-avatar.png"}
              alt={user.name || "User"}
            />
            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-indigo-900"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-indigo-900/95 backdrop-blur-md border border-indigo-700/50 text-white"
        align="end"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name || "User"}</p>
            <p className="text-xs text-gray-400 truncate">{user.email || ""}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-indigo-700/50" />
        <Link to={`/profile/${user._id}`}>
          <DropdownMenuItem className="cursor-pointer hover:bg-indigo-800/80 focus:bg-indigo-800/80">
            <User className="mr-2 h-4 w-4 text-pink-400" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        {/* <DropdownMenuItem className="cursor-pointer hover:bg-indigo-800/80 focus:bg-indigo-800/80">
          <History className="mr-2 h-4 w-4 text-pink-400" />
          <span>Watch History</span>
        </DropdownMenuItem> */}
        <Link to="/notifications">
          <DropdownMenuItem className="cursor-pointer hover:bg-indigo-800/80 focus:bg-indigo-800/80">
            <Bell className="mr-2 h-4 w-4 text-pink-400" />
            <span>Notifications</span>
          </DropdownMenuItem>
        </Link>
        {/* <DropdownMenuItem className="cursor-pointer hover:bg-indigo-800/80 focus:bg-indigo-800/80">
          <Settings className="mr-2 h-4 w-4 text-pink-400" />
          <span>Settings</span>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator className="bg-indigo-700/50" />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-indigo-800/80 focus:bg-indigo-800/80 text-red-400"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownProfile;
