import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = !!user;

  // Simulated login function - in real app, this would call an API
  const login = async (email: string, password: string) => {
    // Simulate API call
    const mockUsers: Record<string, User> = {
      'dentist@example.com': {
        id: '1',
        email: 'dentist@example.com',
        name: 'Dr. Smith',
        role: 'practitioner'
      },
      'assistant@example.com': {
        id: '2',
        email: 'assistant@example.com',
        name: 'Jane Doe',
        role: 'assistant'
      }
    };

    if (mockUsers[email] && password === 'password') {
      const user = mockUsers[email];
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}