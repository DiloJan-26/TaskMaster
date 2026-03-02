// Step 24 - create an auth context to manage authentication state and actions in the app
// Step 25 - before step 24 go to lib> create a folder called types > create a file index.ts

import type { User } from "@/types";
import { useState, createContext, useContext } from "react";


interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const login = async (email: string, password: string) => {
        // Implement login logic here
        console.log("Login function called with email:", email, "and password:", password);
    };

    const register = async (name: string, email: string, password: string) => {
        // Implement registration logic here
    };

    const logout = async () => {
        // Implement logout logic here
    };

    const values = {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
