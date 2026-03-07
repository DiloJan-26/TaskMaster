// Step 2 - auth-layout.tsx file is created

import { useAuth } from "@/provider/auth-context";
import React from "react";
import { Outlet, Navigate } from "react-router";
import { ThemeProvider } from "@/provider/theme-provider";

const AuthLayout = () => {
  // Step 26 - use the auth context to check if the user is authenticated and redirect to dashboard if they are, otherwise render the outlet for the auth routes
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  // Step 26 ended
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
};

export default AuthLayout;
