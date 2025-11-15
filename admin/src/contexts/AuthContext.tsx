import { ApiClient } from "@/utils/ApiClient";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

interface Props {
  children: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const result = await ApiClient.verifyToken();
        setIsAuthenticated(!!result);
        result && setUser(result);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = (user: User) => {
    setUser(user);
    setIsAuthenticated(true);
  };
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within AuthProvider");

  return context;
};
