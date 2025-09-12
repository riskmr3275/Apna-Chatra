import React, { createContext, useContext, useState, useCallback } from 'react';

const NewsContext = createContext();

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const NewsProvider = ({ children }) => {
  const [newsCache, setNewsCache] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  // Cache duration: 15 minutes (increased to reduce API calls)
  const CACHE_DURATION = 15 * 60 * 1000;
  const ITEMS_PER_PAGE = 20;

  // News API configuration
  const NEWS_API_KEY = 'eadd716dc08c44698de8f9a4bbbce2f3';
  
  // Optimized API endpoints - Only 3 essential sources to reduce requests
  const OPTIMIZED_NEWS_ENDPOINTS = [
    {
      name: 'India Top Headlines',
      url: `https://newsapi.org/v2/top-headlines?country=in&pageSize=60&apiKey=${NEWS_API_KEY}`,
      category: 'सामान्य',
      priority: 1
    },
    {
      name: 'Business News',
      url: `https://newsapi.org/v2/top-headlines?country=in&category=business&pageSize=30&apiKey=${NEWS_API_KEY}`,
      category: 'व्यापार',
      priority: 2
    },
    {
      name: 'Technology News',
      url: `https://newsapi.org/v2/top-headlines?sources=techcrunch&pageSize=20&apiKey=${NEWS_API_KEY}`,
      category: 'तकनीक',
      priority: 3
    }
  ];

  // Helper functions
  const formatNewsData = (articles, defaultCategory = 'व्यापार') => {
    return articles.map((article, index) => ({
      id: Date.now() + Math.random() * 1000 + index,
      title: article.title || 'No Title Available',
      image: article.urlToImage || '/temp.webp',
      description: article.description || 'No description available',
      category: getCategoryInHindi(article.source?.name, defaultCategory),
      location: getLocationFromSource(article.source?.name || 'India'),
      tags: generateTags(article.title || '', article.description || ''),
      timestamp: formatTimestamp(article.publishedAt),
      reporter: article.author || article.source?.name || 'News Desk',
      isFollowing: Math.random() > 0.7,
      likes: Math.floor(Math.random() * 500) + 50,
      comments: Math.floor(Math.random() * 100) + 5,
      shares: Math.floor(Math.random() * 50) + 2,
      isBookmarked: Math.random() > 0.8,
      isTrending: Math.random() > 0.6,
      url: article.url,
      source: article.source?.name || 'Unknown'
    }));
  };

  const getCategoryInHindi = (sourceName, defaultCategory = 'सामान्य') => {
    const categories = {
      'Bloomberg': 'व्यापार',
      'CNBC': 'व्यापार',
      'TechCrunch': 'तकनीक',
      'The Times of India': 'सामान्य',
      'Hindustan Times': 'सामान्य',
      'Economic Times': 'व्यापार'
    };
    return categories[sourceName] || defaultCategory;
  };

  const getLocationFromSource = (sourceName) => {
    const locations = {
      'Bloomberg': 'न्यूयॉर्क',
      'CNBC': 'न्यूयॉर्क',
      'TechCrunch': 'सैन फ्रांसिस्को',
      'The Times of India': 'मुंबई',
      'Hindustan Times': 'नई दिल्ली',
      'Economic Times': 'मुंबई'
    };
    return locations[sourceName] || 'भारत';
  };

  const generateTags = (title, description) => {
    const text = `${title} ${description}`.toLowerCase();
    const commonTags = [];
    
    if (text.includes('apple') || text.includes('iphone')) commonTags.push('Apple');
    if (text.includes('ai') || text.includes('artificial intelligence')) commonTags.push('AI');
    if (text.includes('tech') || text.includes('technology')) commonTags.push('तकनीक');
    if (text.includes('business') || text.includes('company')) commonTags.push('व्यापार');
    if (text.includes('stock') || text.includes('market')) commonTags.push('शेयर बाजार');
    if (text.includes('sports') || text.includes('cricket')) commonTags.push('खेल');
    if (text.includes('politics') || text.includes('election')) commonTags.push('राजनीति');
    
    return commonTags.length > 0 ? commonTags : ['समाचार'];
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

  // Static fallback news for when API fails
  const getStaticFallbackNews = () => [
    {
      id: 1,
      title: "भारत में तकनीकी क्रांति: AI और मशीन लर्निंग का बढ़ता प्रभाव",
      image: "/temp.webp",
      description: "भारतीय तकनीकी कंपनियां AI और मशीन लर्निंग में नए मानक स्थापित कर रही हैं।",
      category: "तकनीक",
      location: "बेंगलुरु",
      tags: ["AI", "तकनीक", "भारत"],
      timestamp: "2 घंटे पहले",
      reporter: "टेक डेस्क",
      isFollowing: false,
      likes: 245,
      comments: 32,
      shares: 18,
      isBookmarked: false,
      isTrending: true,
      url: "#",
      source: "Tech News"
    },
    {
      id: 2,
      title: "शेयर बाजार में तेजी: सेंसेक्स नए रिकॉर्ड पर",
      image: "/temp.webp",
      description: "भारतीय शेयर बाजार में निवेशकों का भरोसा बढ़ा, सेंसेक्स ने छुआ नया शिखर।",
      category: "व्यापार",
      location: "मुंबई",
      tags: ["शेयर बाजार", "सेंसेक्स", "व्यापार"],
      timestamp: "3 घंटे पहले",
      reporter: "बिजनेस डेस्क",
      isFollowing: true,
      likes: 189,
      comments: 25,
      shares: 12,
      isBookmarked: true,
      isTrending: true,
      url: "#",
      source: "Business News"
    }
  ];

  // Check if cache is still valid
  const isCacheValid = useCallback(() => {
    if (!lastFetchTime || newsCache.length === 0) return false;
    return Date.now() - lastFetchTime < CACHE_DURATION;
  }, [lastFetchTime, newsCache.length]);

  // Optimized news fetching with minimal API calls
  const fetchNewsFromAPIs = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isRequestInProgress) {
      console.log('Request already in progress, skipping...');
      return newsCache;
    }

    try {
      setIsRequestInProgress(true);
      setLoading(true);
      setError(null);

      let allArticles = [];
      
      // Fetch from optimized endpoints sequentially to avoid rate limits
      for (const endpoint of OPTIMIZED_NEWS_ENDPOINTS) {
        try {
          console.log(`Fetching from: ${endpoint.name}`);
          const response = await fetch(endpoint.url);
          
          if (response.ok) {
            const data = await response.json();
            if (data.status === 'ok' && data.articles && data.articles.length > 0) {
              const formattedArticles = formatNewsData(data.articles, endpoint.category);
              allArticles = [...allArticles, ...formattedArticles];
              
              // Break early if we have enough articles
              if (allArticles.length >= 80) {
                console.log(`Sufficient articles collected: ${allArticles.length}`);
                break;
              }
            }
          } else {
            console.warn(`API response not OK: ${response.status} for ${endpoint.name}`);
          }
          
          // Add small delay between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 300));
          
        } catch (err) {
          console.error(`Error fetching from ${endpoint.name}:`, err);
          continue;
        }
      }

      // If we still don't have enough articles, add static fallback
      if (allArticles.length < 20) {
        console.log('Adding static fallback articles');
        allArticles = [...allArticles, ...getStaticFallbackNews()];
      }

      // Remove duplicates based on title
      const uniqueArticles = allArticles.filter((article, index, self) => 
        index === self.findIndex(a => a.title === article.title)
      );

      // Shuffle and store articles
      const shuffledArticles = uniqueArticles.sort(() => Math.random() - 0.5);
      setNewsCache(shuffledArticles);
      setLastFetchTime(Date.now());
      setCurrentPage(1);
      setHasMore(shuffledArticles.length > ITEMS_PER_PAGE);

      console.log(`✅ Successfully cached ${shuffledArticles.length} articles`);
      return shuffledArticles;

    } catch (err) {
      console.error('Error fetching news:', err);
      setError('समाचार लोड करने में समस्या');
      
      // Return static fallback on error
      const fallbackNews = getStaticFallbackNews();
      setNewsCache(fallbackNews);
      return fallbackNews;
    } finally {
      setLoading(false);
      setIsRequestInProgress(false);
    }
  }, [newsCache, isRequestInProgress]);

  // Get paginated news
  const getPaginatedNews = useCallback((page = 1) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return newsCache.slice(0, endIndex);
  }, [newsCache]);

  // Load more news (for infinite scroll)
  const loadMoreNews = useCallback(() => {
    if (loading || !hasMore || isRequestInProgress) return;

    const nextPage = currentPage + 1;
    const totalAvailable = newsCache.length;
    const nextPageEndIndex = nextPage * ITEMS_PER_PAGE;

    if (nextPageEndIndex >= totalAvailable) {
      setHasMore(false);
    }

    setCurrentPage(nextPage);
  }, [currentPage, loading, hasMore, newsCache.length, isRequestInProgress]);

  // Get initial news (with caching)
  const getNews = useCallback(async () => {
    if (isCacheValid()) {
      console.log('Using cached news data');
      return getPaginatedNews(1);
    }
    
    console.log('Fetching fresh news data');
    const freshNews = await fetchNewsFromAPIs();
    return getPaginatedNews(1);
  }, [isCacheValid, getPaginatedNews, fetchNewsFromAPIs]);

  // Refresh news (force fetch)
  const refreshNews = useCallback(async () => {
    setNewsCache([]);
    setLastFetchTime(null);
    setCurrentPage(1);
    setHasMore(true);
    setIsRequestInProgress(false);
    return await fetchNewsFromAPIs();
  }, [fetchNewsFromAPIs]);

  const value = {
    newsCache,
    currentPage,
    hasMore,
    loading,
    error,
    getNews,
    loadMoreNews,
    refreshNews,
    getPaginatedNews,
    isCacheValid: isCacheValid()
  };

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
};