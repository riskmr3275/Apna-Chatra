import React from 'react';

const LiveSection = () => {
  const liveUpdates = [
    {
      time: "Sep 10, 23:00 (IST)",
      title: "बिहार कांग्रेस के नेता का बयान",
      isLive: true
    },
    {
      time: "3/3 (3 Ov)",
      title: "इंडिया बनाम पाकिस्तान मैच अपडेट",
      isLive: true
    },
    {
      time: "1:13 AM",
      title: "P.M मोदी आज अयोध्या में दर्शन, मंदिर में अरदास करने के बाद करेंगे हैं मुलाकात",
      isLive: false
    },
    {
      time: "1:13 AM",
      title: "US-MAGA कैंडिडेट चार्ली कर्क का कार्यक्रम होगा के दौरान सुरक्षा चिंता",
      isLive: false
    },
    {
      time: "12:58 AM",
      title: "प्रधानमंत्री मोदी आज अयोध्या के दर्शन करने के लिए जाएंगे",
      isLive: false
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="bg-red-600 text-white px-2 py-1 text-xs rounded">● Live</span>
          <span className="text-red-600 font-bold">UPCOMING</span>
          <span className="text-gray-600">RECENT</span>
        </div>
      </div>

      <div className="space-y-4">
        {liveUpdates.map((update, index) => (
          <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
            <div className="text-xs text-gray-500 whitespace-nowrap mt-1">
              {update.time}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800 leading-relaxed">
                {update.title}
              </p>
              {update.isLive && (
                <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded mt-1">
                  LIVE
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full text-center text-red-600 text-sm hover:underline mt-4">
        View All
      </button>
    </div>
  );
};

export default LiveSection;