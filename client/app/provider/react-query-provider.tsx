// Step 21 - create a react-query provider
// Step 22 - to wrap the returned outlet of App() at root.tsx with it and provide the query client to the app
// Step 23 - install sonner - npm install sonner

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./auth-context";

export const queryClient = new QueryClient();

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider> {/* Step 24 - wrap the app with auth provider to provide the auth context to the app */ }
        {children}
        <Toaster position="top-center" richColors />
        {/* Step 23 - add the toaster component to show notifications */}
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
