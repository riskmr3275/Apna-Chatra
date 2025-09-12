import React, { useState, useEffect } from 'react';

const SlidingBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const newsSlides = [
    {
      id: 1,
      title: "सिर्फ Gen-Z रिपोर्ट से नहीं बनेगा काम, जानें- कैसे सुशीला कार्की बन सकती है 'नेपाल PM'",
      subtitle: "नेपाल में राजनीतिक बदलाव की नई लहर, युवाओं का बढ़ता प्रभाव",
      image: "/temp.webp",
      category: "मुख्य समाचार",
      type: "news"
    },
    {
      id: 2,
      title: "भारत में 27 गेंद में ही UAE को 9 विकेट से हराया, एशिया कप में शानदार जीत",
      subtitle: "टीम इंडिया का दमदार प्रदर्शन, फैंस में खुशी की लहर",
      image: "/temp.webp",
      category: "खेल",
      type: "news"
    },
    {
      id: 3,
      title: "Apple के AirPods प्रो3 करेंगे आपका हार्ट रेट मॉनिटर, नया फीचर लॉन्च",
      subtitle: "तकनीक की दुनिया में नया कदम, स्वास्थ्य की निगरानी होगी आसान",
      image: "/temp.webp",
      category: "तकनीक",
      type: "news"
    },
    {
      id: 4,
      title: "हिमाचल प्रदेश बना देश का पूर्ण साक्षर राज्य, 99.3% साक्षरता दर",
      subtitle: "शिक्षा के क्षेत्र में ऐतिहासिक उपलब्धि, अन्य राज्यों के लिए मिसाल",
      image: "/temp.webp",
      category: "शिक्षा",
      type: "news"
    },
    {
      id: 5,
      title: "GST कटौती से कारों की कीमतों में बड़ी गिरावट, ग्राहकों को फायदा",
      subtitle: "ऑटो सेक्टर में नई उम्मीद, खरीदारी का सुनहरा मौका",
      image: "/temp.webp",
      category: "व्यापार",
      type: "news"
    }
  ];

  const adSlides = [
    {
      id: 'ad1',
      title: "ऑनलाइन शॉपिंग - 80% तक छूट",
      subtitle: "सभी कैटेगरी में भारी छूट। फ्री डिलीवरी और आसान रिटर्न।",
      image: "/ad.webp",
      category: "Ad",
      type: "ad",
      link: "https://example.com/shopping"
    },
    {
      id: 'ad2',
      title: "पर्सनल लोन - तुरंत अप्रूवल",
      subtitle: "2 लाख तक का लोन, कम ब्याज दर। 5 मिनट में अप्रूवल।",
      image: "/ad.webp",
      category: "Ad",
      type: "ad",
      link: "https://example.com/loan"
    },
    {
      id: 'ad3',
      title: "हेल्थ इंश्योरेंस - फैमिली प्लान",
      subtitle: "पूरे परिवार के लिए 5 लाख का कवर। कैशलेस ट्रीटमेंट।",
      image: "/ad.webp",
      category: "Ad",
      type: "ad",
      link: "https://example.com/insurance"
    }
  ];

  // Create combined slides array with ads inserted after every 2 news slides
  const createBannerSlides = () => {
    const combinedSlides = [];
    let adIndex = 0;

    newsSlides.forEach((slide, index) => {
      combinedSlides.push(slide);

      // Add ad after every 2 news slides (index 1, 3, 5, etc.)
      if ((index + 1) % 2 === 0 && adIndex < adSlides.length) {
        combinedSlides.push(adSlides[adIndex]);
        adIndex++;
      }
    });

    return combinedSlides;
  };

  const bannerSlides = createBannerSlides();

  // Auto slide functionality with different timing for ads
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % bannerSlides.length;
        return nextSlide;
      });
    }, getCurrentSlideDelay());

    return () => clearInterval(slideInterval);
  }, [currentSlide, bannerSlides.length]);

  // Get delay based on current slide type
  const getCurrentSlideDelay = () => {
    const currentSlideData = bannerSlides[currentSlide];
    if (currentSlideData && currentSlideData.type === 'ad') {
      return 6000; // 6 seconds for ad slides (4 + 2 extra seconds)
    }
    return 4000; // 4 seconds for news slides
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  return (
    <div className="relative w-full h-96 overflow-hidden bg-gray-900">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerSlides.map((slide, index) => (
          <div key={slide.id} className="min-w-full h-full relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl text-white">
                  <div className="mb-2">
                    <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded">
                      {slide.category}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200 mb-6">
                    {slide.subtitle}
                  </p>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    पूरी खबर पढ़ें
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>



      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${currentSlide === index
              ? 'bg-red-600 scale-110'
              : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
        <div
          className="h-full bg-red-600 transition-all duration-4000 ease-linear"
          style={{
            width: `${((currentSlide + 1) / bannerSlides.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default SlidingBanner;