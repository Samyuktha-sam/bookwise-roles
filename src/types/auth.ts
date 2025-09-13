export type UserRole = 'SuperAdmin' | 'Admin' | 'User';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  provider?: 'email' | 'google' | 'microsoft';
  lastLogin?: string;
  active: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}