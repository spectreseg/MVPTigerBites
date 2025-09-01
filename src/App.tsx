import React from 'react';
import { useState } from 'react';
import AuthForm from './components/AuthForm';
import RegistrationScreen from './components/RegistrationScreen';
import OnboardingScreen2 from './components/OnboardingScreen2';
import OnboardingScreen3 from './components/OnboardingScreen3';
import StarryBackground from './components/StarryBackground';
import tigerImage from './assets/tiger.png';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'registration-form' | 'onboarding2' | 'onboarding3'>('login');

  const handleAuthModeChange = (mode: 'login' | 'register') => {
    if (mode === 'register') {
      setCurrentScreen('register');
    } else {
      setCurrentScreen('login');
    }
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  const handleProceedToRegistration = () => {
    setCurrentScreen('registration-form');
  };

  const handleProceedToOnboarding3 = () => {
    setCurrentScreen('onboarding3');
  };

  const handleProceedToOnboarding2 = () => {
    setCurrentScreen('onboarding2');
  };

  const handleBackFromOnboarding2 = () => {
    setCurrentScreen('register');
  };

  const handleBackFromOnboarding3 = () => {
    setCurrentScreen('onboarding2');
  };

  // Show registration screen when register is selected
  if (currentScreen === 'register') {
    return (
      <RegistrationScreen 
        onBack={handleBackToLogin}
        onProceed={handleProceedToOnboarding2}
      />
    );
  }

  // Show onboarding screen 2
  if (currentScreen === 'onboarding2') {
    return (
      <OnboardingScreen2 
        onBack={handleBackFromOnboarding2}
        onProceed={handleProceedToOnboarding3}
      />
    );
  }

  // Show onboarding screen 3
  if (currentScreen === 'onboarding3') {
    return (
      <OnboardingScreen3 
        onBack={handleBackFromOnboarding3}
        onProceed={handleProceedToRegistration}
      />
    );
  }

  // Show registration form (placeholder for now)
  if (currentScreen === 'registration-form') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <StarryBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-medium text-gray-900 mb-6 text-center">Registration Form</h2>
            <p className="text-gray-600 text-center mb-6">Registration form will be implemented here</p>
            <button
              onClick={handleBackToLogin}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Starry background */}
      <StarryBackground />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center md:justify-end px-4 py-8 md:py-0">
        
        {/* Auth form with overlapping tiger and logo */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-sm lg:max-w-md relative mb-0 md:mb-0">
          {/* TigerBites logo positioned above tiger */}
          <div className="absolute -top-16 sm:-top-20 md:-top-14 lg:-top-16 xl:-top-20 left-1/2 transform -translate-x-1/2 z-50">
            <h1 className="text-white text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-center tracking-wide">
              TigerBites
            </h1>
          </div>
          
          {/* Tiger image with purple glow - positioned to overlap form */}
          <div className="absolute -top-10 sm:-top-8 md:-top-8 lg:-top-10 xl:-top-12 left-1/2 transform -translate-x-1/2 z-30">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-full blur-3xl opacity-40 scale-125"></div>
              <div className="absolute inset-0 bg-purple-400 rounded-full blur-2xl opacity-30 scale-115"></div>
              <div className="absolute inset-0 bg-purple-300 rounded-full blur-xl opacity-20 scale-110"></div>
              <img
                src={tigerImage}
                alt="Tiger"
                className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          
          <AuthForm mode="login" onToggleMode={handleAuthModeChange} />
        </div>
      </div>
    </div>
  );
}

export default App;
