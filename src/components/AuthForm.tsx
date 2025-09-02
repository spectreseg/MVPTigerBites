import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

interface AuthFormProps {
  mode: 'login';
  onToggleMode: (mode: 'login' | 'register') => void;
}

export default function AuthForm({ onToggleMode }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { signIn } = useAuthContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(''); // Clear error when user starts typing
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password');
        } else {
          setError(error.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full relative overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mt-12 sm:mt-16 md:mt-20">
        <button
          className="flex-1 py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base text-center font-medium transition-all duration-200 text-purple-600 border-b-2 border-purple-600 bg-purple-50"
        >
          Login
        </button>
        <button
          onClick={() => onToggleMode('register')}
          className="flex-1 py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base text-center font-medium transition-all duration-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        >
          Register
        </button>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-6 md:p-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 font-normal">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white font-normal"
            required
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white font-normal"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-500 hover:text-purple-700 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>


        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600 font-normal">Remember me</span>
          </label>
          <button
            type="button"
            className="text-xs sm:text-sm text-purple-600 hover:text-purple-800 transition-colors font-normal"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 sm:py-2.5 md:py-3 px-4 text-sm sm:text-base rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        </form>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-100 rounded-full opacity-20"></div>
    </div>
  );
}