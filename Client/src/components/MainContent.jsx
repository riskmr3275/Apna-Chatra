import React, { useState } from 'react';
import NewsCard from './NewsCard';
import AuthModal from './AuthModal';

const MainContent = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const mainNews = {
    title: "सिर्फ Gen-Z रिपोर्ट से नहीं बनेगा काम, जानें- कैसे सुशीला कार्की बन सकती है 'नेपाल PM', रेस में और चार नाम",
    image: "/temp.webp",
    description: "नेपाल में Gen-Z ने अपना दमखम दिखाया है। यह पार्टी अब तक है। सुशीला कार्की को लेकर चर्चा है कि वह नेपाल की अगली PM बन सकती हैं। इसके अलावा और भी नाम हैं जो रेस में शामिल हैं।",
    hasVideo: true,
    category: "राजनीति",
    reporter: "राज कुमार",
    location: "काठमांडू, नेपाल"
  };

  const sideNews = [
    {
      title: "भारत में 27 गेंद में ही UAE को 9 विकेट से हराया, एशिया कप में सूर्य विराट का शानदार आगाज",
      image: "/temp.webp",
      timestamp: "2 घंटे पहले",
      reporter: "स्पोर्ट्स डेस्क",
      location: "दुबई, UAE"
    },
    {
      title: "Apple के AirPods प्रो3 करेंगे आपका हार्ट रेट, कैमरा के इस फीचर ने दिया है इशारा",
      image: "/temp.webp",
      timestamp: "3 घंटे पहले",
      reporter: "टेक रिपोर्टर",
      location: "कैलिफोर्निया, USA"
    },
    {
      title: "iPhone 17 सीरीज में Apple इंडे 2025 में और भी बड़ा कदम उठाने की तैयारी",
      image: "/temp.webp",
      timestamp: "4 घंटे पहले",
      reporter: "गैजेट गुरु",
      location: "सैन फ्रांसिस्को, USA"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main News Section */}
        <div className="lg:col-span-2">
          <NewsCard 
            {...mainNews}
            id={1}
            isMainNews={true}
            onSignInClick={() => setShowAuthModal(true)}
          />
        </div>

        {/* Side News */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-red-600">और भी वीडियो</h2>
            <button className="text-red-600 text-sm hover:underline">और भी ▶</button>
          </div>
          
          {sideNews.map((news, index) => (
            <NewsCard 
              key={index}
              {...news}
              id={index + 2}
              onSignInClick={() => setShowAuthModal(true)}
            />
          ))}
        </div>
      </div>
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default MainContent;