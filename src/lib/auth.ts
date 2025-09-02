// Simple in-memory authentication system
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  location_enabled: boolean;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

// In-memory storage
let users: User[] = [];
let currentUser: User | null = null;

// Get current user
export const getCurrentUser = (): User | null => {
  return currentUser;
};

// Sign up function
export const signUp = async (email: string, password: string, fullName: string): Promise<{ data: { user: User } | null; error: any }> => {
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return { data: null, error: { message: 'User already exists' } };
  }

  // Create new user
  const newUser: User = {
    id: Math.random().toString(36).substring(2) + Date.now().toString(36),
    email,
    full_name: fullName,
    location_enabled: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  users.push(newUser);
  currentUser = newUser;

  return { data: { user: newUser }, error: null };
};

// Sign in function
export const signIn = async (email: string, password: string): Promise<{ data: { user: User } | null; error: any }> => {
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return { data: null, error: { message: 'Invalid login credentials' } };
  }

  currentUser = user;
  return { data: { user }, error: null };
};

// Sign out function
export const signOut = async (): Promise<{ error: any }> => {
  currentUser = null;
  return { error: null };
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<{ data: User | null; error: any }> => {
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { data: null, error: { message: 'User not found' } };
  }

  const updatedUser = {
    ...users[userIndex],
    ...updates,
    updated_at: new Date().toISOString()
  };

  users[userIndex] = updatedUser;
  currentUser = updatedUser;

  return { data: updatedUser, error: null };
};