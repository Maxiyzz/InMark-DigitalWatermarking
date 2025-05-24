import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { useAnimation } from '../contexts/AnimationContext';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { animationSpeed, setAnimationSpeed, animationsEnabled, toggleAnimations } = useAnimation();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-background/80 backdrop-blur-sm">
      <motion.div
        ref={panelRef}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-sm h-full bg-card border-l border-border shadow-lg"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Pengaturan</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Animasi</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="text-secondary" size={18} />
                    <span className="text-foreground">Aktifkan Animasi</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={animationsEnabled}
                    onClick={toggleAnimations}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      animationsEnabled ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-2">
                  <label htmlFor="animationSpeed" className="text-sm text-foreground">
                    Kecepatan Animasi: {animationSpeed.toFixed(1)}x
                  </label>
                  <input
                    id="animationSpeed"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                    disabled={!animationsEnabled}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Lambat</span>
                    <span>Normal</span>
                    <span>Cepat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPanel;