import { useState } from 'react'
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { PlusCircle, Users, Menu, X } from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore";
import CreateRoomForm from './CreateRoom';
import DropdownProfile from '../DropdownProfile';

const RoomNavbar = () => {
  const { user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
            SyncWatch
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
            <CreateRoomForm/>
          {user && (
            <div className="flex items-center gap-2">
              <DropdownProfile />
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-pink-500/20"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 z-40">
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-pink-500/20 w-full max-w-xs"
              onClick={toggleMobileMenu}
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Create Room
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-white hover:bg-pink-500/20 w-full max-w-xs"
              onClick={toggleMobileMenu}
            >
              <Users className="mr-2 h-5 w-5" /> Join Room
            </Button>
            
            {user && (
              <div className="flex flex-col items-center gap-4">
                <img 
                  src={user.profilePicture || '/default-avatar.png'} 
                  alt="User Avatar" 
                  className="h-16 w-16 rounded-full border-4 border-pink-500"
                />
                <span className="text-white text-lg">{user.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default RoomNavbar