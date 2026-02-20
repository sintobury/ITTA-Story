"use client";

import { BlockedUser } from "@/context/BlockedUserContext";
import { Button } from "@/components/common/Button";
import { Table, Th, Td } from "@/components/common/Table";
import { USER_MANAGEMENT_HEADERS, BLOCK_REASON_LABELS } from "@/lib/constants";

interface UserManagementProps {
    blockedUsers: BlockedUser[];
    onUnblock: (userId: string) => void;
}

export default function UserManagement({ blockedUsers, onUnblock }: UserManagementProps) {
    return (
        <section className="bg-[var(--card-bg)] p-8 rounded-xl shadow-[var(--card-shadow)] mt-8 animate-fadeIn" key="users">
            <h2 className="mb-6 border-b border-[var(--border)] pb-4 text-xl font-bold">차단된 유저 목록</h2>
            {blockedUsers.length === 0 ? (
                <p className="p-8 text-center text-[var(--secondary)]">차단된 유저가 없습니다.</p>
            ) : (
                <Table>
                    <thead>
                        <tr>
                            {USER_MANAGEMENT_HEADERS.map((header) => (
                                <Th key={header.label} className={header.className}>{header.label}</Th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {blockedUsers.map(user => (
                            <tr key={user.userId}>
                                <Td><strong>{user.userName}</strong></Td>
                                <Td>
                                    {BLOCK_REASON_LABELS[user.reason] || user.reason}
                                </Td>
                                <Td>{user.memo || '-'}</Td>
                                <Td>{user.blockedAt}</Td>
                                <Td>
                                    <Button
                                        onClick={() => onUnblock(user.userId)}
                                        variant="secondary"
                                        size="sm"
                                    >
                                        차단 해제
                                    </Button>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </section>
    );
}
