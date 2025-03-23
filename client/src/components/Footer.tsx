
const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-12 border-t border-indigo-800/30 ">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="mb-6 md:mb-0">
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
          SyncWatch
        </span>
        <p className="text-gray-400 mt-2">Watch together, never alone.</p>
      </div>
      <div className="flex gap-8">
        <a
          href="#"
          className="text-gray-400 hover:text-pink-400 transition"
        >
          About
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-pink-400 transition"
        >
          Privacy
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-pink-400 transition"
        >
          Terms
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-pink-400 transition"
        >
          Contact
        </a>
      </div>
    </div>
    <div className="mt-8 text-center text-gray-500 text-sm">
      © {new Date().getFullYear()} SyncWatch. All rights reserved.
    </div>
  </footer>
  )
}

export default Footer
