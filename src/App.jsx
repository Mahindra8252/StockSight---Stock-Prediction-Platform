import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StockPredictionPlatform from './components/StockPredictionPlatform';
import Stockprediction_oneday from './components/Stockprediction_oneday';
import StockPrediction_tenday from './components/StockPrediction_tenday';
import AboutUs from './components/AboutUs';

import './index.css';

const App = () => {
  return (
    <div >
      {/* Toast notification container */}

      <ToastContainer />

      {/* Navigation bar */}
      <Navbar />

      {/* Define routes */}
      <Routes>
        <Route path="/" element={<Stockprediction_oneday />} />
        <Route path="/2" element={<StockPrediction_tenday />} />
        <Route path="/3" element={<StockPredictionPlatform />} />
        <Route path="/Aboutus" element={<AboutUs />} />

      </Routes>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
