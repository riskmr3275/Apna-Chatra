import React, { useState } from 'react';

const SearchFilter = ({ onSearch, onFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    category: '',
    location: '',
    dateRange: '',
    reporter: ''
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    onFilter(filter);
  };

  const handleAdvancedFilter = (key, value) => {
    const newFilters = { ...advancedFilters, [key]: value };
    setAdvancedFilters(newFilters);
    // Apply advanced filters logic here
  };

  const quickFilters = [
    { id: 'all', label: 'All', icon: '📰' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'latest', label: 'New', icon: '⚡' },
    { id: 'bookmarked', label: 'Saved', icon: '🔖' },
    { id: 'following', label: 'Following', icon: '👥' }
  ];

  const categories = [
    'राजनीति', 'खेल', 'तकनीक', 'व्यापार', 'शिक्षा', 'मनोरंजन', 
    'स्वास्थ्य', 'विज्ञान', 'अंतर्राष्ट्रीय', 'अर्थव्यवस्था'
  ];

  const locations = [
    'नई दिल्ली', 'मुंबई', 'बेंगलुरु', 'चेन्नई', 'कोलकाता', 
    'हैदराबाद', 'पुणे', 'अहमदाबाद', 'जयपुर', 'लखनऊ'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="समाचार, टैग्स, या रिपोर्टर खोजें..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        </button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilter(filter.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t pt-4 space-y-4">
          <h4 className="font-semibold text-gray-800">एडवांस्ड फिल्टर</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">कैटेगरी</label>
              <select
                value={advancedFilters.category}
                onChange={(e) => handleAdvancedFilter('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">सभी कैटेगरी</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">स्थान</label>
              <select
                value={advancedFilters.location}
                onChange={(e) => handleAdvancedFilter('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">सभी स्थान</option>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">समय सीमा</label>
              <select
                value={advancedFilters.dateRange}
                onChange={(e) => handleAdvancedFilter('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">सभी समय</option>
                <option value="1h">पिछले 1 घंटे</option>
                <option value="24h">पिछले 24 घंटे</option>
                <option value="7d">पिछले 7 दिन</option>
                <option value="30d">पिछले 30 दिन</option>
              </select>
            </div>

            {/* Reporter Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">रिपोर्टर</label>
              <input
                type="text"
                placeholder="रिपोर्टर का नाम"
                value={advancedFilters.reporter}
                onChange={(e) => handleAdvancedFilter('reporter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center space-x-3">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              फिल्टर लगाएं
            </button>
            <button 
              onClick={() => setAdvancedFilters({ category: '', location: '', dateRange: '', reporter: '' })}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              रीसेट करें
            </button>
          </div>
        </div>
      )}

      {/* Suggest Topic */}
      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800">Any Suggestion</h4>
            <p className="text-sm text-gray-600">Contact the Admin</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            सुझाव दें
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;