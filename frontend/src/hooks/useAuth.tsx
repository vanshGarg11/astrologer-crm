import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      login: (nextToken: string) => {
        localStorage.setItem('token', nextToken);
        setToken(nextToken);
      },
      logout: () => {
        localStorage.removeItem('token');
        setToken(null);
      },
    }),
    [token],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
