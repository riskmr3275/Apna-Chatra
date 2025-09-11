import React, { useState } from 'react';
import NewsCard from './NewsCard';
import AuthModal from './AuthModal';

const NewsSection = ({ title, news, showViewAll = true }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-red-600 flex items-center">
          <span className="mr-2">▶</span>
          {title}
        </h2>
        {showViewAll && (
          <button className="text-red-600 text-sm hover:underline flex items-center hover:text-red-700 transition-colors">
            और भी <span className="ml-1">▶</span>
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {news.map((item, index) => (
          <NewsCard 
            key={index}
            {...item}
            id={index + 10}
            onSignInClick={() => setShowAuthModal(true)}
          />
        ))}
      </div>
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default NewsSection;