import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnimationProvider } from './contexts/AnimationContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import HowToUsePage from './pages/HowToUsePage';
import AboutUsPage from './pages/AboutUsPage';
import WatermarkPage from './pages/Watermark';

function App() {
  return (
    <ThemeProvider>
      <AnimationProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/watermark" element={<WatermarkPage />} />
              <Route path="/cara-penggunaan" element={<HowToUsePage />} />
              <Route path="/tentang-kami" element={<AboutUsPage />} />
            </Routes>
          </Layout>
        </Router>
      </AnimationProvider>
    </ThemeProvider>
  );
}

export default App;