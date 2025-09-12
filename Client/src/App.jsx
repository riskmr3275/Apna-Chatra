import React from "react";
import { Routes, Route } from "react-router-dom";
import { NewsProvider } from "./context/NewsContext";
import Home from "./pages/Home";
import NewsDetail from "./pages/NewsDetail";

function App() {
  return (
    <NewsProvider>
      <div className="min-h-full bg-white w-full overflow-visible">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news/:id" element={<NewsDetail />} />
        </Routes>
      </div>
    </NewsProvider>
  );
}

export default App;
