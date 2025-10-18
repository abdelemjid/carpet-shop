import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { JSX } from "react";

export const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  // if user already logged in → redirect to admin dashboard
  if (isAuthenticated) return <Navigate to="/admin" replace />;

  return children;
};
