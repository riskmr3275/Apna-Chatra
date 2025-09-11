import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(156);

  // Sample news data - in real app, this would come from API
  const newsData = {
    id: id,
    title: "सिर्फ Gen-Z रिपोर्ट से नहीं बनेगा काम, जानें- कैसे सुशीला कार्की बन सकती है 'नेपाल PM', रेस में और चार नाम",
    image: "/temp.webp",
    category: "राजनीति",
    timestamp: "2 घंटे पहले",
    author: "न्यूज़ डेस्क",
    content: `
      नेपाल में राजनीतिक उथल-पुथल के बीच सुशीला कार्की का नाम प्रधानमंत्री पद के लिए चर्चा में है। Gen-Z की रिपोर्ट के अनुसार, युवाओं में बढ़ते असंतोष के कारण पारंपरिक राजनीति में बदलाव की मांग तेज हो रही है।

      सुशीला कार्की, जो कि एक अनुभवी राजनेता हैं, ने अपने करियर में कई महत्वपूर्ण पदों पर काम किया है। उनका राजनीतिक अनुभव और युवाओं के साथ जुड़ाव उन्हें इस पद के लिए एक मजबूत उम्मीदवार बनाता है।

      नेपाल की वर्तमान राजनीतिक स्थिति में स्थिरता की जरूरत है। देश में आर्थिक चुनौतियां और सामाजिक समस्याएं बढ़ रही हैं, जिसके लिए एक मजबूत नेतृत्व की आवश्यकता है।

      विशेषज्ञों का मानना है कि अगले कुछ दिनों में राजनीतिक दलों के बीच बातचीत से स्थिति स्पष्ट हो जाएगी। इस बीच, जनता नई सरकार से उम्मीदें लगाए बैठी है।

      Gen-Z की भागीदारी से नेपाल की राजनीति में नया मोड़ आ सकता है। युवाओं की मांगों को ध्यान में रखते हुए नई नीतियां बनाने की जरूरत है।
    `,
    tags: ["नेपाल", "राजनीति", "सुशीला कार्की", "Gen-Z", "प्रधानमंत्री"],
    relatedNews: [
      {
        id: 2,
        title: "नेपाल में राजनीतिक संकट गहराया, विपक्ष ने की नई सरकार की मांग",
        image: "/temp.webp",
        timestamp: "4 घंटे पहले"
      },
      {
        id: 3,
        title: "युवाओं का बढ़ता प्रभाव, नेपाल की राजनीति में नया अध्याय",
        image: "/temp.webp",
        timestamp: "6 घंटे पहले"
      }
    ]
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsData.title,
        text: newsData.content.substring(0, 100) + '...',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('लिंक कॉपी हो गया!');
    }
  };

  const handleComment = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-4">
            <button 
              onClick={() => navigate('/')}
              className="text-red-600 hover:text-red-700 text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              होम पर वापस जाएं
            </button>
          </nav>

          {/* Article Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <img 
              src={newsData.image} 
              alt={newsData.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-red-600 text-white px-3 py-1 text-sm rounded">
                  {newsData.category}
                </span>
                <span className="text-gray-500 text-sm">{newsData.timestamp}</span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
                {newsData.title}
              </h1>
              
              <div className="flex items-center text-sm text-gray-600 mb-6">
                <span>लेखक: {newsData.author}</span>
                <span className="mx-2">•</span>
                <span>{Math.floor(Math.random() * 5000) + 1000} बार पढ़ा गया</span>
              </div>

              {/* Social Actions */}
              <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 mb-6">
                <button 
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                    liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{likeCount} पसंद</span>
                </button>

                <button 
                  onClick={handleComment}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>कमेंट करें</span>
                </button>

                <button 
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>शेयर करें</span>
                </button>
              </div>

              {/* Article Content */}
              <div className="prose max-w-none">
                {newsData.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4 text-justify">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-3">टैग्स:</h3>
                <div className="flex flex-wrap gap-2">
                  {newsData.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related News */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">संबंधित समाचार</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newsData.relatedNews.map((news) => (
                <div 
                  key={news.id}
                  onClick={() => navigate(`/news/${news.id}`)}
                  className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                      {news.title}
                    </h3>
                    <span className="text-xs text-gray-500">{news.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default NewsDetail;