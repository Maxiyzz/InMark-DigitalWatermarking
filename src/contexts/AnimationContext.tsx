import React, { createContext, useContext, useState } from 'react';

interface AnimationContextType {
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  animationsEnabled: boolean;
  toggleAnimations: () => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [animationSpeed, setAnimationSpeed] = useState<number>(() => {
    const savedSpeed = localStorage.getItem('animationSpeed');
    return savedSpeed ? parseFloat(savedSpeed) : 1;
  });
  
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() => {
    const savedState = localStorage.getItem('animationsEnabled');
    return savedState ? savedState === 'true' : true;
  });

  const toggleAnimations = () => {
    const newState = !animationsEnabled;
    setAnimationsEnabled(newState);
    localStorage.setItem('animationsEnabled', String(newState));
  };

  const updateAnimationSpeed = (speed: number) => {
    setAnimationSpeed(speed);
    localStorage.setItem('animationSpeed', String(speed));
  };

  return (
    <AnimationContext.Provider
      value={{ 
        animationSpeed, 
        setAnimationSpeed: updateAnimationSpeed, 
        animationsEnabled, 
        toggleAnimations 
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
}