import React, { useEffect, useState } from 'react';
import StarryBackground from './StarryBackground';

interface OnboardingFinalScreenProps {
  onComplete: () => void;
}

export default function OnboardingFinalScreen({ onComplete }: OnboardingFinalScreenProps) {
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    // Text fades in
    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 300);

    // Auto-redirect after 3 seconds
    const redirectTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(textTimer);
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
        <div className={`text-center transition-all duration-700 ease-out ${textVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium mb-4">
            Thanks for registering!
          </h1>
          <p className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium">
            Redirecting to dashboard...
          </p>
        </div>
        
      </div>
    </div>
  );
}