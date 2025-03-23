import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white flex flex-col items-center justify-center">
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div 
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400 mb-12 text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          SyncWatch
        </motion.div>
        
        {/* Main loading animation */}
        <div className="relative mb-12 flex items-center justify-center">
          {/* Outer spinning ring */}
          <motion.div 
            className="rounded-full border-4 border-t-pink-500 border-r-indigo-500 border-b-cyan-400 border-l-purple-600"
            style={{ width: '140px', height: '140px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner spinning ring */}
          <motion.div
            className="absolute rounded-full border-4 border-t-cyan-400 border-r-purple-600 border-b-pink-500 border-l-indigo-500"
            style={{ width: '100px', height: '100px' }}
            animate={{ rotate: -180 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Center pulsing dot */}
          <motion.div
            className="absolute rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
            style={{ width: '40px', height: '40px' }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        
        {/* Loading text */}
        <motion.div 
          className="flex items-center justify-center gap-3 text-center"
          animate={{ 
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Loader2 className="h-5 w-5 text-pink-400 animate-spin" />
          <span className="text-lg text-gray-300">Preparing your experience</span>
        </motion.div>
        
        {/* Loading state message */}
        <motion.div
          className="text-gray-400 text-sm mt-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Synchronizing watch rooms...
        </motion.div>
      </motion.div>
      
      {/* Floating particles */}
      {[...Array(32)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-pink-500/30 backdrop-blur-sm"
          style={{ 
            width: Math.random() * 10 + 5 + 'px', 
            height: Math.random() * 10 + 5 + 'px',
            top: Math.random() * 80 + 10 + '%',
            left: Math.random() * 80 + 10 + '%',
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

export default LoadingPage;