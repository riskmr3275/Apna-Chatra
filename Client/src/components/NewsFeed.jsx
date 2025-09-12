import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNews } from '../context/NewsContext';
import NewsCard from './NewsCard';
import AuthModal from './AuthModal';
import AdCard from './AdCard';

const NewsFeed = ({ filter, searchQuery }) => {
  const { 
    getNews, 
    loadMoreNews, 
    getPaginatedNews, 
    currentPage, 
    hasMore, 
    loading, 
    error,
    isCacheValid 
  } = useNews();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [displayedNews, setDisplayedNews] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef();
  const lastNewsElementRef = useRef();

  // Initialize news data on component mount
  useEffect(() => {
    const initializeNews = async () => {
      const news = await getNews();
      setDisplayedNews(news);
    };
    
    initializeNews();
  }, [getNews]);

  // Update displayed news when pagination changes
  useEffect(() => {
    const paginatedNews = getPaginatedNews(currentPage);
    setDisplayedNews(paginatedNews);
  }, [currentPage, getPaginatedNews]);

  // Infinite scroll observer
  const lastNewsElementCallback = useCallback((node) => {
    if (loading || isLoadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setIsLoadingMore(true);
        loadMoreNews();
        setTimeout(() => setIsLoadingMore(false), 1000);
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, isLoadingMore, hasMore, loadMoreNews]);

  // Filter and sort news
  const filteredNews = displayedNews.filter(news => {
    if (filter === 'trending' && !news.isTrending) return false;
    if (filter === 'bookmarked' && !news.isBookmarked) return false;
    if (filter === 'following' && !news.isFollowing) return false;
    if (searchQuery && !news.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !news.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  const sortedNews = [...filteredNews].sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.timestamp) - new Date(a.timestamp);
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'trending') return b.isTrending - a.isTrending;
    return 0;
  });

  // Ad data for insertion between news
  const adData = [
    {
      title: "क्रिप्टो ट्रेडिंग - 50% बोनस",
      description: "अब भारत में सुरक्षित क्रिप्टो ट्रेडिंग। साइन अप करें और 50% बोनस पाएं।",
      link: "https://example.com/crypto",
      sponsor: "क्रिप्टो - प्रायोजित"
    },
    {
      title: "हेल्थ इंश्योरेंस - फैमिली प्लान",
      description: "पूरे परिवार के लिए 5 लाख का कवर। कैशलेस ट्रीटमेंट।",
      link: "https://example.com/insurance",
      sponsor: "बीमा - प्रायोजित"
    },
    {
      title: "ऑनलाइन कोर्स - स्किल डेवलपमेंट",
      description: "प्रोग्रामिंग, डिजाइन, मार्केटिंग सीखें। सर्टिफिकेट के साथ।",
      link: "https://example.com/courses",
      sponsor: "एजुकेशन - प्रायोजित"
    }
  ];

  // Function to render news with ads inserted after every 4 news items
  const renderNewsWithAds = () => {
    const items = [];
    
    sortedNews.forEach((news, index) => {
      // Add news item
      items.push(
        <div key={`news-${news.id}`} className="bg-white rounded-lg shadow overflow-hidden">
          {/* Reporter Info */}
          <div className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {news.reporter.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{news.reporter}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{news.timestamp}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {news.location}
                    </span>
                    {news.isTrending && (
                      <>
                        <span>•</span>
                        <span className="text-red-600 font-semibold">🔥 ट्रेंडिंग</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    news.isFollowing 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {news.isFollowing ? "Following" : 'Follow'}
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* News Content */}
          <NewsCard 
            {...news}
            onSignInClick={() => setShowAuthModal(true)}
            showSocialActions={true}
            isInFeed={true}
          />

          {/* Tags */}
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag, tagIndex) => (
                <span 
                  key={tagIndex}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs hover:bg-gray-200 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      );

      // Add ad after every 4 news items (index 3, 7, 11, etc.)
      if ((index + 1) % 4 === 0 && index < sortedNews.length - 1) {
        const adIndex = Math.floor(index / 4) % adData.length;
        items.push(
          <div key={`ad-${index}`} className="my-6">
            <AdCard {...adData[adIndex]} />
          </div>
        );
      }

      // Add infinite scroll observer to the last few items
      if (index === sortedNews.length - 3) {
        items[items.length - 1] = React.cloneElement(items[items.length - 1], {
          ref: lastNewsElementCallback
        });
      }
    });

    return items;
  };

  // Loading state
  if (loading && displayedNews.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
            <div className="h-48 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error && displayedNews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">समाचार लोड करने में समस्या</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          पुनः प्रयास करें
        </button>
      </div>
    );
  }

  // No news found
  if (sortedNews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">कोई समाचार नहीं मिला</h3>
        <p className="text-gray-600">
          {searchQuery ? `"${searchQuery}" के लिए कोई परिणाम नहीं मिला` : 'इस फिल्टर के लिए कोई समाचार उपलब्ध नहीं है'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">सॉर्ट करें:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="latest">नवीनतम</option>
            <option value="popular">लोकप्रिय</option>
            <option value="trending">ट्रेंडिंग</option>
          </select>
        </div>
        <div className="text-sm text-gray-500">
          {displayedNews.length} समाचार दिखाए जा रहे हैं
          {isCacheValid && <span className="ml-2 text-green-600">• कैश्ड</span>}
        </div>
      </div>

      {/* News Feed */}
      <div className="space-y-6">
        {renderNewsWithAds()}
      </div>

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            <span>और समाचार लोड हो रहे हैं...</span>
          </div>
        </div>
      )}

      {/* End of Feed Indicator */}
      {!hasMore && sortedNews.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>सभी समाचार देख लिए गए हैं</span>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default NewsFeed;