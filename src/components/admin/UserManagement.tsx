"use client";

import { BlockedUser } from "@/context/BlockedUserContext";

interface UserManagementProps {
    blockedUsers: BlockedUser[];
    onUnblock: (userName: string) => void;
}

export default function UserManagement({ blockedUsers, onUnblock }: UserManagementProps) {
    return (
        <section className="bg-[var(--card-bg)] p-8 rounded-xl shadow-[var(--card-shadow)] mt-8 animate-fadeIn" key="users">
            <h2 className="mb-6 border-b border-[var(--border)] pb-4 text-xl font-bold">차단된 유저 목록</h2>
            {blockedUsers.length === 0 ? (
                <p className="p-8 text-center text-[var(--secondary)]">차단된 유저가 없습니다.</p>
            ) : (
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr>
                            <th className="p-4 font-semibold text-[var(--secondary)] border-b border-[var(--border)]">유저</th>
                            <th className="p-4 font-semibold text-[var(--secondary)] border-b border-[var(--border)]">사유</th>
                            <th className="p-4 font-semibold text-[var(--secondary)] border-b border-[var(--border)]">메모</th>
                            <th className="p-4 font-semibold text-[var(--secondary)] border-b border-[var(--border)]">차단 일시</th>
                            <th className="p-4 font-semibold text-[var(--secondary)] border-b border-[var(--border)]">작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blockedUsers.map(user => (
                            <tr key={user.userName}>
                                <td className="p-4 border-b border-[var(--border)]"><strong>{user.userName}</strong></td>
                                <td className="p-4 border-b border-[var(--border)]">
                                    {user.reason === 'spam' && '광고/스팸'}
                                    {user.reason === 'abuse' && '욕설/비방'}
                                    {user.reason === 'other' && '기타'}
                                    {!['spam', 'abuse', 'other'].includes(user.reason) && user.reason}
                                </td>
                                <td className="p-4 border-b border-[var(--border)]">{user.memo || '-'}</td>
                                <td className="p-4 border-b border-[var(--border)]">{user.blockedAt}</td>
                                <td className="p-4 border-b border-[var(--border)]">
                                    <button onClick={() => onUnblock(user.userName)} className="btn btn-secondary">
                                        차단 해제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}
