import { useState, useEffect } from 'react';
import { signIn as authSignIn, signUp as authSignUp, signOut as authSignOut, updateUserProfile as authUpdateUserProfile, getCurrentUser, User } from '../lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for existing user on mount
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setUserProfile(currentUser);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await authSignIn(email, password);
      if (data?.user) {
        setUser(data.user);
        setUserProfile(data.user);
      }
      return { data, error };
    } catch (err) {
      console.error('Sign in error:', err);
      return { data: null, error: err };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await authSignUp(email, password, fullName);
      if (data?.user) {
        setUser(data.user);
        setUserProfile(data.user);
      }
      return { data, error };
    } catch (err) {
      console.error('Sign up error:', err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    console.log('signOut function called');
    try {
      // Clear state immediately
      setUser(null);
      setUserProfile(null);
      
      const { error } = await authSignOut();
      console.log('Auth signOut result:', { error });
      
      console.log('Sign out completed successfully');
      return { error };
    } catch (err) {
      console.error('Sign out error:', err);
      // Still clear state even if there's an error
      setUser(null);
      setUserProfile(null);
      return { error: err };
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { data, error } = await authUpdateUserProfile(user.id, updates);

    if (!error && data) {
      setUser(data);
      setUserProfile(data);
    }

    return { data, error };
  };

  return {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
  };
}