"use client";

import styles from "@/app/admin/page.module.css";
import { BlockedUser } from "@/context/BlockedUserContext";

interface UserManagementProps {
    blockedUsers: BlockedUser[];
    onUnblock: (userName: string) => void;
}

export default function UserManagement({ blockedUsers, onUnblock }: UserManagementProps) {
    return (
        <section className={styles.section} key="users">
            <h2>차단된 유저 목록</h2>
            {blockedUsers.length === 0 ? (
                <p className={styles.emptyState}>차단된 유저가 없습니다.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>유저</th>
                            <th>사유</th>
                            <th>메모</th>
                            <th>차단 일시</th>
                            <th>작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blockedUsers.map(user => (
                            <tr key={user.userName}>
                                <td><strong>{user.userName}</strong></td>
                                <td>
                                    {user.reason === 'spam' && '광고/스팸'}
                                    {user.reason === 'abuse' && '욕설/비방'}
                                    {user.reason === 'other' && '기타'}
                                    {!['spam', 'abuse', 'other'].includes(user.reason) && user.reason}
                                </td>
                                <td>{user.memo || '-'}</td>
                                <td>{user.blockedAt}</td>
                                <td>
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
