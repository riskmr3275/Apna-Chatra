import React from 'react';

const VideoSection = () => {
  const videos = [
    {
      title: "एक दिन में 40 सेमी कारों की 40 सेमी है मशहूर, खबरदार हो जाएं",
      image: "/temp.webp",
      duration: "2:15",
      category: "ऑटो"
    },
    {
      title: "नार-नार जीतने के रंग कारों की जबरदस्त है Meta का",
      image: "/temp.webp", 
      duration: "3:45",
      category: "टेक"
    },
    {
      title: "बिहार कुमार मानू कुमार दिन हैं में बड़ा बयान मर्द में बयान मर्द",
      image: "/temp.webp",
      duration: "1:30", 
      category: "राजनीति"
    },
    {
      title: "दिल को दिल-दुखी करने वाली खबरें 35 साल के बाद महिलाएं कर रहे 2 काम",
      image: "/temp.webp",
      duration: "4:20",
      category: "स्वास्थ्य"
    },
    {
      title: "जब राहुल के साही परिवार में एक कार को लेकर डिजा विवाद, जानें क्या है मामला",
      image: "/temp.webp",
      duration: "2:55",
      category: "राजनीति"
    },
    {
      title: "समाजी की लगातार बारी कलयुग, बीजेपी कार्यकर्ता ने किया प्रदर्शन",
      image: "/temp.webp",
      duration: "3:10",
      category: "राजनीति"
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-red-600 flex items-center">
          <span className="mr-2">▶</span>
          वीडियो स्टोरीज
        </h2>
        <button className="text-red-600 text-sm hover:underline flex items-center hover:text-red-700 transition-colors">
          और भी <span className="ml-1">▶</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <img 
                src={video.image} 
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l8-5-8-5z"/>
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 text-xs rounded">
                {video.duration}
              </div>
              <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
                {video.category}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-gray-800 text-base line-clamp-3 hover:text-red-600 transition-colors">
                {video.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSection;