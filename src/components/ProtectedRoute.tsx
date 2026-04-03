import React from "react";
import { Navigate } from "react-router-dom";
import type { ProtectedRouteProps } from "../types/sharedComponents";
import { useAuth } from "../hooks/useAuth";
import Loader from "./Shared/Loader";
import "./ProtectedRoute.scss";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="protected-route-loader">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
