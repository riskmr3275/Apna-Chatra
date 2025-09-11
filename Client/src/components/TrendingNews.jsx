import React from 'react';

const TrendingNews = () => {
  const trendingItems = [
    "एशिया कप 2025",
    "पुलिसमैन हमला",
    "आईफोन 17 सीरीज",
    "डीजल रेट",
    "पीएम मोदी",
    "फीफा रैंकिंग",
    "राहुल गांधी",
    "बीजेपी",
    "उत्तराखंड कुंभ",
    "बी फुटबॉल टीम"
  ];

  return (
    <div className="bg-gray-100 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-4 overflow-x-auto">
          <span className="text-red-600 font-bold whitespace-nowrap">TRENDING NEWS:</span>
          <div className="flex space-x-6">
            {trendingItems.map((item, index) => (
              <button 
                key={index}
                className="text-gray-700 hover:text-red-600 whitespace-nowrap text-sm transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingNews;