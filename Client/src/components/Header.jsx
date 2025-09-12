import React, { useState, useEffect, useRef } from 'react';
import AuthModal from './AuthModal';
import logo from "../../public/Logo.png";

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBreakingNews, setShowBreakingNews] = useState(true);
  const mobileMenuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on window resize to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white sticky top-0 z-50 shadow-lg">
        {/* Breaking News Bar */}
        {showBreakingNews && (
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs sm:text-sm py-2 overflow-hidden border-b border-red-500">
            <div className="container mx-auto px-2 sm:px-4 flex justify-between items-center">
              <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                <span className="font-bold text-xs sm:text-sm whitespace-nowrap bg-white text-red-600 px-2 py-1 rounded">
                  BREAKING
                </span>
                <div className="overflow-hidden">
                  <span className="animate-pulse block truncate sm:whitespace-normal font-medium">
                    PM मोदी आज अयोध्या में दर्शन, मंदिर में अरदास करने के बाद करेंगे हैं मुलाकात
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowBreakingNews(false)}
                className="text-white hover:text-gray-200 ml-2 flex-shrink-0 text-lg leading-none bg-red-800 hover:bg-red-900 rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Main Header */}
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4" ref={mobileMenuRef}>
          <div className="flex items-center justify-between">
            {/* Logo - Aaj Tak Style */}
            <div className="flex items-center flex-shrink-0">
              {/* Logo Container - Exact Aaj Tak Style */}
              <div className="bg-white rounded-md  shadow-lg">
                <img
                  src={logo}
                  alt="अपना छत्रा न्यूज़"
                  className="w-12 h-12 sm:w-9 sm:h-9 md:w-15 md:h-11 object-contain "
                />
              </div>

              {/* Brand Text - Compact like Aaj Tak */}
              <div className="ml-2 sm:ml-3">
                <div className="text-white font-black text-base sm:text-lg md:text-xl lg:text-2xl tracking-tight leading-none">
                  अपना चतरा
                </div>
                <div className="text-red-400 text-xs sm:text-sm font-bold tracking-wide -mt-0.5">
                  न्यूज़
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1 xl:space-x-2">
              <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 px-3 py-2 rounded text-sm xl:text-base font-medium">
                होम
              </a>
              <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 px-3 py-2 rounded text-sm xl:text-base font-medium">
                भारत
              </a>
              <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 px-3 py-2 rounded text-sm xl:text-base font-medium">
                दुनिया
              </a>
              <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 px-3 py-2 rounded text-sm xl:text-base font-medium">
                करियर
              </a>
              <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 px-3 py-2 rounded text-sm xl:text-base font-medium">
                धर्म
              </a>
              <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 px-3 py-2 rounded text-sm xl:text-base font-medium">
                राजनीति
              </a>
              <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 px-3 py-2 rounded text-sm xl:text-base font-medium">
                खेल
              </a>
              <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 px-3 py-2 rounded text-sm xl:text-base font-medium">
                बिज़नेस
              </a>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Edition & Language - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
                  <span className="text-xs font-medium">EDITION</span>
                  <div className="w-4 h-4 rounded-full overflow-hidden">
                    <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-medium">हिं</span>
                </div>
              </div>

              {/* Search Icon */}
              <button className="hidden sm:block text-white hover:text-red-400 transition-colors p-2 hover:bg-gray-700 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Sign In Button */}
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm hover:from-red-700 hover:to-red-800 transition-all duration-200 whitespace-nowrap shadow-lg font-medium"
              >
                साइन इन
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-white hover:text-red-400 transition-colors p-2 hover:bg-gray-700 rounded-full"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
            <div className="mt-4 pt-4 border-t border-gray-600 bg-gray-800 rounded-lg mx-2 sm:mx-0">
              <nav className="flex flex-col space-y-1 p-4">
                <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 py-3 px-4 text-sm rounded-lg border-b border-gray-600 last:border-b-0 font-medium">
                  होम
                </a>
                <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 py-3 px-4 text-sm rounded-lg border-b border-gray-600 last:border-b-0 font-medium">
                  भारत
                </a>
                <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 py-3 px-4 text-sm rounded-lg border-b border-gray-600 last:border-b-0 font-medium">
                  दुनिया
                </a>
                <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 py-3 px-4 text-sm rounded-lg border-b border-gray-600 last:border-b-0 font-medium">
                  करियर
                </a>
                <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 py-3 px-4 text-sm rounded-lg border-b border-gray-600 last:border-b-0 font-medium">
                  धर्म
                </a>
                <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 py-3 px-4 text-sm rounded-lg border-b border-gray-600 last:border-b-0 font-medium">
                  राजनीति
                </a>
                <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 py-3 px-4 text-sm rounded-lg border-b border-gray-600 last:border-b-0 font-medium">
                  खेल
                </a>
                <a href="#" className="hover:bg-gray-700 hover:text-red-400 transition-all duration-200 py-3 px-4 text-sm rounded-lg font-medium">
                  बिज़नेस
                </a>

                {/* Mobile Edition & Language */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-600">
                  <div className="flex items-center space-x-3 bg-gray-700 px-3 py-2 rounded-full">
                    <span className="text-sm font-medium">EDITION</span>
                    <div className="w-4 h-4 rounded-full overflow-hidden">
                      <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-medium">हिं</span>
                  </div>
                  <button className="text-white hover:text-red-400 transition-colors p-2 hover:bg-gray-700 rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </nav>
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
