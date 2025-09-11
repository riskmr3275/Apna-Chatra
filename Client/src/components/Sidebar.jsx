import React, { useState } from 'react';

const Sidebar = ({ position = 'left' }) => {
  const [activeTab, setActiveTab] = useState('trending');

  const trendingNews = [
    {
      id: 1,
      title: "नेपाल में राजनीतिक संकट गहराया",
      views: "2.5K",
      trend: "up"
    },
    {
      id: 2,
      title: "भारत vs UAE मैच हाइलाइट्स",
      views: "5.2K",
      trend: "up"
    },
    {
      id: 3,
      title: "Apple के नए फीचर्स लॉन्च",
      views: "1.8K",
      trend: "down"
    },
    {
      id: 4,
      title: "GST में बड़े बदलाव की तैयारी",
      views: "3.1K",
      trend: "up"
    },
    {
      id: 5,
      title: "हिमाचल में शिक्षा की नई उपलब्धि",
      views: "1.2K",
      trend: "up"
    }
  ];

  const hotTopics = [
    { name: "नेपाल राजनीति", count: "1.2K पोस्ट" },
    { name: "एशिया कप 2025", count: "856 पोस्ट" },
    { name: "Apple AirPods", count: "634 पोस्ट" },
    { name: "GST अपडेट", count: "423 पोस्ट" },
    { name: "शिक्षा नीति", count: "312 पोस्ट" }
  ];

  const suggestedReporters = [
    {
      id: 1,
      name: "राज कुमार",
      specialty: "राजनीतिक संवाददाता",
      followers: "12.5K",
      avatar: "RK"
    },
    {
      id: 2,
      name: "प्रिया शर्मा",
      specialty: "खेल संवाददाता",
      followers: "8.9K",
      avatar: "PS"
    },
    {
      id: 3,
      name: "अमित वर्मा",
      specialty: "तकनीक विशेषज्ञ",
      followers: "15.2K",
      avatar: "AV"
    }
  ];

  const categories = [
    { name: "राजनीति", count: 45, color: "bg-red-500" },
    { name: "खेल", count: 32, color: "bg-blue-500" },
    { name: "तकनीक", count: 28, color: "bg-green-500" },
    { name: "व्यापार", count: 21, color: "bg-yellow-500" },
    { name: "शिक्षा", count: 18, color: "bg-purple-500" },
    { name: "मनोरंजन", count: 15, color: "bg-pink-500" }
  ];

  if (position === 'left') {
    return (
      <div className="space-y-6">
        {/* Quick Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-bold text-gray-800 mb-3">फिल्टर</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between">
              <span>सभी समाचार</span>
              <span className="text-xs text-gray-500">156</span>
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between">
              <span>ट्रेंडिंग</span>
              <span className="text-xs text-red-600">🔥 23</span>
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between">
              <span>फॉलो किए गए</span>
              <span className="text-xs text-gray-500">12</span>
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between">
              <span>बुकमार्क</span>
              <span className="text-xs text-gray-500">8</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-bold text-gray-800 mb-3">कैटेगरी</h3>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <button 
                key={index}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span>{category.name}</span>
                </div>
                <span className="text-xs text-gray-500">{category.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Reporters */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-bold text-gray-800 mb-3">सुझाए गए रिपोर्टर</h3>
          <div className="space-y-3">
            {suggestedReporters.map((reporter) => (
              <div key={reporter.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{reporter.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{reporter.name}</p>
                    <p className="text-xs text-gray-500">{reporter.specialty}</p>
                    <p className="text-xs text-gray-400">{reporter.followers} फॉलोअर्स</p>
                  </div>
                </div>
                <button className="bg-red-600 text-white px-3 py-1 text-xs rounded-full hover:bg-red-700 transition-colors">
                  फॉलो
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trending & Hot Topics Tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('trending')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'trending' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            ट्रेंडिंग
          </button>
          <button 
            onClick={() => setActiveTab('hot')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'hot' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            हॉट टॉपिक्स
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'trending' ? (
            <div className="space-y-3">
              {trendingNews.map((news, index) => (
                <div key={news.id} className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
                  <span className="text-lg font-bold text-gray-400 min-w-[20px]">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {news.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{news.views} views</span>
                      <span className={`text-xs ${news.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {news.trend === 'up' ? '↗️' : '↘️'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {hotTopics.map((topic, index) => (
                <div key={index} className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
                  <p className="font-medium text-gray-800">#{topic.name}</p>
                  <p className="text-xs text-gray-500">{topic.count}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live Updates */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          <h3 className="font-bold text-gray-800">लाइव अपडेट्स</h3>
        </div>
        <div className="space-y-3">
          <div className="text-sm">
            <p className="font-medium text-gray-800">नेपाल संसद में हंगामा</p>
            <p className="text-xs text-gray-500">अभी अभी</p>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-800">भारत ने जीता टॉस</p>
            <p className="text-xs text-gray-500">2 मिनट पहले</p>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-800">शेयर बाजार में तेजी</p>
            <p className="text-xs text-gray-500">5 मिनट पहले</p>
          </div>
        </div>
      </div>

      {/* Weather Widget */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold">मौसम</h3>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div className="text-2xl font-bold">28°C</div>
        <div className="text-sm opacity-90">नई दिल्ली</div>
        <div className="text-xs opacity-75">धूप, हल्की बादल</div>
      </div>

      {/* Ad Space */}
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">विज्ञापन स्थान</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;