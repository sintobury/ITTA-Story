"use client";

/**
 * [AuthContext.tsx]
 * 사용자 인증 상태(로그인/로그아웃)와 사용자 권한(User/Admin)을 전역에서 관리하는 컨텍스트 파일입니다.
 * 앱 어디서든 useAuth() 훅을 통해 현재 로그인한 유저 정보에 접근할 수 있습니다.
 */

import { createContext, useContext, useState, useEffect } from "react";
import { Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type Role = "GUEST" | "USER" | "ADMIN";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatarUrl?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async (session: Session) => {
            try {
                // public.users 테이블에서 권한 정보 가져오기
                const { data: profile } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                const role = (profile?.role?.toUpperCase() as Role) || "USER";

                setUser({
                    id: session.user.id,
                    name: session.user.email?.split('@')[0] || "User", // 이메일에서 기본 이름 추출
                    email: session.user.email!,
                    role: role,
                });
            } catch (error) {
                console.error("Error fetching user profile:", error);
                // 기본값 설정
                setUser({
                    id: session.user.id,
                    name: session.user.email?.split('@')[0] || "User",
                    email: session.user.email!,
                    role: "USER",
                });
            } finally {
                setLoading(false);
            }
        };

        // 초기 세션 확인
        supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null }, error: AuthError | null }) => {
            if (session) {
                fetchUserProfile(session);
            } else {
                setLoading(false);
            }
        }).catch(() => {
            setLoading(false);
        });

        // 인증 상태 변경 감지
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchUserProfile(session);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        window.location.href = "/"; // 홈으로 강제 이동
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
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
