import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

type UserRole = 'admin' | 'shop_owner' | 'employee' | 'customer';

interface User {
  [x: string]: any;
  shop: any;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@covercell.com',
    role: 'admin',
    shop: undefined
  },
  {
    id: '2',
    name: 'Shop Owner',
    email: 'shop@covercell.com',
    role: 'shop_owner',
    shop: undefined
  },
  {
    id: '3',
    name: 'Employee',
    email: 'employee@covercell.com',
    role: 'employee',
    shop: undefined
  },
  {
    id: '4',
    name: 'Customer',
    email: 'customer@example.com',
    role: 'customer',
    shop: undefined
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check mock users
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      toast.success('Login successful!');
      setLoading(false);
      return true;
    }
    
    toast.error('Invalid credentials');
    setLoading(false);
    return false;
  };

  async function register(email: string, _password: string, userData: Partial<User>): Promise<boolean> {
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || 'New User',
      email,
      role: 'customer',
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      state: userData.state,
      zip_code: userData.zip_code,
      shop: undefined
    };

    // Add to mock users
    mockUsers.push(newUser);

    toast.success('Registration successful! You can now sign in.');
    setLoading(false);
    return true;
  }

  const logout = async (): Promise<void> => {
    setUser(null);
    toast.success('Logged out successfully');
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};