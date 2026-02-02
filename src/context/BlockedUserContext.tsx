/**
 * [BlockedUserContext.tsx]
 * 차단된 사용자 목록을 관리하는 컨텍스트 파일입니다.
 * 관리자(Admin)가 특정 유저를 차단(Block)하거나 해제(Unblock)하는 기능을 제공하며,
 * 차단된 유저는 댓글 작성 등의 활동이 제한될 수 있습니다.
 */
"use client";

import React, { createContext, useContext, useState } from "react";

export interface BlockedUser {
    userId: string; // Using userName as ID for this prototype since comments don't have stable User IDs in mockData yet
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
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);

    const blockUser = (userName: string, reason: string, memo?: string) => {
        // Prevent duplicates
        if (blockedUsers.some(u => u.userName === userName)) return;

        const newUser: BlockedUser = {
            userId: userName, // Ideally this would be a UUID
            userName,
            reason,
            memo,
            blockedAt: new Date().toISOString().split('T')[0] // YYYY-MM-DD
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
