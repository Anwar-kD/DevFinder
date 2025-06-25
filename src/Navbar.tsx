import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter } from 'react-router';

function Navbar() {
  return (
    <nav className="bg-gray-800 px-4 py-3 flex items-center justify-between">
      <div className="text-white font-bold text-xl">DevFinder</div>
      <ul className="flex space-x-6">
        <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
        <li><a href="/about" className="text-gray-300 hover:text-white">About</a></li>
        <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
      </ul>
    </nav>
  )
}

export default Navbar
