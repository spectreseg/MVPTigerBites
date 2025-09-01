import React, { useEffect, useState, useRef } from 'react';
import { Upload, Camera } from 'lucide-react';
import StarryBackground from './StarryBackground';
import tigerImage from '../assets/tiger3.png'; // Using tiger3.png as specified

interface OnboardingScreen4Props {
  onBack: () => void;
  onProceed: () => void;
}

export default function OnboardingScreen4({ onBack, onProceed }: OnboardingScreen4Props) {
  const [tigerVisible, setTigerVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tigerTimer = setTimeout(() => setTigerVisible(true), 300);
    const buttonsTimer = setTimeout(() => setButtonsVisible(true), 800);

    return () => {
      clearTimeout(tigerTimer);
      clearTimeout(buttonsTimer);
    };
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Starry background */}
      <StarryBackground />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-4 md:py-8">
        {/* Content container with tiger and text */}
        <div className="relative flex flex-col items-center justify-center -mb-8 md:-mb-16">
          {/* Text above tiger */}
          <div className="mb-4 md:mb-6 text-center">
            <h2 className="text-white text-xl md:text-2xl font-medium">
              Please upload an avatar
            </h2>
          </div>

          {/* Monte mascot */}
          <div
            className={`flex-shrink-0 transition-transform duration-1000 ease-out ${
              tigerVisible ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <img
              src={tigerImage}
              alt="Monte the Tiger Mascot with Phone"
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
                back
              </button>
            </div>

            {/* Upload button */}
            <div
              className={`order-1 md:order-2 w-full max-w-md mx-auto md:mx-0 transition-all duration-700 ease-out ${
                buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={handleUploadClick}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2.5 md:py-3 rounded-xl text-base md:text-lg font-semibold hover:bg-gray-300 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-gray-300 flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload
              </button>
              
              {/* Show selected image preview */}
              {selectedImage && (
                <div className="mt-3 flex justify-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <img
                      src={selectedImage}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Proceed button */}
            <div
              className={`order-2 md:order-3 flex justify-center transition-all duration-700 ease-out ${
                buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              <button
                onClick={onProceed}
                className="bg-purple-600 text-white px-8 py-2.5 md:px-10 md:py-3 rounded-xl text-base md:text-lg font-semibold hover:bg-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-purple-600 min-w-[120px] w-full md:w-auto"
              >
                proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}