import React, { useState } from 'react';
import Header from '../components/Header';
import SlidingBanner from '../components/SlidingBanner';
import TrendingNews from '../components/TrendingNews';
import SearchFilter from '../components/SearchFilter';
import NewsFeed from '../components/NewsFeed';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Home = () => {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (filter) => {
    setCurrentFilter(filter);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SlidingBanner />
      <TrendingNews />
      
      <div className="container mx-auto px-4 py-6">
        {/* Search and Filter Section */}
        <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />
        
        {/* Main Layout: Left Sidebar + News Feed + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Sticky */}
          <div className="lg:col-span-3">
            <div className="sticky top-4 max-h-screen overflow-y-auto">
              <Sidebar position="left" />
            </div>
          </div>
          
          {/* Main News Feed - Scrollable */}
          <div className="lg:col-span-6">
            <NewsFeed filter={currentFilter} searchQuery={searchQuery} />
          </div>
          
          {/* Right Sidebar - Sticky */}
          <div className="lg:col-span-3">
            <div className="sticky top-4 max-h-screen overflow-y-auto">
              <Sidebar position="right" />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;