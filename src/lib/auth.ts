// Simple local authentication system
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

// Local storage keys
const USERS_KEY = 'tigerbites_users';
const CURRENT_USER_KEY = 'tigerbites_current_user';

// Get users from localStorage
const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Save current user to localStorage
const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Sign up function
export const signUp = async (email: string, password: string, fullName: string): Promise<{ data: { user: User } | null; error: any }> => {
  const users = getUsers();
  
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
  saveUsers(users);
  setCurrentUser(newUser);

  return { data: { user: newUser }, error: null };
};

// Sign in function
export const signIn = async (email: string, password: string): Promise<{ data: { user: User } | null; error: any }> => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return { data: null, error: { message: 'Invalid login credentials' } };
  }

  setCurrentUser(user);
  return { data: { user }, error: null };
};

// Sign out function
export const signOut = async (): Promise<{ error: any }> => {
  setCurrentUser(null);
  return { error: null };
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<{ data: User | null; error: any }> => {
  const users = getUsers();
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
  saveUsers(users);
  setCurrentUser(updatedUser);

  return { data: updatedUser, error: null };
};