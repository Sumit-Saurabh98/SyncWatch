import { motion } from 'framer-motion';
import { ArrowLeft, Search, Video, Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white">
      {/* Simple header */}
      <header className="container mx-auto px-4 py-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
            SyncWatch
          </span>
        </Link>
      </header>
      
      <div className="container mx-auto px-4 flex flex-col items-center justify-center py-16 md:py-24 text-center">
        {/* Glitch Effect Title */}
        <motion.div
          className="relative mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold text-white"
            animate={{ 
              x: [0, -2, 3, -1, 0],
              y: [0, 1, -2, 1, 0]
            }}
            transition={{ 
              duration: 0.5, 
              repeat: Infinity, 
              repeatType: "mirror",
              ease: "easeInOut",
              repeatDelay: 5
            }}
          >
            404
          </motion.h1>
          
          {/* Glitch effects */}
          <motion.span 
            className="absolute inset-0 text-6xl md:text-8xl font-bold text-pink-500 opacity-70"
            animate={{ 
              x: [0, 3, -3, 1, 0],
              opacity: [0.7, 0.4, 0.7],
              filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
            }}
            transition={{ 
              duration: 0.3, 
              repeat: Infinity, 
              repeatType: "mirror",
              ease: "easeInOut",
              repeatDelay: 2
            }}
          >
            404
          </motion.span>
          
          <motion.span 
            className="absolute inset-0 text-6xl md:text-8xl font-bold text-cyan-400 opacity-70"
            animate={{ 
              x: [0, -3, 4, -2, 0],
              opacity: [0.7, 0.3, 0.7],
              filter: ["blur(0px)", "blur(3px)", "blur(0px)"]
            }}
            transition={{ 
              duration: 0.4, 
              repeat: Infinity, 
              repeatType: "mirror",
              ease: "easeInOut",
              repeatDelay: 3
            }}
          >
            404
          </motion.span>
        </motion.div>
        
        <motion.h2
          className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Room Not Found
        </motion.h2>
        
        <motion.p 
          className="text-xl mb-12 text-gray-300 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          The watch room you're looking for seems to have disappeared into the digital void.
        </motion.p>
        
        {/* Action buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 text-lg px-8 py-6">
              <ArrowLeft className="mr-2 h-5 w-5" /> Return Home
            </Button>
          </Link>
          <Link to="/rooms">
          <Button variant="outline" className="border-pink-500 text-white bg-transparent hover:bg-pink-950/30 text-lg px-8 py-6">
            <Search className="mr-2 h-5 w-5" /> Find Active Rooms
          </Button>
          </Link>
        </motion.div>
      </div>
      
      {/* Circuit board pattern in background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Random circuit paths */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 Q200,50 400,200 T800,300" stroke="rgba(236,72,153,0.3)" strokeWidth="2" fill="none" />
          <path d="M300,0 Q400,200 200,400 T100,600" stroke="rgba(139,92,246,0.3)" strokeWidth="2" fill="none" />
          <path d="M800,100 Q600,300 400,200 T200,500" stroke="rgba(34,211,238,0.3)" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </div>
  );
};

export default NotFoundPage;