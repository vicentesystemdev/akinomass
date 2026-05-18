import React, { createContext, useContext, useState } from "react";

export type UserRole = "admin" | "vendedor" | "cliente";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: (AuthUser & { password: string })[] = [
  {
    id: 1,
    name: "Administrador AKINOMASS",
    email: "admin@akinomass.bo",
    password: "admin123",
    role: "admin",
    avatar: "A",
  },
  {
    id: 2,
    name: "Carla Encinas",
    email: "vendedor@akinomass.bo",
    password: "vend123",
    role: "vendedor",
    avatar: "C",
  },
  {
    id: 3,
    name: "María Pérez",
    email: "cliente@akinomass.bo",
    password: "cli123",
    role: "cliente",
    avatar: "M",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string): boolean => {
    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const { password: _pwd, ...userData } = found;
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
