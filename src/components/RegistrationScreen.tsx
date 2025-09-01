import React, { useEffect, useState } from 'react';
import StarryBackground from './StarryBackground';
import tigerImage from '../assets/tiger1.png';

interface RegistrationScreenProps {
  onBack: () => void;
  onProceed: () => void;
}

export default function RegistrationScreen({ onBack, onProceed }: RegistrationScreenProps) {
  const [tigerVisible, setTigerVisible] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  useEffect(() => {
    // Tiger flies up first
    const tigerTimer = setTimeout(() => {
      setTigerVisible(true);
    }, 300);

    // Bubble fades in after tiger
    const bubbleTimer = setTimeout(() => {
      setBubbleVisible(true);
    }, 800);

    // Buttons fly up last
    const buttonsTimer = setTimeout(() => {
      setButtonsVisible(true);
    }, 1300);

    return () => {
      clearTimeout(tigerTimer);
      clearTimeout(bubbleTimer);
      clearTimeout(buttonsTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Starry background */}
      <StarryBackground />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-between md:justify-center px-4 py-4 md:py-8">
        
        {/* Content container with tiger and speech bubble */}
        <div className="relative flex flex-col md:flex-row items-center justify-center flex-1 md:flex-none md:-mb-16">
          
          {/* Speech bubble - above tiger on mobile, to the right on desktop */}
          <div className={`relative md:absolute md:-top-16 md:left-80 z-20 mb-2 md:mb-0 order-1 md:order-none transition-opacity duration-700 ${bubbleVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white rounded-2xl p-4 md:p-5 shadow-2xl relative w-56 md:w-64 h-28 md:h-32 flex items-center justify-center">
              {/* Speech bubble tail - pointing down on mobile, down-left on desktop */}
              <div className="absolute md:bottom-0 md:left-12 bottom-0 left-1/2 md:left-12 transform md:translate-y-2 translate-y-2 -translate-x-1/2 md:translate-x-0">
                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-white"></div>
              </div>
              
              {/* Text content */}
              <div className="text-center">
                <p className="text-gray-900 text-sm md:text-base font-medium leading-tight">
                  Hi, I'm Monte. I'll help with<br />
                  registration. Ready to<br />
                  proceed?
                </p>
              </div>
            </div>
          </div>
          
          {/* Monte mascot - responsive sizing */}
          <div className={`flex-shrink-0 order-2 md:order-none transition-transform duration-1000 ease-out ${tigerVisible ? 'translate-y-0' : 'translate-y-full'}`}>
            <img
              src={tigerImage}
              alt="Monte the Tiger Mascot"
              className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] object-contain drop-shadow-2xl"
            />
          </div>
          
        </div>
        
        {/* Action buttons - responsive layout and order */}
        <div className={`flex flex-col md:flex-row gap-3 md:gap-52 items-center justify-center pb-4 md:pb-0 w-full max-w-sm md:max-w-none transition-all duration-700 ease-out ${buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          {/* Proceed button first on mobile, second on desktop */}
          <button
            onClick={onProceed}
            className="order-1 md:order-2 bg-purple-600 text-white px-8 py-2.5 md:px-10 md:py-3 rounded-xl text-base md:text-lg font-semibold hover:bg-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-purple-600 min-w-[120px] w-full md:w-auto"
          >
            Proceed
          </button>
          
          {/* Back button second on mobile, first on desktop */}
          <button
            onClick={onBack}
            className="order-2 md:order-1 bg-white text-purple-600 px-8 py-2.5 md:px-10 md:py-3 rounded-xl text-base md:text-lg font-semibold hover:bg-purple-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-purple-300 min-w-[120px] w-full md:w-auto"
          >
            Back
          </button>
        </div>
        
      </div>
    </div>
  );
}