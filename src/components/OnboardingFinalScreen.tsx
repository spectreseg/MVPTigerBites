import React, { useEffect, useState } from 'react';
import StarryBackground from './StarryBackground';
import tigerImage from '../assets/tiger5.png';

interface OnboardingFinalScreenProps {
  onComplete: () => void;
}

export default function OnboardingFinalScreen({ onComplete }: OnboardingFinalScreenProps) {
  const [textVisible, setTextVisible] = useState(false);
  const [tigerVisible, setTigerVisible] = useState(false);

  useEffect(() => {
    // Text appears first
    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 100);

    // Tiger flies up quickly after text
    const tigerTimer = setTimeout(() => {
      setTigerVisible(true);
    }, 200);

    // Complete registration after 3 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(tigerTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Starry background */}
      <StarryBackground />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-4 md:py-8">
        
        {/* Thank you message */}
        <div className={`text-center mb-4 md:mb-8 transition-all duration-500 ease-out ${textVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-light tracking-wide mb-2 md:mb-4">
            Thanks for registering!
          </h1>
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-light tracking-wide">
            Welcome to TigerBites
          </p>
        </div>

        {/* Monte mascot with heart */}
        <div className={`flex-shrink-0 transition-transform duration-500 ease-out ${tigerVisible ? 'translate-y-0' : 'translate-y-full'}`}>
          <img
            src={tigerImage}
            alt="Monte the Tiger Mascot with Heart"
            className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] object-contain drop-shadow-2xl"
          />
        </div>
        
      </div>
    </div>
  );
}