import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Play,
  MessageSquare,
  PieChart,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/stores/useAuthStore";
import LoadingPage from "@/components/LoadingPage";
import DropdownProfile from "@/components/DropdownProfile";
const Homepage = () => {
  const {user, checkingAuth} = useAuthStore();
  console.log(user, "this is current user");
  if(checkingAuth) return <LoadingPage />
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white">
      {/* Header/Navbar */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/">
        <div className="flex items-center gap-2">
          <span className="text-2xl cursor-pointer font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
            SyncWatch
          </span>
        </div>
        </Link>
        <nav className="hidden md:flex gap-8">
          <a href="#features" className="hover:text-pink-400 transition">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-pink-400 transition">
            How It Works
          </a>
          <a href="#categories" className="hover:text-pink-400 transition">
            Categories
          </a>
        </nav>
        {
          user ? (
            <div className="flex justify-center items-center gap-6">
          <Link to="/rooms">
            <Button
              className="bg-gradient-to-r cursor-pointer from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0"
            >
              Rooms
            </Button>
          </Link>
            <DropdownProfile />
        </div>
          ) : (
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
          )
        }
      </header>

      {/* Hero Section */}

      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between">
        {/* Left Column - Text Content */}
        <div className="w-full md:w-1/2 mb-12 md:mb-0">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Watch Together, <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
              Never Alone
            </span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-8 text-gray-300 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Create or join watch rooms for any YouTube video. Connect with
            people who share your interests, discuss in real-time, and make
            watching more fun.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to={user ? '/rooms' : '/register'}>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg border-0 text-base md:text-lg px-6 py-5 md:px-8 md:py-6 w-full sm:w-auto flex items-center justify-center">
              Create a Room <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            </Link>
            <Link to={user ? '/rooms' : '/login'}>
            <Button className="border border-pink-500 bg-transparent text-white hover:bg-pink-950/30 rounded-lg text-base md:text-lg px-6 py-5 md:px-8 md:py-6 w-full sm:w-auto">
              Explore Rooms
            </Button>
            </Link>
          </motion.div>
        </div>

        {/* Right Column - Video UI */}
        <motion.div
          className="w-full ml-3 md:w-1/2 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Main video container with perspective effect */}
          <div className="relative z-10 w-full aspect-video rounded-2xl overflow-hidden border border-indigo-500/40 shadow-2xl shadow-purple-900/40 transform md:rotate-2">
            {/* Video player background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 to-purple-900/70 backdrop-blur-sm">
              {/* Video UI */}
              <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs px-2 py-1 bg-indigo-800/80 rounded-md border border-indigo-700/50">
                    HD
                  </div>
                  <div className="text-xs px-2 py-1 bg-pink-500/90 rounded-md">
                    LIVE
                  </div>
                </div>
              </div>

              {/* Video content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-3/4 aspect-video bg-black rounded-lg overflow-hidden border border-white/10 shadow-lg">
                  {/* Video preview image (placeholder) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                    {/* Play button */}
                    <div className="h-10 w-10 md:h-16 md:w-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center group cursor-pointer hover:bg-pink-500/80 transition-all duration-300">
                      <Play className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>

                    {/* Video timeline */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-gradient-to-r from-pink-500 to-purple-600"></div>
                        <div className="h-3 w-3 bg-white rounded-full absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 shadow-sm shadow-pink-500/50"></div>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs">
                        <span>08:42</span>
                        <span>12:30</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat panel overlay - visible on md screens and up */}
              <div className="absolute right-4 top-16 bottom-4 w-1/4 bg-indigo-900/40 backdrop-blur-md rounded-lg border border-indigo-700/40 overflow-hidden hidden md:block">
                <div className="p-2 border-b border-indigo-700/40 text-xs font-medium">
                  LIVE CHAT
                </div>
                <div className="p-2 overflow-y-auto h-full">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="mb-3">
                      <div className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex-shrink-0"></div>
                        <div>
                          <p className="text-xs font-medium">
                            User{i + 1}{" "}
                            <span className="text-gray-400 font-normal">
                              says:
                            </span>
                          </p>
                          <p className="text-xs text-gray-300">
                            This is amazing! 🔥
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User controls */}
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-indigo-900 bg-gradient-to-br from-pink-400 to-purple-600"
                    ></div>
                  ))}
                  <div className="w-6 h-6 rounded-full border-2 border-indigo-900 bg-indigo-800 flex items-center justify-center text-xs">
                    +5
                  </div>
                </div>
                <div className="text-xs px-2 py-1 bg-indigo-800/80 rounded-full flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating reaction panel - visible on md screens and up */}
          <div className="absolute -right-4 md:-right-10 top-1/3 bg-indigo-800/70 backdrop-blur-md rounded-xl p-3 shadow-lg border border-indigo-700/50 hidden md:block">
            <div className="flex flex-col gap-3">
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

          {/* Floating category card */}
          <div className="absolute -bottom-12 -left-6 bg-indigo-800/80 backdrop-blur-md rounded-xl p-3 md:p-4 shadow-lg border border-indigo-700/50 transform -rotate-3">
            <div className="flex gap-2 md:gap-3 items-center">
              <div className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-1 md:p-2">
                <Users className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium">
                  Tech Discussion
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-xs text-gray-300">23 active rooms</p>
                </div>
              </div>
            </div>
          </div>

          {/* Small floating info card - visible on md screens and up */}
          <div className="absolute -top-10 right-8 bg-gradient-to-r from-pink-500/80 to-purple-600/80 backdrop-blur-sm rounded-lg p-2 shadow-lg transform rotate-6 hidden md:block">
            <div className="text-xs font-medium">Next trending event in:</div>
            <div className="text-sm font-bold">02:45:18</div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
            Key Features
          </span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Play className="h-10 w-10 text-pink-500" />,
              title: "Synchronized Viewing",
              description:
                "Watch videos in perfect sync with everyone in the room, no matter where they are.",
            },
            {
              icon: <MessageSquare className="h-10 w-10 text-cyan-400" />,
              title: "Live Discussions",
              description:
                "Pause the video anytime to discuss interesting points with everyone in the room.",
            },
            {
              icon: <PieChart className="h-10 w-10 text-purple-400" />,
              title: "Interactive Polls",
              description:
                "Create polls to gather opinions and make watching more engaging and interactive.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-indigo-800/30 backdrop-blur-md rounded-xl p-6 border border-indigo-700/50 hover:border-pink-500/50 transition duration-300 hover:shadow-lg hover:shadow-pink-900/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
            How It Works
          </span>
        </motion.h2>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-indigo-600/40 shadow-xl shadow-purple-900/30 bg-indigo-800/20 backdrop-blur-sm">
                <div className="p-4">
                  <div className="flex gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex gap-4 items-center mb-4">
                    <div className="bg-indigo-700/70 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>youtube.com/watch?v=...</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-pink-500 hover:bg-pink-600 text-xs"
                    >
                      Create Room
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-700/50 rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">
                        Room Settings
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span>Public Room</span>
                          <div className="h-4 w-8 rounded-full bg-pink-500"></div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span>Allow Chat</span>
                          <div className="h-4 w-8 rounded-full bg-pink-500"></div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span>Category</span>
                          <span className="text-pink-400">Music</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-indigo-700/50 rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">
                        Invite Friends
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-8 w-8 rounded-full bg-indigo-600"
                          ></div>
                        ))}
                        <div className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-xs">
                          +
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ol className="space-y-8 relative before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-pink-500 before:to-indigo-500">
              {[
                {
                  title: "Create a Room",
                  description:
                    "Paste any YouTube video link and set up your room preferences.",
                },
                {
                  title: "Invite or Let Others Join",
                  description:
                    "Share the room link or let people discover your public room.",
                },
                {
                  title: "Watch Together",
                  description:
                    "The video stays in perfect sync for everyone as you watch.",
                },
                {
                  title: "Pause & Discuss",
                  description:
                    "Stop at any moment to discuss interesting points with the group.",
                },
              ].map((step, index) => (
                <li key={index} className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex items-center justify-center h-8 w-8 rounded-full bg-pink-500 text-white font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="container mx-auto px-4 py-20">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
            Find Your Community
          </span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Technology", rooms: 137 },
            { name: "Music", rooms: 243 },
            { name: "Gaming", rooms: 185 },
            { name: "Business", rooms: 92 },
            { name: "Education", rooms: 156 },
            { name: "Comedy", rooms: 211 },
            { name: "Sports", rooms: 124 },
            { name: "Science", rooms: 76 },
          ].map((category, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-indigo-800/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-4 border border-indigo-700/30 hover:border-pink-500/50 transition duration-300 cursor-pointer group"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <h3 className="text-lg font-bold mb-1 group-hover:text-pink-400 transition">
                {category.name}
              </h3>
              <p className="text-sm text-gray-400">
                {category.rooms} active rooms
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          className="bg-gradient-to-r from-indigo-800/30 to-purple-900/30 backdrop-blur-md rounded-xl p-8 md:p-12 border border-indigo-700/50 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Connect Through Content?
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Join thousands of people who are already making watching videos a
            social experience.
          </p>
          <Link to={user ? "/rooms" : "/register"}>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 text-lg px-8 py-6">
            Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Homepage;
