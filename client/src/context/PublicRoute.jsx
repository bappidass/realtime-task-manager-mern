// src/components/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user?.token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
