import React, { useEffect, useState } from 'react';
import StarryBackground from './StarryBackground';
import tigerImage from '../assets/tiger2.png';

interface OnboardingScreen2Props {
  onBack: () => void;
  onProceed: () => void;
}

export default function OnboardingScreen2({ onBack, onProceed }: OnboardingScreen2Props) {
  const [tigerVisible, setTigerVisible] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    // Tiger flies up first
    const tigerTimer = setTimeout(() => {
      setTigerVisible(true);
    }, 300);

    // Bubble fades in after tiger
    const bubbleTimer = setTimeout(() => {
      setBubbleVisible(true);
    }, 800);

    // Form appears after bubble
    const formTimer = setTimeout(() => {
      setFormVisible(true);
    }, 1300);

    // Buttons fly up last
    const buttonsTimer = setTimeout(() => {
      setButtonsVisible(true);
    }, 1800);

    return () => {
      clearTimeout(tigerTimer);
      clearTimeout(bubbleTimer);
      clearTimeout(formTimer);
      clearTimeout(buttonsTimer);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear email error when user starts typing
    if (name === 'email' && emailError) {
      setEmailError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email domain
    if (!formData.email.endsWith('@sewanee.edu')) {
      setEmailError('Please use your Sewanee email');
      return;
    }
    
    console.log('Form submitted:', formData);
    onProceed();
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Starry background */}
      <StarryBackground />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-4 md:py-8">
        
        {/* Content container with tiger and speech bubble */}
        <div className="relative flex flex-col md:flex-row items-center justify-center -mb-8 md:-mb-16">
          
          {/* Speech bubble - above tiger on mobile, to the right on desktop */}
          <div className={`relative md:absolute md:-top-7 md:left-80 z-20 mb-2 md:mb-0 order-1 md:order-none transition-opacity duration-700 ${bubbleVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white rounded-2xl p-3 md:p-4 shadow-2xl relative w-56 md:w-64 h-24 md:h-20 flex items-center justify-center">
              {/* Speech bubble tail - pointing down on mobile, down-left on desktop */}
              <div className="absolute md:bottom-0 md:left-12 bottom-0 left-1/2 md:left-12 transform md:translate-y-2 translate-y-2 -translate-x-1/2 md:translate-x-0">
                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-white"></div>
              </div>
              
              {/* Text content */}
              <div className="text-center">
                <p className="text-gray-900 text-sm md:text-base font-medium leading-tight">
                  First, tell me about<br />
                  yourself.
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

        {/* Form and buttons container - desktop layout */}
        <div className="w-full max-w-6xl mx-auto mb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-center md:gap-8">
            
            {/* Back button - left side on desktop, top on mobile */}
            <div className={`order-3 md:order-1 flex justify-center md:justify-end transition-all duration-700 ease-out ${buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <button
                onClick={onBack}
                className="bg-white text-purple-600 px-8 py-2.5 md:px-10 md:py-3 rounded-xl text-base md:text-lg font-semibold hover:bg-purple-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-purple-300 min-w-[120px] w-full md:w-auto"
              >
                Back
              </button>
            </div>

            {/* Form container - center */}
            <div className={`order-1 md:order-2 w-full max-w-md mx-auto md:mx-0 mb-4 md:mb-0 transition-all duration-700 ease-out ${formVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-2xl space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white font-normal placeholder-gray-500"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.name@sewanee.edu"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white font-normal placeholder-gray-500 ${
                      emailError 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-purple-500'
                    }`}
                    required
                  />
                </div>
              </form>
            </div>

            {/* Proceed button - right side on desktop, bottom on mobile */}
            <div className={`order-2 md:order-3 flex justify-center md:justify-start transition-all duration-700 ease-out ${buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <button
                onClick={handleSubmit}
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