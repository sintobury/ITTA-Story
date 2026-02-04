/**
 * [BlockedUserContext.tsx]
 * 차단된 사용자 목록을 관리하는 컨텍스트 파일입니다.
 * 관리자(Admin)가 특정 유저를 차단(Block)하거나 해제(Unblock)하는 기능을 제공하며,
 * 차단된 유저는 댓글 작성 등의 활동이 제한될 수 있습니다.
 */
"use client";

import React, { createContext, useContext, useState } from "react";

export interface BlockedUser {
    userId: string; // mockData의 댓글에 고정된 유저 ID가 없기 때문에, 이 프로토타입에서는 userName을 ID로 사용합니다.
    userName: string;
    reason: string;
    memo?: string;
    blockedAt: string;
}

interface BlockedUserContextType {
    blockedUsers: BlockedUser[];
    blockUser: (userName: string, reason: string, memo?: string) => void;
    unblockUser: (userName: string) => void;
    isBlocked: (userName: string) => boolean;
}

const BlockedUserContext = createContext<BlockedUserContextType | undefined>(undefined);

export function BlockedUserProvider({ children }: { children: React.ReactNode }) {
    // [클라 확인용] 차단 유저 목록을 메모리에 임시 저장 (새로고침 시 초기화됨)
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);

    const blockUser = (userName: string, reason: string, memo?: string) => {
        // 중복 방지
        if (blockedUsers.some(u => u.userName === userName)) return;

        const newUser: BlockedUser = {
            userId: userName, // 실제 구현에서는 UUID를 사용해야 합니다.
            userName,
            reason,
            memo,
            blockedAt: new Date().toISOString().split('T')[0] // YYYY-MM-DD 형식
        };

        setBlockedUsers(prev => [...prev, newUser]);
    };

    const unblockUser = (userName: string) => {
        setBlockedUsers(prev => prev.filter(u => u.userName !== userName));
    };

    const isBlocked = (userName: string) => {
        return blockedUsers.some(u => u.userName === userName);
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
