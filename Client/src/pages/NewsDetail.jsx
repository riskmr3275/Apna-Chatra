import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import AdCard from '../components/AdCard';
import AdStrip from '../components/AdStrip';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const commentsRef = useRef(null);
  
  // Get passed news data from navigation state
  const passedNewsData = location.state?.newsData;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(156);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // News API configuration
  const NEWS_API_KEY = 'eadd716dc08c44698de8f9a4bbbce2f3';
  
  // Primary Hindi API endpoints
  const HINDI_NEWS_ENDPOINTS = [
    {
      name: 'Hindi General News',
      url: `https://newsapi.org/v2/top-headlines?country=in&language=hi&apiKey=${NEWS_API_KEY}`,
      category: 'सामान्य'
    },
    {
      name: 'Hindi Business News',
      url: `https://newsapi.org/v2/top-headlines?country=in&category=business&language=hi&apiKey=${NEWS_API_KEY}`,
      category: 'व्यापार'
    },
    {
      name: 'Hindi Technology News',
      url: `https://newsapi.org/v2/top-headlines?country=in&category=technology&language=hi&apiKey=${NEWS_API_KEY}`,
      category: 'तकनीक'
    },
    {
      name: 'Hindi Sports News',
      url: `https://newsapi.org/v2/top-headlines?country=in&category=sports&language=hi&apiKey=${NEWS_API_KEY}`,
      category: 'खेल'
    }
  ];

  // Fallback English API endpoints
  const ENGLISH_NEWS_ENDPOINTS = [
    {
      name: 'English General News',
      url: `https://newsapi.org/v2/top-headlines?country=in&language=en&apiKey=${NEWS_API_KEY}`,
      category: 'सामान्य'
    },
    {
      name: 'English Business News',
      url: `https://newsapi.org/v2/top-headlines?country=us&category=business&language=en&apiKey=${NEWS_API_KEY}`,
      category: 'व्यापार'
    },
    {
      name: 'English Technology News',
      url: `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${NEWS_API_KEY}`,
      category: 'तकनीक'
    },
    {
      name: 'Apple News',
      url: `https://newsapi.org/v2/everything?q=apple&language=en&sortBy=popularity&apiKey=${NEWS_API_KEY}`,
      category: 'तकनीक'
    }
  ];

  // Helper functions (same as in NewsFeed)
  const getCategoryInHindi = (sourceName) => {
    const categories = {
      'Bloomberg': 'व्यापार',
      'CNBC': 'व्यापार', 
      'Wall Street Journal': 'व्यापार',
      'Financial Times': 'व्यापार',
      'Fortune': 'व्यापार',
      'Business Insider': 'व्यापार',
      'TechCrunch': 'तकनीक',
      'CNET': 'तकनीक'
    };
    return categories[sourceName] || 'व्यापार';
  };

  const getLocationFromSource = (sourceName) => {
    const locations = {
      'Bloomberg': 'न्यूयॉर्क',
      'CNBC': 'न्यूयॉर्क',
      'Wall Street Journal': 'न्यूयॉर्क', 
      'Financial Times': 'लंदन',
      'Fortune': 'न्यूयॉर्क',
      'Business Insider': 'न्यूयॉर्क',
      'TechCrunch': 'सैन फ्रांसिस्को',
      'CNET': 'सैन फ्रांसिस्को'
    };
    return locations[sourceName] || 'अमेरिका';
  };

  const generateTags = (title, description) => {
    const text = `${title} ${description}`.toLowerCase();
    const commonTags = [];
    
    if (text.includes('stock') || text.includes('market')) commonTags.push('शेयर बाजार');
    if (text.includes('ai') || text.includes('artificial intelligence')) commonTags.push('AI');
    if (text.includes('tech') || text.includes('technology')) commonTags.push('तकनीक');
    if (text.includes('business') || text.includes('company')) commonTags.push('व्यापार');
    if (text.includes('economy') || text.includes('economic')) commonTags.push('अर्थव्यवस्था');
    if (text.includes('finance') || text.includes('financial')) commonTags.push('वित्त');
    
    return commonTags.length > 0 ? commonTags : ['व्यापार', 'समाचार'];
  };

  const formatTimestamp = (publishedAt) => {
    const now = new Date();
    const publishedDate = new Date(publishedAt);
    const diffInHours = Math.floor((now - publishedDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'अभी अभी';
    if (diffInHours < 24) return `${diffInHours} घंटे पहले`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} दिन पहले`;
  };

  // Fetch specific news article from multiple sources
  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If we have passed news data, use it directly
        if (passedNewsData) {
          const enhancedNewsData = {
            ...passedNewsData,
            content: generateDetailedContent(passedNewsData.title, passedNewsData.description),
            tags: generateTags(passedNewsData.title || '', passedNewsData.description || ''),
            relatedNews: await fetchRelatedNews()
          };
          
          setNewsData(enhancedNewsData);
          setLikeCount(passedNewsData.likes || Math.floor(Math.random() * 500) + 50);
          setLoading(false);
          return;
        }
        
        // Try to fetch from multiple sources to find the article
        let foundArticle = null;
        let allArticles = [];
        
        for (const endpoint of HINDI_NEWS_ENDPOINTS.concat(ENGLISH_NEWS_ENDPOINTS)) {
          try {
            const response = await fetch(endpoint.url);
            if (!response.ok) continue;
            
            const data = await response.json();
            if (data.status === 'ok' && data.articles) {
              allArticles = [...allArticles, ...data.articles];
              
              // Try to find article by ID (index-based across all sources)
              const articleIndex = parseInt(id) - 1;
              if (articleIndex < allArticles.length && !foundArticle) {
                foundArticle = allArticles[articleIndex];
                foundArticle.sourceCategory = endpoint.category;
              }
            }
          } catch (err) {
            console.error(`Error fetching from ${endpoint.name}:`, err);
            continue;
          }
        }
        
        if (foundArticle) {
          const formattedNews = {
            id: id,
            title: foundArticle.title || 'No Title Available',
            image: foundArticle.urlToImage || '/temp.webp',
            description: foundArticle.description || 'No description available',
            category: getCategoryInHindi(foundArticle.source?.name, foundArticle.sourceCategory),
            location: getLocationFromSource(foundArticle.source?.name || 'US'),
            tags: generateTags(foundArticle.title || '', foundArticle.description || ''),
            timestamp: formatTimestamp(foundArticle.publishedAt),
            author: foundArticle.author || foundArticle.source?.name || 'News Desk',
            content: foundArticle.content || foundArticle.description || 'Full content not available from API. Please visit the original source for complete article.',
            url: foundArticle.url,
            relatedNews: allArticles.slice(0, 6).filter(article => article.title !== foundArticle.title).map((relatedArticle, index) => ({
              id: index + 2,
              title: relatedArticle.title,
              image: relatedArticle.urlToImage || '/temp.webp',
              timestamp: formatTimestamp(relatedArticle.publishedAt)
            }))
          };
          
          setNewsData(formattedNews);
          setLikeCount(Math.floor(Math.random() * 500) + 50);
        } else {
          throw new Error('Article not found in any source');
        }
        
      } catch (err) {
        console.error('Error fetching news detail:', err);
        setError(err.message);
        // Fallback to static data
        setNewsData(getStaticNewsData());
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id, passedNewsData]);

  // Static fallback data
  const getStaticNewsData = () => ({
    id: id,
    title: "सिर्फ Gen-Z रिपोर्ट से नहीं बनेगा काम, जानें- कैसे सुशीला कार्की बन सकती है 'नेपाल PM', रेस में और चार नाम",
    image: "/temp.webp",
    category: "राजनीति",
    timestamp: "2 घंटे पहले",
    author: "न्यूज़ डेस्क",
    content: `नेपाल में राजनीतिक उथल-पुथल के बीच सुशीला कार्की का नाम प्रधानमंत्री पद के लिए चर्चा में है। Gen-Z की रिपोर्ट के अनुसार, युवाओं में बढ़ते असंतोष के कारण पारंपरिक राजनीति में बदलाव की मांग तेज हो रही है।

सुशीला कार्की, जो कि एक अनुभवी राजनेता हैं, ने अपने करियर में कई महत्वपूर्ण पदों पर काम किया है। उनका राजनीतिक अनुभव और युवाओं के साथ जुड़ाव उन्हें इस पद के लिए एक मजबूत उम्मीदवार बनाता है।`,
    tags: ["नेपाल", "राजनीति", "सुशीला कार्की", "Gen-Z", "प्रधानमंत्री"],
    relatedNews: [
      {
        id: 2,
        title: "नेपाल में राजनीतिक संकट गहराया, विपक्ष ने की नई सरकार की मांग",
        image: "/temp.webp",
        timestamp: "4 घंटे पहले"
      }
    ]
  });

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

  // Helper function to generate detailed content from title and description
  const generateDetailedContent = (title, description) => {
    const baseContent = description || 'विस्तृत जानकारी उपलब्ध नहीं है।';
    
    // Generate additional paragraphs based on the title and description
    const additionalContent = `
${title} के संबंध में यह एक महत्वपूर्ण विकास है। इस घटना का व्यापक प्रभाव देखने को मिल सकता है।

विशेषज्ञों के अनुसार, इस मामले में आगे की कार्रवाई की संभावना है। संबंधित अधिकारी इस विषय पर निरंतर निगरानी रख रहे हैं।

यह घटना न केवल स्थानीय स्तर पर बल्कि राष्ट्रीय स्तर पर भी चर्चा का विषय बनी हुई है। आने वाले दिनों में इसके और भी विवरण सामने आने की उम्मीद है।

हमारी न्यूज़ टीम इस मामले पर लगातार नज़र रखे हुए है और जैसे ही कोई नई जानकारी मिलेगी, हम आपको तुरंत अपडेट करेंगे।`;

    return baseContent + '\n\n' + additionalContent;
  };

  // Helper function to fetch related news
  const fetchRelatedNews = async () => {
    try {
      const response = await fetch(HINDI_NEWS_ENDPOINTS[0].url);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok' && data.articles) {
          return data.articles.slice(0, 4).map((article, index) => ({
            id: Date.now() + index,
            title: article.title,
            image: article.urlToImage || '/temp.webp',
            timestamp: formatTimestamp(article.publishedAt)
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching related news:', error);
    }
    
    // Fallback related news
    return [
      {
        id: 2,
        title: "संबंधित समाचार - नवीनतम अपडेट",
        image: "/temp.webp",
        timestamp: "1 घंटे पहले"
      },
      {
        id: 3,
        title: "इस विषय पर और जानकारी",
        image: "/temp.webp",
        timestamp: "2 घंटे पहले"
      }
    ];
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">समाचार लोड हो रहा है...</p>
              <p className="text-sm text-gray-500">कृपया प्रतीक्षा करें</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error && !newsData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-red-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">समाचार लोड करने में त्रुटि</p>
                <p className="text-sm mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  पुनः प्रयास करें
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // No news data
  if (!newsData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-lg text-gray-600">समाचार नहीं मिला</p>
              <button 
                onClick={() => navigate('/')} 
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                होम पर वापस जाएं
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                    {newsData.content && newsData.content.split('\n\n').map((paragraph, index) => {
                      const paragraphs = [];
                      
                      // Add paragraph
                      paragraphs.push(
                        <p key={`para-${index}`} className="text-gray-700 leading-relaxed mb-4 text-justify">
                          {paragraph.trim()}
                        </p>
                      );
                      
                      // Add ad strip after 2nd paragraph (index 1)
                      if (index === 1) {
                        paragraphs.push(
                          <AdStrip
                            key={`ad-${index}`}
                            title="क्रिप्टो ट्रेडिंग - 50% बोनस"
                            description="अब भारत में सुरक्षित क्रिप्टो ट्रेडिंग। साइन अप करें और 50% बोनस पाएं।"
                            link="https://example.com/crypto-trading"
                            sponsor="क्रिप्टो - प्रायोजित"
                            backgroundColor="bg-gradient-to-r from-blue-50 to-purple-50"
                            compact={true}
                            icon={
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                            }
                          />
                        );
                      }
                      
                      // Add another ad strip after 4th paragraph (index 3) if exists
                      if (index === 3) {
                        paragraphs.push(
                          <AdStrip
                            key={`ad2-${index}`}
                            title="इन्वेस्टमेंट प्लान - गारंटीड रिटर्न"
                            description="15% तक गारंटीड रिटर्न। टैक्स सेविंग के साथ। आज ही निवेश करें।"
                            link="https://example.com/investment"
                            sponsor="निवेश - प्रायोजित"
                            backgroundColor="bg-gradient-to-r from-green-50 to-blue-50"
                            compact={true}
                            icon={
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            }
                          />
                        );
                      }
                      
                      // Add third ad strip after 6th paragraph (index 5) if exists
                      if (index === 5) {
                        paragraphs.push(
                          <AdStrip
                            key={`ad3-${index}`}
                            title="होम लोन - सबसे कम ब्याज दर"
                            description="अपने सपनों का घर खरीदें। 6.5% से शुरू होने वाली ब्याज दर।"
                            link="https://example.com/home-loan"
                            sponsor="होम लोन - प्रायोजित"
                            backgroundColor="bg-gradient-to-r from-yellow-50 to-orange-50"
                            compact={true}
                            icon={
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                            }
                          />
                        );
                      }
                      
                      return paragraphs;
                    }).flat()}
                    
                    {/* Original Source Link */}
                    {newsData.url && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800 mb-2">
                          <strong>पूरी खबर पढ़ने के लिए:</strong>
                        </p>
                        <a 
                          href={newsData.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                        >
                          मूल स्रोत पर जाएं →
                        </a>
                      </div>
                    )}
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