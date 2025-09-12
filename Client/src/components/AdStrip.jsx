import React from 'react';

const AdStrip = ({ 
  title, 
  description, 
  link = "#", 
  sponsor = "प्रायोजित",
  backgroundColor = "bg-gradient-to-r from-blue-50 to-purple-50",
  textColor = "text-gray-700",
  icon = null,
  compact = false
}) => {
  const handleClick = () => {
    if (link && link !== "#") {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`${backgroundColor} border border-gray-200 rounded-lg ${compact ? 'p-2 my-3' : 'p-3 my-4'} cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-300`} onClick={handleClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {icon && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                {icon}
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full font-medium shadow-sm">
                {sponsor}
              </span>
            </div>
            <h4 className={`font-semibold ${compact ? 'text-xs' : 'text-sm'} ${textColor} mb-1 line-clamp-1`}>
              {title}
            </h4>
            <p className={`${compact ? 'text-xs' : 'text-xs'} ${textColor} opacity-80 line-clamp-1`}>
              {description}
            </p>
          </div>
        </div>
        <div className="ml-3 flex-shrink-0">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AdStrip;