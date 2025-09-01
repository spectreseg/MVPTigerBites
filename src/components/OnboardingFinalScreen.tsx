import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import StarryBackground from './StarryBackground';

interface OnboardingFinalScreenProps {
  onComplete: () => void;
}

export default function OnboardingFinalScreen({ onComplete }: OnboardingFinalScreenProps) {
  const [tigerVisible, setTigerVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [heartVisible, setHeartVisible] = useState(false);

  useEffect(() => {
    // Tiger flies up first
    const tigerTimer = setTimeout(() => {
      setTigerVisible(true);
    }, 300);

    // Text fades in after tiger
    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 800);

    // Heart animation after text
    const heartTimer = setTimeout(() => {
      setHeartVisible(true);
    }, 1300);

    // Auto-redirect after 3 seconds
    const redirectTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(tigerTimer);
      clearTimeout(textTimer);
      clearTimeout(heartTimer);
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
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium mb-2 md:mb-4">
            Thanks for registering!
          </h1>
          <p className="text-white/80 text-base sm:text-lg md:text-xl">
            Redirecting to dashboard...
          </p>
        </div>

        {/* Monte mascot with heart */}
        <div className="relative">
          {/* Floating heart above Monte */}
          <div className={`absolute -top-8 md:-top-12 left-1/2 transform -translate-x-1/2 z-30 transition-all duration-1000 ease-out ${heartVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-75'}`}>
            <div className="relative">
              {/* Heart glow effect */}
              <div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-60 scale-150 animate-pulse"></div>
              <div className="absolute inset-0 bg-red-300 rounded-full blur-lg opacity-40 scale-125 animate-pulse"></div>
              
              {/* Heart icon */}
              <div className="relative z-10 bg-red-500 p-3 md:p-4 rounded-full shadow-2xl">
                <Heart className="w-6 h-6 md:w-8 md:h-8 text-white fill-white animate-pulse" />
              </div>
            </div>
          </div>

          {/* Monte mascot */}
          <div className={`transition-transform duration-1000 ease-out ${tigerVisible ? 'translate-y-0' : 'translate-y-full'}`}>
            {/* Create Monte with SVG since we don't have the specific image */}
            <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full drop-shadow-2xl"
              >
                {/* Tiger body */}
                <ellipse cx="100" cy="140" rx="45" ry="35" fill="#8B5CF6" />
                
                {/* Tiger head */}
                <circle cx="100" cy="80" r="40" fill="#F59E0B" />
                
                {/* Tiger stripes on head */}
                <path d="M70 70 Q75 65 80 70" stroke="#8B5CF6" strokeWidth="3" fill="none" />
                <path d="M120 70 Q125 65 130 70" stroke="#8B5CF6" strokeWidth="3" fill="none" />
                <path d="M75 85 Q80 80 85 85" stroke="#8B5CF6" strokeWidth="2" fill="none" />
                <path d="M115 85 Q120 80 125 85" stroke="#8B5CF6" strokeWidth="2" fill="none" />
                
                {/* Tiger ears */}
                <ellipse cx="80" cy="50" rx="12" ry="18" fill="#F59E0B" />
                <ellipse cx="120" cy="50" rx="12" ry="18" fill="#F59E0B" />
                <ellipse cx="80" cy="50" rx="6" ry="10" fill="#8B5CF6" />
                <ellipse cx="120" cy="50" rx="6" ry="10" fill="#8B5CF6" />
                
                {/* Tiger eyes */}
                <circle cx="88" cy="75" r="6" fill="white" />
                <circle cx="112" cy="75" r="6" fill="white" />
                <circle cx="88" cy="75" r="3" fill="black" />
                <circle cx="112" cy="75" r="3" fill="black" />
                
                {/* Tiger nose */}
                <ellipse cx="100" cy="85" rx="3" ry="2" fill="black" />
                
                {/* Tiger mouth */}
                <path d="M100 88 Q95 92 90 90" stroke="black" strokeWidth="2" fill="none" />
                <path d="M100 88 Q105 92 110 90" stroke="black" strokeWidth="2" fill="none" />
                
                {/* Tiger arms */}
                <ellipse cx="70" cy="120" rx="15" ry="25" fill="#F59E0B" />
                <ellipse cx="130" cy="120" rx="15" ry="25" fill="#F59E0B" />
                
                {/* Tiger legs */}
                <ellipse cx="80" cy="170" rx="12" ry="20" fill="#F59E0B" />
                <ellipse cx="120" cy="170" rx="12" ry="20" fill="#F59E0B" />
                
                {/* Sewanee S on chest */}
                <circle cx="100" cy="130" r="18" fill="#8B5CF6" />
                <text x="100" y="138" textAnchor="middle" fill="#F59E0B" fontSize="24" fontWeight="bold" fontFamily="serif">S</text>
                
                {/* Tiger tail */}
                <ellipse cx="145" cy="150" rx="8" ry="25" fill="#F59E0B" transform="rotate(20 145 150)" />
                <ellipse cx="148" cy="145" rx="3" ry="8" fill="#8B5CF6" transform="rotate(20 148 145)" />
              </svg>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}