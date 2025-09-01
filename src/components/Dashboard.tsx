import React from 'react';
import { useState, useEffect } from 'react';
import { LogOut, User, MapPin, Heart } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const { user, userProfile, signOut, loading } = useAuthContext();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  console.log('Dashboard render - user:', user?.id, 'userProfile:', userProfile?.full_name, 'loading:', loading);
  console.log('Avatar URL from profile:', userProfile?.avatar_url);

  // Load avatar when userProfile changes
  useEffect(() => {
    if (userProfile?.avatar_url && userProfile.avatar_url.trim() !== '') {
      console.log('Loading avatar for path:', userProfile.avatar_url);
      loadAvatar(userProfile.avatar_url);
    } else {
      console.log('No avatar URL found in profile');
      setAvatarUrl(null);
    }
  }, [userProfile?.avatar_url]);

  const loadAvatar = async (avatarPath: string) => {
    if (!avatarPath || avatarPath.trim() === '') {
      setAvatarUrl(null);
      return;
    }
    
    setLoadingAvatar(true);
    try {
      console.log('Creating signed URL for avatar path:', avatarPath);
      // Generate signed URL for private avatar
      const { data, error } = await supabase.storage
        .from('user-avatars')
        .createSignedUrl(avatarPath, 3600); // 1 hour expiry

      if (error) {
        console.error('Error creating signed URL:', error);
        setAvatarUrl(null);
      } else {
        console.log('Generated signed URL:', data.signedUrl);
        setAvatarUrl(data.signedUrl);
      }
    } catch (error) {
      console.error('Error loading avatar:', error);
      setAvatarUrl(null);
    } finally {
      setLoadingAvatar(false);
    }
  };

  // Show dashboard with available data (fallback if profile not loaded yet)
  const displayName = user?.user_metadata?.display_name || user?.user_metadata?.full_name || userProfile?.full_name || 'Loading...';
  const displayEmail = userProfile?.email || user?.email || '';

  const handleSignOut = async () => {
    console.log('Sign out button clicked');
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Sign out successful');
      }
    } catch (err) {
      console.error('Unexpected sign out error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-serif font-light text-purple-600 tracking-wide">
                TigerBites
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                Welcome, {displayName}!
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                {loadingAvatar ? (
                  <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                ) : avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-purple-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {displayName}
                </h3>
                <p className="text-gray-600">{displayEmail}</p>
              </div>
            </div>
            
            {userProfile?.location_enabled && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Location services enabled</span>
              </div>
            )}
          </div>

          {/* Welcome Card */}
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-8 h-8 text-red-300" />
              <h3 className="text-xl font-semibold">Welcome to TigerBites!</h3>
            </div>
            <p className="text-purple-100">
              You're all set up and ready to explore the best dining options on campus.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="text-gray-900">
                  {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'Today'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-serif font-light text-gray-900 mb-4">
              More Features Coming Soon!
            </h2>
            <p className="text-gray-600 text-lg">
              We're working hard to bring you the best campus dining experience.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}