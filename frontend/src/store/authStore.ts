import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  userId: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: String | null;
  refreshToken: String | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  updateAccessToken: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),
      updateAccessToken: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
        }),
      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'roadpilot-auth-storage', // key name in LocalStorage
    }
  )
);
