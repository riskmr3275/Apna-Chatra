import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewsCard = ({
  title,
  image,
  description,
  isMainNews = false,
  hasVideo = false,
  timestamp,
  category,
  id,
  onSignInClick,
  likes = Math.floor(Math.random() * 100) + 10,
  comments = Math.floor(Math.random() * 50) + 5,
  shares = Math.floor(Math.random() * 30) + 2,
  isBookmarked = false,
  showSocialActions = true,
  isInFeed = false,
  reporter = "न्यूज़ डेस्क",
  location = "नई दिल्ली"
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [commentCount] = useState(comments);
  const [shareCount] = useState(shares);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [showReportModal, setShowReportModal] = useState(false);
  const navigate = useNavigate();

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('लिंक कॉपी हो गया!');
    }
  };

  const handleComment = (e) => {
    e.stopPropagation();
    // Navigate to news detail page with comments section opened
    navigate(`/news/${id || 1}?comments=true`);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  const handleReport = (e) => {
    e.stopPropagation();
    setShowReportModal(true);
  };

  const handleCardClick = () => {
    navigate(`/news/${id || 1}`);
  };

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
    <div className={`bg-white rounded-lg overflow-hidden   transition-all duration-300 cursor-pointer ${isMainNews ? 'col-span-1 md:col-span-2 row-span-2' : ''
      }`} onClick={handleCardClick}>
      <div className="relative">
        <img
          src={image || "/temp.webp"}
          alt={title}
          className={`w-full object-cover ${isMainNews ? 'h-48 md:h-64' : 'h-40 md:h-48'}`}
        />
        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 rounded-full p-2 md:p-3 hover:bg-opacity-70 transition-all">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5v10l8-5-8-5z" />
              </svg>
            </div>
          </div>
        )}
        {category && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
            {category}
          </div>
        )}
      </div>

      <div className="p-3 md:p-4">
        {/* Website Logo with Date and Time */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <img
              src="/Logo.png"
              alt="Website Logo"
              className="w-6 h-6 md:w-8 md:h-8 object-contain"
            />
            <div className="text-xs text-gray-600">
              <div className="font-medium">अपना छत्रा न्यूज़</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-right">
            <div>{date}</div>
            <div>{time}</div>
          </div>
        </div>

        <h3 className={`font-bold text-gray-800 mb-2 line-clamp-3 hover:text-red-600 transition-colors ${isMainNews ? 'text-lg md:text-xl' : 'text-sm md:text-base'
          }`}>
          {title}
        </h3>

        {description && (
          <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Author and Location Info */}
        {!isInFeed && (
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{reporter}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{location}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{timestamp}</span>
          <span>{Math.floor(Math.random() * 1000) + 100} views</span>
        </div>

        {/* Social Media Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-all hover:bg-gray-100 ${liked ? 'text-red-600' : 'text-gray-600'
              }`}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs md:text-sm">{likeCount}</span>
          </button>

          <button
            onClick={handleComment}
            className="flex items-center space-x-1 px-2 py-1 rounded-full transition-all hover:bg-gray-100 text-gray-600"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs md:text-sm">{commentCount}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-1 px-2 py-1 rounded-full transition-all hover:bg-gray-100 text-gray-600"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="text-xs md:text-sm">{shareCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;