import React, { useEffect, useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import StarryBackground from './StarryBackground';
import tigerImage from '../assets/tiger3.png';

interface OnboardingPasswordScreenProps {
  onBack: () => void;
  onProceed: () => void;
}

export default function OnboardingPasswordScreen({ onBack, onProceed }: OnboardingPasswordScreenProps) {
  const [tigerVisible, setTigerVisible] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const tigerTimer = setTimeout(() => setTigerVisible(true), 300);
    const bubbleTimer = setTimeout(() => setBubbleVisible(true), 800);
    const formTimer = setTimeout(() => setFormVisible(true), 1300);
    const buttonsTimer = setTimeout(() => setButtonsVisible(true), 1800);

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

    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(formData.password);
    const confirmError = formData.password !== formData.confirmPassword ? 'Passwords do not match' : '';
    
    if (passwordError || confirmError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmError
      });
      return;
    }
    
    console.log('Password form submitted:', { passwordSet: true });
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
                  Create a secure<br />
                  password
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
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-purple-500" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 text-base border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white font-normal placeholder-gray-500 ${
                        errors.password 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-purple-500'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-500 hover:text-purple-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
                
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-purple-500" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 text-base border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white font-normal placeholder-gray-500 ${
                        errors.confirmPassword 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-purple-500'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-500 hover:text-purple-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Password requirements */}
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-medium">Password must contain:</p>
                  <ul className="space-y-1 ml-2">
                    <li className={`${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                      • At least 8 characters
                    </li>
                    <li className={`${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                      • One lowercase letter
                    </li>
                    <li className={`${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                      • One uppercase letter
                    </li>
                    <li className={`${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                      • One number
                    </li>
                  </ul>
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