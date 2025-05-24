import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-primary mr-2"
              >
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/>
                <path d="M5.3 10.8a10 10 0 0 0 0 2.4"/>
                <path d="M9 18.7a10 10 0 0 0 6 0"/>
                <path d="M9 5.3a10 10 0 0 1 6 0"/>
                <path d="M18.7 9a10 10 0 0 0 0 6"/>
                <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>
                <path d="M16 17a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>
              </svg>
              <span className="text-foreground font-medium">InMark</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              &copy; {currentYear} InMark. Hak Cipta Dilindungi.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/Maxiyzz"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Github"
            >
              <Github size={20} />
            </a>
            <div className="text-sm text-muted-foreground">
              Dikembangkan untuk Penelitian Watermarking Digital
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;