import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, UserRole } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithSSO: (provider: 'google' | 'microsoft', idToken: string) => Promise<void>;
  logout: () => void;
  hasRole: (requiredRole: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock data for demo - replace with actual API calls
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'admin@bookms.com',
    role: 'SuperAdmin',
    provider: 'email',
    lastLogin: new Date().toISOString(),
    active: true,
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'manager@bookms.com',
    role: 'Admin',
    provider: 'email',
    lastLogin: new Date().toISOString(),
    active: true,
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'user@bookms.com',
    role: 'User',
    provider: 'email',
    lastLogin: new Date().toISOString(),
    active: true,
  },
];

const roleHierarchy: Record<UserRole, number> = {
  User: 1,
  Admin: 2,
  SuperAdmin: 3,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored auth token on app load
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // In real app, validate token with backend
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      // Mock authentication - replace with actual API call
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user || (credentials.password !== 'password123')) {
        throw new Error('Invalid credentials');
      }

      if (!user.active) {
        throw new Error('Account is deactivated');
      }

      // Mock tokens - replace with actual tokens from backend
      const tokens = {
        accessToken: `mock-jwt-token-${user.id}`,
        refreshToken: `mock-refresh-token-${user.id}`,
      };

      // Store tokens
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('currentUser', JSON.stringify(user));

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const loginWithSSO = async (provider: 'google' | 'microsoft', idToken: string) => {
    try {
      // Mock SSO login - replace with actual API call
      // For demo, create a mock user based on provider
      const mockSSOUser: User = {
        id: `sso-${Date.now()}`,
        name: `${provider} User`,
        email: `user@${provider === 'google' ? 'gmail.com' : 'outlook.com'}`,
        role: 'User',
        provider,
        lastLogin: new Date().toISOString(),
        active: true,
      };

      const tokens = {
        accessToken: `mock-sso-jwt-token-${mockSSOUser.id}`,
        refreshToken: `mock-sso-refresh-token-${mockSSOUser.id}`,
      };

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('currentUser', JSON.stringify(mockSSOUser));

      setAuthState({
        user: mockSSOUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!authState.user) return false;
    return roleHierarchy[authState.user.role] >= roleHierarchy[requiredRole];
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!authState.user) return false;
    return roles.some(role => hasRole(role));
  };

  const value: AuthContextType = {
    ...authState,
    login,
    loginWithSSO,
    logout,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}