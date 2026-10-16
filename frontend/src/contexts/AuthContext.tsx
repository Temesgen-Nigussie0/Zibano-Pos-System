import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, UserRole, AuthSession } from '../types';
import { users as mockUsers } from '../data/users';
import { delay } from '../utils/formatters';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'zibano_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const session: AuthSession = JSON.parse(stored);
        if (session.expiresAt > Date.now()) {
          setUser(session.user);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate network delay
    await delay(800 + Math.random() * 400);

    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      return { success: false, error: 'Incorrect email or password. Please try again.' };
    }

    const userObj: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    };

    const session: AuthSession = {
      user: userObj,
      token: `mock-token-${Date.now()}`,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(userObj);

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        role: user?.role || null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
