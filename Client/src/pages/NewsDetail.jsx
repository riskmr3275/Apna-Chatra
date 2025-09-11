import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import AdCard from '../components/AdCard';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const commentsRef = useRef(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(156);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'राहुल शर्मा',
      content: 'बहुत अच्छी जानकारी दी गई है। नेपाल की राजनीति में वाकई बदलाव की जरूरत है।',
      timestamp: '1 घंटे पहले',
      likes: 12,
      avatar: 'R'
    },
    {
      id: 2,
      author: 'प्रिया गुप्ता',
      content: 'Gen-Z का प्रभाव सभी देशों में दिख रहा है। यह एक सकारात्मक बदलाव है।',
      timestamp: '2 घंटे पहले',
      likes: 8,
      avatar: 'प'
    },
    {
      id: 3,
      author: 'अमित कुमार',
      content: 'सुशीला कार्की एक अनुभवी नेता हैं। उम्मीद है वे अच्छा काम करेंगी।',
      timestamp: '3 घंटे पहले',
      likes: 15,
      avatar: 'अ'
    }
  ]);

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
    setShowComments(true);
    setTimeout(() => {
      commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'आप',
        content: newComment,
        timestamp: 'अभी',
        likes: 0,
        avatar: 'आ'
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  // Check if redirected from NewsCard comment click
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('comments') === 'true') {
      setShowComments(true);
      setTimeout(() => {
        commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [location]);

  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const time = now.toLocaleTimeString('hi-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return { date, time };
  };

  const { date, time } = getCurrentDateTime();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Ads - Top */}
          <div className="lg:hidden mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdCard
                title="स्वास्थ्य बीमा - सबसे कम प्रीमियम"
                description="अब सिर्फ ₹500 में पूरे परिवार का स्वास्थ्य बीमा।"
                link="https://example.com/health-insurance"
                sponsor="स्वास्थ्य बीमा - प्रायोजित"
              />
              <AdCard
                title="नई कार खरीदें - EMI ₹5000"
                description="सबसे कम ब्याज दर पर कार लोन। 0% डाउन पेमेंट।"
                link="https://example.com/car-loan"
                sponsor="कार लोन - प्रायोजित"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Ad Column - Desktop Only */}
            <div className="hidden lg:block lg:col-span-2 space-y-6">
              <AdCard
                title="स्वास्थ्य बीमा - सबसे कम प्रीमियम"
                description="अब सिर्फ ₹500 में पूरे परिवार का स्वास्थ्य बीमा। तुरंत अप्लाई करें।"
                link="https://example.com/health-insurance"
                sponsor="स्वास्थ्य बीमा - प्रायोजित"
              />
              <AdCard
                title="ऑनलाइन कोर्स - 50% छूट"
                description="प्रोग्रामिंग, डिजाइन, मार्केटिंग के कोर्स। आज ही शुरू करें।"
                link="https://example.com/courses"
                sponsor="शिक्षा - प्रायोजित"
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8">
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
                  {/* Website Logo with Date and Time */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="/Logo.png" 
                        alt="Website Logo" 
                        className="w-8 h-8 md:w-10 md:h-10 object-contain"
                      />
                      <div className="text-sm md:text-base">
                        <div className="font-bold text-gray-800">अपना छत्रा न्यूज़</div>
                        <div className="text-xs text-gray-500">विश्वसनीय समाचार का स्रोत</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      <div className="font-medium">{date}</div>
                      <div className="text-xs">{time}</div>
                    </div>
                  </div>

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
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

              {/* Comments Section */}
              <div ref={commentsRef} className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">टिप्पणियां ({comments.length})</h2>
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    {showComments ? 'छुपाएं' : 'देखें'}
                  </button>
                </div>

                {showComments && (
                  <div className="space-y-6">
                    {/* Add Comment Form */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-lg font-semibold mb-3">अपनी राय दें</h3>
                      <div className="space-y-3">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="अपनी टिप्पणी यहाँ लिखें..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          rows="3"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {newComment.length}/500 अक्षर
                          </span>
                          <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                          >
                            टिप्पणी करें
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {comment.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-800">{comment.author}</h4>
                              <span className="text-xs text-gray-500">{comment.timestamp}</span>
                            </div>
                            <p className="text-gray-700 mb-3 leading-relaxed">{comment.content}</p>
                            <div className="flex items-center space-x-4">
                              <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="text-xs">{comment.likes}</span>
                              </button>
                              <button className="text-xs text-gray-500 hover:text-red-600 transition-colors">
                                जवाब दें
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {comments.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p>अभी तक कोई टिप्पणी नहीं है</p>
                        <p className="text-sm">पहली टिप्पणी करने वाले बनें!</p>
                      </div>
                    )}
                  </div>
                )}
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

            {/* Right Ad Column - Desktop Only */}
            <div className="hidden lg:block lg:col-span-2 space-y-6">
              <AdCard
                title="नई कार खरीदें - EMI ₹5000"
                description="सबसे कम ब्याज दर पर कार लोन। 0% डाउन पेमेंट की सुविधा।"
                link="https://example.com/car-loan"
                sponsor="कार लोन - प्रायोजित"
              />
              <AdCard
                title="होम लोन - सबसे कम दर"
                description="अपने सपनों का घर खरीदें। 6.5% से शुरू होने वाली ब्याज दर।"
                link="https://example.com/home-loan"
                sponsor="होम लोन - प्रायोजित"
              />
            </div>
          </div>

          {/* Mobile Ads - Bottom */}
          <div className="lg:hidden mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdCard
                title="ऑनलाइन कोर्स - 50% छूट"
                description="प्रोग्रामिंग, डिजाइन, मार्केटिंग के कोर्स।"
                link="https://example.com/courses"
                sponsor="शिक्षा - प्रायोजित"
              />
              <AdCard
                title="होम लोन - सबसे कम दर"
                description="अपने सपनों का घर खरीदें। 6.5% से शुरू।"
                link="https://example.com/home-loan"
                sponsor="होम लोन - प्रायोजित"
              />
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