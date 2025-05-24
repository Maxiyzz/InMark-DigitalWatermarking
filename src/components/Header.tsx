import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAnimation } from '../contexts/AnimationContext';
import SettingsPanel from './SettingsPanel';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { animationsEnabled } = useAnimation();

  const isActive = (path: string) => location.pathname === path;

  const menuVariants = {
    closed: { 
      opacity: 0,
      y: -20,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-primary"
              >
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/>
                <path d="M5.3 10.8a10 10 0 0 0 0 2.4"/>
                <path d="M9 18.7a10 10 0 0 0 6 0"/>
                <path d="M9 5.3a10 10 0 0 1 6 0"/>
                <path d="M18.7 9a10 10 0 0 0 0 6"/>
                <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>
                <path d="M16 17a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>
              </svg>
              <span className="text-xl font-bold text-primary">InMark</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition duration-150 ${
                isActive('/') 
                  ? 'text-primary font-semibold' 
                  : 'text-foreground/80 hover:text-primary'
              }`}
            >
              Beranda
            </Link>
            <Link 
              to="/watermark" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition duration-150 ${
                isActive('/watermark') 
                  ? 'text-primary font-semibold' 
                  : 'text-foreground/80 hover:text-primary'
              }`}
            >
              Watermark
            </Link>
            <Link 
              to="/cara-penggunaan" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition duration-150 ${
                isActive('/cara-penggunaan') 
                  ? 'text-primary font-semibold' 
                  : 'text-foreground/80 hover:text-primary'
              }`}
            >
              Cara Penggunaan
            </Link>
            <Link 
              to="/tentang-kami" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition duration-150 ${
                isActive('/tentang-kami') 
                  ? 'text-primary font-semibold' 
                  : 'text-foreground/80 hover:text-primary'
              }`}
            >
              Tentang Kami
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="text-foreground/90 hover:text-primary p-2 rounded-md transition-colors"
              aria-label="Pengaturan"
            >
              <Settings size={20} />
            </button>
            
            <button
              type="button"
              onClick={toggleTheme}
              className="text-foreground/90 hover:text-primary p-2 rounded-md transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-foreground p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="pt-4 pb-6 px-6">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-primary"
                >
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/>
                  <path d="M5.3 10.8a10 10 0 0 0 0 2.4"/>
                  <path d="M9 18.7a10 10 0 0 0 6 0"/>
                  <path d="M9 5.3a10 10 0 0 1 6 0"/>
                  <path d="M18.7 9a10 10 0 0 0 0 6"/>
                  <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>
                  <path d="M16 17a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>
                </svg>
                <span className="text-xl font-bold text-primary">InMark</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            
            {animationsEnabled ? (
              <motion.nav
                initial="closed"
                animate="open"
                variants={menuVariants}
                className="mt-8 space-y-3"
              >
                <motion.div variants={menuItemVariants}>
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-md ${
                      isActive('/') 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    Beranda
                  </Link>
                </motion.div>
                
                <motion.div variants={menuItemVariants}>
                  <Link
                    to="/watermark"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-md ${
                      isActive('/watermark') 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    Watermark
                  </Link>
                </motion.div>
                
                <motion.div variants={menuItemVariants}>
                  <Link
                    to="/cara-penggunaan"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-md ${
                      isActive('/cara-penggunaan') 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    Cara Penggunaan
                  </Link>
                </motion.div>
                
                <motion.div variants={menuItemVariants}>
                  <Link
                    to="/tentang-kami"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-md ${
                      isActive('/tentang-kami') 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    Tentang Kami
                  </Link>
                </motion.div>
                
                <motion.div variants={menuItemVariants} className="pt-4">
                  <div className="flex space-x-4 items-center px-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSettingsOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-foreground/90 py-2"
                    >
                      <Settings size={18} />
                      <span>Pengaturan</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="flex items-center space-x-2 text-foreground/90 py-2"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun size={18} />
                          <span>Mode Terang</span>
                        </>
                      ) : (
                        <>
                          <Moon size={18} />
                          <span>Mode Gelap</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.nav>
            ) : (
              <nav className="mt-8 space-y-3">
                <div>
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-md ${
                      isActive('/') 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    Beranda
                  </Link>
                </div>
                
                <div>
                  <Link
                    to="/watermark"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-md ${
                      isActive('/watermark') 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    Watermark
                  </Link>
                </div>
                
                <div>
                  <Link
                    to="/cara-penggunaan"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-md ${
                      isActive('/cara-penggunaan') 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    Cara Penggunaan
                  </Link>
                </div>
                
                <div>
                  <Link
                    to="/tentang-kami"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-md ${
                      isActive('/tentang-kami') 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    Tentang Kami
                  </Link>
                </div>
                
                <div className="pt-4">
                  <div className="flex space-x-4 items-center px-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSettingsOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-foreground/90 py-2"
                    >
                      <Settings size={18} />
                      <span>Pengaturan</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="flex items-center space-x-2 text-foreground/90 py-2"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun size={18} />
                          <span>Mode Terang</span>
                        </>
                      ) : (
                        <>
                          <Moon size={18} />
                          <span>Mode Gelap</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </nav>
            )}
          </div>
        </div>
      )}
      
      {isSettingsOpen && <SettingsPanel onClose={() => setIsSettingsOpen(false)} />}
    </header>
  );
};

export default Header;