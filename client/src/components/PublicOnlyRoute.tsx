import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
}

const PublicOnlyRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
};

export default PublicOnlyRoute;
