import React, { useState } from 'react';
import AuthModal from './AuthModal';
import logo from "../../public/Logo.png";

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="bg-blue-900 text-white">
        {/* Top Bar */}
        <div className="bg-red-600 text-white text-sm py-1">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="font-bold">BREAKING NEWS</span>
              <span className="animate-pulse">
                PM मोदी आज अयोध्या में दर्शन, मंदिर में अरदास करने के बाद करेंगे हैं मुलाकात
              </span>
            </div>
            <button className="text-white hover:text-gray-200">×</button>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
           {/* Logo with tagline */}
<div className="flex items-center space-x-3">
  {/* Logo */}
  <div className="bg-white rounded-full p-2 shadow-md">
    <img
      src={logo}
      alt="Logo"
      className="w-16 h-16 md:w-20 md:h-20 object-contain"
    />
  </div>

  {/* Tagline */}
  <div className="flex flex-col leading-tight">
    <span className="text-sm md:text-xl font-extrabold text-red-600 tracking-wide">
      Apna Shahar,
    </span>
    <span className="text-sm md:text-xl font-extrabold text-white tracking-wide">
      Apna Khabar
    </span>
  </div>
</div>


            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="hover:text-red-400 transition-colors">Home</a>
              <a href="#" className="hover:text-red-400 transition-colors">India</a>
              <a href="#" className="hover:text-red-400 transition-colors">World</a>
              <a href="#" className="hover:text-red-400 transition-colors">Career</a>
              <a href="#" className="hover:text-red-400 transition-colors">Religion</a>
              <a href="#" className="hover:text-red-400 transition-colors">Politics</a>
              <a href="#" className="hover:text-red-400 transition-colors">जेट जेटली</a>
              <a href="#" className="hover:text-red-400 transition-colors">बिज</a>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <span className="text-sm">EDITION</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">हिं</span>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Header;
