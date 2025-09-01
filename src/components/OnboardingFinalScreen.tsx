import React, { useEffect, useState } from 'react';
import StarryBackground from './StarryBackground';
import tigerImage from '../assets/tiger5.png';

interface OnboardingFinalScreenProps {
  onComplete: () => void;
}

export default function OnboardingFinalScreen({ onComplete }: OnboardingFinalScreenProps) {
  const [tigerVisible, setTigerVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    // Text fades in first
    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 300);

    // Tiger flies up after text
    const tigerTimer = setTimeout(() => {
      setTigerVisible(true);
    }, 800);

    // Auto-redirect after 4 seconds
    const redirectTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(tigerTimer);
      clearTimeout(redirectTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Starry background */}
      <StarryBackground />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-4 md:py-8">
        
        {/* Thank you message */}
        <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ease-out ${textVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-wide mb-4">
            Thanks for registering!
          </h1>
          <p className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light tracking-wide italic">
            Redirecting to dashboard...
          </p>
        </div>

        {/* Monte mascot with heart */}
        <div className={`transition-transform duration-1000 ease-out ${tigerVisible ? 'translate-y-0' : 'translate-y-full'}`}>
          <img
            src={tigerImage}
            alt="Monte the Tiger Mascot with Heart"
            className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] object-contain drop-shadow-2xl"
          />
        </div>
        
      </div>
    </div>
  );
}