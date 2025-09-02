import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
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
    // Text fades in first
    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 100);

    // Tiger flies up after text
    const tigerTimer = setTimeout(() => {
      setTigerVisible(true);
    }, 200);

    // Start registration process after animations complete
    const registrationTimer = setTimeout(() => {
      handleRegistration();
    }, 2000); // Wait 2 seconds before starting registration

    return () => {
      clearTimeout(textTimer);
      clearTimeout(tigerTimer);
      clearTimeout(registrationTimer);
    };
  }, []);

  const handleRegistration = async () => {
    
    try {
      setRegistering(true);
      setError('');
      
      // Sign up the user
      const { data, error: signUpError } = await signUp(
        registrationData.email,
        registrationData.password,
        registrationData.fullName
      );

      if (signUpError) {
        console.error('Signup error:', signUpError);
        setError(signUpError.message);
        setRegistering(false);
        return;
      }

      if (data.user) {
        console.log('User created, now creating profile...');
        
        // Update the auth user's display name
        const { error: updateError } = await supabase.auth.updateUser({
          data: { 
            full_name: registrationData.fullName,
            display_name: registrationData.fullName 
          }
        });
        
        if (updateError) {
          console.error('Error updating user metadata:', updateError);
        }
        
        // Create user profile with all data
        const { error: insertError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: registrationData.email,
            full_name: registrationData.fullName,
            avatar_url: registrationData.avatarUrl,
            location_enabled: registrationData.locationEnabled,
            latitude: registrationData.latitude,
            longitude: registrationData.longitude,
          });

        if (insertError) {
          console.error('Error creating user profile:', insertError);
          setError(`Database error: ${insertError.message}`);
          setRegistering(false);
          return;
        }

        console.log('User profile created successfully:', {
          id: data.user.id,
          email: registrationData.email,
          full_name: registrationData.fullName,
          avatar_url: registrationData.avatarUrl,
          location_enabled: registrationData.locationEnabled
        });
        
        setRegistering(false);
        
        // Auto-redirect after 5 seconds on success to allow user to see the message
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        setError('Registration failed - no user data returned');
        setRegistering(false);
      }

    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Starry background */}
      <StarryBackground />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-4 md:py-8">
        
        {/* Thank you message */}
        <div className={`text-center mb-4 md:mb-8 transition-all duration-700 ease-out ${textVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
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
              <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-light tracking-wide mb-2 md:mb-4">
                Creating your account...
              </h1>
              <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-light tracking-wide">
                Please wait
              </p>
            </>
          ) : (
            <>
              <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-light tracking-wide mb-2 md:mb-4">
                Thanks for registering!
              </h1>
              <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-light tracking-wide">
                Redirecting to dashboard...
              </p>
            </>
          )}
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