"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "GUEST" | "USER" | "ADMIN";

interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

interface AuthContextType {
    user: User | null;
    loginAsUser: () => void;
    loginAsAdmin: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const loginAsUser = () => {
        setUser({
            id: "u1",
            name: "Normal User",
            email: "user@example.com",
            role: "USER",
        });
    };

    const loginAsAdmin = () => {
        setUser({
            id: "a1",
            name: "Admin User",
            email: "admin@example.com",
            role: "ADMIN",
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginAsUser, loginAsAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
