import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PublicRoute = ({
  children,
  redirectTo = "/",
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) => {
  const { user, isLoading } = useAuth();

  // If you use refresh-on-boot, wait until it finishes
//   if (isLoading) {
//     return <div className="flex items-center justify-center h-screen">Loading...</div>;
//   }

  // ✅ Already logged in → block signin/signup pages
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
