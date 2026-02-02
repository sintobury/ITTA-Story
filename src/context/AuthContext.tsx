/**
 * [AuthContext.tsx]
 * 사용자 인증 상태(로그인/로그아웃)와 사용자 권한(User/Admin)을 전역에서 관리하는 컨텍스트 파일입니다.
 * 앱 어디서든 useAuth() 훅을 통해 현재 로그인한 유저 정보에 접근할 수 있습니다.
 */
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
