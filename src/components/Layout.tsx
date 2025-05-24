import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { useAnimation } from '../contexts/AnimationContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { animationsEnabled, animationSpeed } = useAnimation();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4 * (1 / animationSpeed), 
        ease: "easeOut" 
      } 
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      transition: { 
        duration: 0.3 * (1 / animationSpeed), 
        ease: "easeIn" 
      } 
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {animationsEnabled ? (
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            {children}
          </motion.div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;