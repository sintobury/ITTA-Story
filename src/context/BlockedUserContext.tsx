/**
 * [BlockedUserContext.tsx]
 * 차단된 사용자 목록을 관리하는 컨텍스트 파일입니다.
 * 관리자(Admin)가 특정 유저를 차단(Block)하거나 해제(Unblock)하는 기능을 제공하며,
 * 차단된 유저는 댓글 작성 등의 활동이 제한될 수 있습니다.
 */
"use client";

import React, { createContext, useContext, useState } from "react";

export interface BlockedUser {
    userId: string;
    userName: string;
    reason: string;
    memo?: string;
    blockedAt: string;
}

interface BlockedUserContextType {
    blockedUsers: BlockedUser[];
    blockUser: (userId: string, userName: string, reason: string, memo?: string) => void;
    unblockUser: (userId: string) => void;
    isBlocked: (userId: string) => boolean;
}

const BlockedUserContext = createContext<BlockedUserContextType | undefined>(undefined);

export function BlockedUserProvider({ children }: { children: React.ReactNode }) {
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    // Auth Context의 순환 참조를 방지하기 위해 여기서 직접 호출하거나 dynamic import를 사용합니다.

    // 초기 로딩
    React.useEffect(() => {
        const fetchBlockedUsers = async () => {
            const { data: { user } } = await import("@/lib/supabase").then(m => m.supabase.auth.getUser());
            if (!user) return; // 관리자 체크는 RLS가 처리하거나 UI에서 숨김 처리됨.

            const { data } = await import("@/lib/supabase").then(m => m.supabase
                .from('blocked_users')
                .select('*')
            );

            if (data) {
                // DB의 user_id를 기반으로 매핑
                // 현재는 user_id만 저장하고 있으므로, 이름도 user_id로 표시 (추후 users 테이블과 조인하여 개선 가능)
                /** Supabase 쿼리 결과의 타입 추론이 복잡하여 any를 사용합니다. */
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mapped: BlockedUser[] = data.map((b: any) => ({
                    userId: b.user_id,
                    userName: b.user_id,
                    reason: b.reason,
                    memo: b.memo,
                    blockedAt: b.blocked_at?.split('T')[0] || ''
                }));
                setBlockedUsers(mapped);
            }
        };

        fetchBlockedUsers();
    }, []);

    const blockUser = async (userId: string, userName: string, reason: string, memo?: string) => {
        const { supabase } = await import("@/lib/supabase");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 낙관적 업데이트 (Optimistic Update)
        const newUser: BlockedUser = {
            userId,
            userName,
            reason,
            memo,
            blockedAt: new Date().toISOString().split('T')[0]
        };
        setBlockedUsers(prev => [...prev, newUser]);

        // DB Insert
        const { error } = await supabase
            .from('blocked_users')
            .upsert({
                user_id: userId,
                blocked_by: user.id,
                reason,
                memo
            });

        if (error) {
            console.error("Failed to block user:", error);
            // 롤백 (Rollback)
            setBlockedUsers(prev => prev.filter(u => u.userId !== userId));
        }
    };

    const unblockUser = async (userId: string) => {
        // 낙관적 업데이트 (Optimistic Update)
        setBlockedUsers(prev => prev.filter(u => u.userId !== userId));

        const { supabase } = await import("@/lib/supabase");
        const { error } = await supabase
            .from('blocked_users')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error("Failed to unblock user:", error);
        }
    };

    const isBlocked = (userIdOrName: string) => {
        return blockedUsers.some(u => u.userId === userIdOrName || u.userName === userIdOrName);
    };

    return (
        <BlockedUserContext.Provider value={{ blockedUsers, blockUser, unblockUser, isBlocked }}>
            {children}
        </BlockedUserContext.Provider>
    );
}

export function useBlockedUser() {
    const context = useContext(BlockedUserContext);
    if (context === undefined) {
        throw new Error("useBlockedUser must be used within a BlockedUserProvider");
    }
    return context;
}
