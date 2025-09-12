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

  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;
  const ITEMS_PER_PAGE = 20;

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
    },
    {
      name: 'Hindi Entertainment News',
      url: `https://newsapi.org/v2/top-headlines?country=in&category=entertainment&language=hi&apiKey=${NEWS_API_KEY}`,
      category: 'मनोरंजन'
    },
    {
      name: 'Hindi Health News',
      url: `https://newsapi.org/v2/top-headlines?country=in&category=health&language=hi&apiKey=${NEWS_API_KEY}`,
      category: 'स्वास्थ्य'
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
      name: 'English Sports News',
      url: `https://newsapi.org/v2/top-headlines?country=us&category=sports&language=en&apiKey=${NEWS_API_KEY}`,
      category: 'खेल'
    },
    {
      name: 'Apple News',
      url: `https://newsapi.org/v2/everything?q=apple&language=en&sortBy=popularity&apiKey=${NEWS_API_KEY}`,
      category: 'तकनीक'
    },
    {
      name: 'Wall Street Journal',
      url: `https://newsapi.org/v2/everything?domains=wsj.com&language=en&apiKey=${NEWS_API_KEY}`,
      category: 'व्यापार'
    }
  ];

  // Helper functions
  const formatNewsData = (articles, defaultCategory = 'व्यापार') => {
    return articles.map((article, index) => ({
      id: Date.now() + Math.random() * 1000 + index, // More unique ID
      title: article.title || 'No Title Available',
      image: article.urlToImage || '/temp.webp',
      description: article.description || 'No description available',
      category: getCategoryInHindi(article.source?.name, defaultCategory),
      location: getLocationFromSource(article.source?.name || 'US'),
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
      'Wall Street Journal': 'व्यापार',
      'Financial Times': 'व्यापार',
      'Fortune': 'व्यापार',
      'Business Insider': 'व्यापार',
      'TechCrunch': 'तकनीक',
      'CNET': 'तकनीक',
      'Apple': 'तकनीक',
      'The Verge': 'तकनीक'
    };
    return categories[sourceName] || defaultCategory;
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
    return locations[sourceName] || 'भारत';
  };

  const generateTags = (title, description) => {
    const text = `${title} ${description}`.toLowerCase();
    const commonTags = [];
    
    if (text.includes('apple')) commonTags.push('Apple');
    if (text.includes('ai') || text.includes('artificial intelligence')) commonTags.push('AI');
    if (text.includes('tech') || text.includes('technology')) commonTags.push('तकनीक');
    if (text.includes('business') || text.includes('company')) commonTags.push('व्यापार');
    if (text.includes('stock') || text.includes('market')) commonTags.push('शेयर बाजार');
    
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

  // Check if cache is still valid
  const isCacheValid = useCallback(() => {
    if (!lastFetchTime || newsCache.length === 0) return false;
    return Date.now() - lastFetchTime < CACHE_DURATION;
  }, [lastFetchTime, newsCache.length]);

  // Fetch news from APIs
  const fetchNewsFromAPIs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try Hindi sources first
      let allArticles = [];
      
      // Fetch from Hindi endpoints
      for (const endpoint of HINDI_NEWS_ENDPOINTS) {
        try {
          const response = await fetch(endpoint.url);
          if (response.ok) {
            const data = await response.json();
            if (data.status === 'ok' && data.articles) {
              const formattedArticles = formatNewsData(data.articles.slice(0, 15), endpoint.category);
              allArticles = [...allArticles, ...formattedArticles];
            }
          }
        } catch (err) {
          console.error(`Error fetching from ${endpoint.name}:`, err);
        }
      }

      // If not enough Hindi articles, fetch English
      if (allArticles.length < 50) {
        for (const endpoint of ENGLISH_NEWS_ENDPOINTS) {
          try {
            const response = await fetch(endpoint.url);
            if (response.ok) {
              const data = await response.json();
              if (data.status === 'ok' && data.articles) {
                const formattedArticles = formatNewsData(data.articles.slice(0, 10), endpoint.category);
                allArticles = [...allArticles, ...formattedArticles];
              }
            }
          } catch (err) {
            console.error(`Error fetching from ${endpoint.name}:`, err);
          }
        }
      }

      // Shuffle and store all articles
      const shuffledArticles = allArticles.sort(() => Math.random() - 0.5);
      setNewsCache(shuffledArticles);
      setLastFetchTime(Date.now());
      setCurrentPage(1);
      setHasMore(shuffledArticles.length > ITEMS_PER_PAGE);

      return shuffledArticles;
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('समाचार लोड करने में समस्या');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get paginated news
  const getPaginatedNews = useCallback((page = 1) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return newsCache.slice(0, endIndex);
  }, [newsCache]);

  // Load more news (for infinite scroll)
  const loadMoreNews = useCallback(() => {
    if (loading || !hasMore) return;

    const nextPage = currentPage + 1;
    const totalAvailable = newsCache.length;
    const nextPageEndIndex = nextPage * ITEMS_PER_PAGE;

    if (nextPageEndIndex >= totalAvailable) {
      setHasMore(false);
    }

    setCurrentPage(nextPage);
  }, [currentPage, loading, hasMore, newsCache.length]);

  // Get initial news (with caching)
  const getNews = useCallback(async () => {
    if (isCacheValid()) {
      return getPaginatedNews(1);
    }
    
    const freshNews = await fetchNewsFromAPIs();
    return getPaginatedNews(1);
  }, [isCacheValid, getPaginatedNews, fetchNewsFromAPIs]);

  // Refresh news (force fetch)
  const refreshNews = useCallback(async () => {
    setNewsCache([]);
    setLastFetchTime(null);
    setCurrentPage(1);
    setHasMore(true);
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