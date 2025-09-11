import React, { useState } from 'react';
import NewsCard from './NewsCard';
import AuthModal from './AuthModal';
import AdCard from './AdCard';

const NewsFeed = ({ filter, searchQuery }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sortBy, setSortBy] = useState('latest');

  const newsData = [
    {
      id: 1,
      title: "सिर्फ Gen-Z रिपोर्ट से नहीं बनेगा काम, जानें- कैसे सुशीला कार्की बन सकती है 'नेपाल PM'",
      image: "/temp.webp",
      description: "नेपाल में राजनीतिक उथल-पुथल के बीच युवाओं का बढ़ता प्रभाव और नई सरकार की संभावनाएं।",
      category: "राजनीति",
      location: "नेपाल",
      tags: ["नेपाल", "राजनीति", "Gen-Z", "सुशीला कार्की"],
      timestamp: "2 घंटे पहले",
      reporter: "राज कुमार",
      isFollowing: false,
      likes: 156,
      comments: 23,
      shares: 12,
      isBookmarked: false,
      isTrending: true
    },
    {
      id: 2,
      title: "भारत में 27 गेंद में ही UAE को 9 विकेट से हराया, एशिया कप में शानदार जीत",
      image: "/temp.webp",
      description: "टीम इंडिया का दमदार प्रदर्शन, फैंस में खुशी की लहर। कप्तान की रणनीति सफल।",
      category: "खेल",
      location: "दुबई",
      tags: ["क्रिकेट", "भारत", "UAE", "एशिया कप"],
      timestamp: "3 घंटे पहले",
      reporter: "स्पोर्ट्स डेस्क",
      isFollowing: true,
      likes: 289,
      comments: 45,
      shares: 67,
      isBookmarked: true,
      isTrending: true
    },
    {
      id: 3,
      title: "Apple के AirPods प्रो3 करेंगे आपका हार्ट रेट मॉनिटर, नया फीचर लॉन्च",
      image: "/temp.webp",
      description: "तकनीक की दुनिया में नया कदम, स्वास्थ्य की निगरानी होगी आसान। कीमत और फीचर्स की जानकारी।",
      category: "तकनीक",
      location: "कैलिफोर्निया",
      tags: ["Apple", "AirPods", "स्वास्थ्य", "तकनीक"],
      timestamp: "4 घंटे पहले",
      reporter: "टेक रिपोर्टर",
      isFollowing: false,
      likes: 134,
      comments: 18,
      shares: 25,
      isBookmarked: false,
      isTrending: false
    },
    {
      id: 4,
      title: "हिमाचल प्रदेश बना देश का पूर्ण साक्षर राज्य, 99.3% साक्षरता दर हासिल",
      image: "/temp.webp",
      description: "शिक्षा के क्षेत्र में ऐतिहासिक उपलब्धि, अन्य राज्यों के लिए मिसाल। मुख्यमंत्री का बयान।",
      category: "शिक्षा",
      location: "हिमाचल प्रदेश",
      tags: ["शिक्षा", "साक्षरता", "हिमाचल", "उपलब्धि"],
      timestamp: "5 घंटे पहले",
      reporter: "शिक्षा संवाददाता",
      isFollowing: true,
      likes: 201,
      comments: 31,
      shares: 89,
      isBookmarked: true,
      isTrending: false
    },
    {
      id: 5,
      title: "GST कटौती से कारों की कीमतों में बड़ी गिरावट, ग्राहकों को मिलेगा फायदा",
      image: "/temp.webp",
      description: "ऑटो सेक्टर में नई उम्मीद, खरीदारी का सुनहरा मौका। कौन सी कारें होंगी सस्ती।",
      category: "व्यापार",
      location: "नई दिल्ली",
      tags: ["GST", "कार", "कीमत", "व्यापार"],
      timestamp: "6 घंटे पहले",
      reporter: "बिजनेस डेस्क",
      isFollowing: false,
      likes: 178,
      comments: 27,
      shares: 34,
      isBookmarked: false,
      isTrending: true
    }
  ];

  const filteredNews = newsData.filter(news => {
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
      title: "ऑनलाइन शॉपिंग - 80% तक छूट",
      description: "सभी कैटेगरी में भारी छूट। फ्री डिलीवरी और आसान रिटर्न।",
      link: "https://example.com/shopping",
      sponsor: "ई-कॉमर्स - प्रायोजित"
    },
    {
      title: "पर्सनल लोन - तुरंत अप्रूवल",
      description: "2 लाख तक का लोन, कम ब्याज दर। 5 मिनट में अप्रूवल।",
      link: "https://example.com/loan",
      sponsor: "फाइनेंस - प्रायोजित"
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
            <AdCard 
              {...adData[adIndex]}
              image="/ad.webp"
            />
          </div>
        );
      }
    });

    return items;
  };

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">न्यूज़ फीड</h2>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="latest">New</option>
            <option value="popular">Most Viewed</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </div>

      {/* News Feed */}
      {sortedNews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-lg">कोई समाचार नहीं मिला</p>
            <p className="text-sm">अपने फिल्टर बदलकर देखें</p>
          </div>
        </div>
      ) : (
        renderNewsWithAds()
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default NewsFeed;