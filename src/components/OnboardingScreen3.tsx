import React, { useEffect, useState } from 'react';
import StarryBackground from './StarryBackground';
import tigerImage from '../assets/tiger3.png';

interface OnboardingScreen3Props {
  onBack: () => void;
  onProceed: (data: { locationEnabled: boolean; latitude?: number; longitude?: number }) => void;
}

export default function OnboardingScreen3({ onBack, onProceed }: OnboardingScreen3Props) {
  const [tigerVisible, setTigerVisible] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  useEffect(() => {
    const tigerTimer = setTimeout(() => setTigerVisible(true), 300);
    const bubbleTimer = setTimeout(() => setBubbleVisible(true), 800);
    const buttonsTimer = setTimeout(() => setButtonsVisible(true), 1300);

    return () => {
      clearTimeout(tigerTimer);
      clearTimeout(bubbleTimer);
      clearTimeout(buttonsTimer);
    };
  }, []);

  const handleUseLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onProceed({
            locationEnabled: true,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          onProceed({
            locationEnabled: false
          });
        }
      );
    } else {
      onProceed({
        locationEnabled: false
      });
    }
  };

  const handleSkipLocation = () => {
    onProceed({
      locationEnabled: false
    });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Starry background */}
      <StarryBackground />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-4 md:py-8">
        {/* Content container with tiger and text */}
        <div className="relative flex flex-col items-center justify-center -mb-8 md:-mb-16">
          {/* Speech bubble */}
          <div
            className={`relative md:absolute md:-top-8 md:left-80 z-20 mb-2 md:mb-0 order-1 md:order-none transition-opacity duration-700 ${
              bubbleVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="bg-white rounded-2xl p-2 md:p-3 shadow-2xl relative w-64 md:w-72 h-20 md:h-24 flex items-center justify-center">
              {/* Speech bubble tail */}
              <div className="absolute bottom-0 left-1/2 md:left-12 transform translate-y-2 -translate-x-1/2 md:translate-x-0">
                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-white" />
              </div>

              {/* Text content */}
              <div className="text-center">
                <p className="text-gray-900 text-sm md:text-base font-medium leading-tight">
                  Please enable location<br />
                  services for the best<br />
                  experience.
                </p>
              </div>
            </div>
          </div>

          {/* Monte mascot */}
          <div
            className={`flex-shrink-0 order-2 md:order-none transition-transform duration-1000 ease-out ${
              tigerVisible ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <img
              src={tigerImage}
              alt="Monte the Tiger Mascot with Map"
              className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Gap below tiger */}
        <div className="h-8 md:h-12"></div>

        {/* Buttons container */}
        <div className="w-full max-w-6xl mx-auto mb-4">
          {/* All buttons on same level - mobile: stacked, desktop: side by side */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-center md:gap-8">
            {/* Back button */}
            <div
              className={`order-3 md:order-1 flex justify-center transition-all duration-700 ease-out ${
                buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              <button
                onClick={onBack}
                className="bg-white text-purple-600 px-8 py-2.5 md:px-10 md:py-3 rounded-xl text-base md:text-lg font-semibold hover:bg-purple-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-purple-300 min-w-[120px] w-full md:w-auto"
              >
                Back
              </button>
            </div>

            {/* Use my location button */}
            <div
              className={`order-1 md:order-2 w-full max-w-md mx-auto md:mx-0 transition-all duration-700 ease-out ${
                buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              <button
                onClick={handleUseLocation}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2.5 md:py-3 rounded-xl text-base md:text-lg font-semibold hover:bg-gray-300 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-gray-300"
              >
                Use my location
              </button>
            </div>

            {/* Proceed button */}
            <div
              className={`order-2 md:order-3 flex justify-center transition-all duration-700 ease-out ${
                buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              <button
                onClick={handleSkipLocation}
                className="bg-purple-600 text-white px-8 py-2.5 md:px-10 md:py-3 rounded-xl text-base md:text-lg font-semibold hover:bg-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-purple-600 min-w-[120px] w-full md:w-auto"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}