import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import StarryBackground from './StarryBackground';
import tigerImage from '../assets/tiger5.png';

interface OnboardingFinalScreenProps {
  registrationData: {
    fullName: string;
    email: string;
    password: string;
    avatarUrl: string;
    locationEnabled: boolean;
    latitude: number | null;
    longitude: number | null;
  };
  onComplete: () => void;
}

export default function OnboardingFinalScreen({ registrationData, onComplete }: OnboardingFinalScreenProps) {
  const [tigerVisible, setTigerVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');

  const { signUp, updateUserProfile } = useAuthContext();

  useEffect(() => {
    // Start registration process
    handleRegistration();

    // Text fades in first
    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 300);

    // Tiger flies up after text
    const tigerTimer = setTimeout(() => {
      setTigerVisible(true);
    }, 800);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(tigerTimer);
    };
  }, []);

  const handleRegistration = async () => {
    setRegistering(true);
    
    try {
      // Sign up the user
      const { data, error: signUpError } = await signUp(
        registrationData.email,
        registrationData.password,
        registrationData.fullName
      );

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        // Update user profile with additional data
        const profileUpdates: any = {
          avatar_url: registrationData.avatarUrl,
          location_enabled: registrationData.locationEnabled,
        };

        if (registrationData.latitude && registrationData.longitude) {
          profileUpdates.latitude = registrationData.latitude;
          profileUpdates.longitude = registrationData.longitude;
        }

        const { error: updateError } = await updateUserProfile(profileUpdates);
        
        if (updateError) {
          console.error('Error updating profile:', updateError);
          // Don't show error to user as main registration succeeded
        }
      }

      // Auto-redirect after 3 seconds on success
      setTimeout(() => {
        onComplete();
      }, 3000);

    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden md:overflow-y-hidden">
      {/* Starry background */}
      <StarryBackground />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-4 md:py-8">
        
        {/* Thank you message */}
        <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ease-out ${textVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {error ? (
            <div className="text-center">
              <h1 className="text-red-400 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light tracking-wide mb-4">
                Registration Failed
              </h1>
              <p className="text-white text-lg sm:text-xl md:text-2xl font-serif font-light tracking-wide mb-6">
                {error}
              </p>
              <button
                onClick={onComplete}
                className="bg-purple-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-purple-700 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          ) : registering ? (
            <>
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light tracking-wide mb-4">
                Creating your account...
              </h1>
              <p className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light tracking-wide">
                Please wait
              </p>
            </>
          ) : (
            <>
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light tracking-wide mb-4">
                Thanks for registering!
              </h1>
              <p className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light tracking-wide">
                Redirecting to dashboard...
              </p>
            </>
          )}
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