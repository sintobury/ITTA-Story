/**
 * [admin/page.tsx]
 * 관리자 대시보드 페이지입니다. (관리자 권한 필요)
 * - 등록된 모든 책을 테이블 형태로 조회, 수정(Edit), 삭제(Delete)할 수 있습니다.
 * - 차단된 유저 목록을 관리(차단 해제)할 수 있습니다.
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useBlockedUser } from "@/context/BlockedUserContext";
import { mockBooks, getLocalizedBook } from "@/lib/mockData";
import styles from "./page.module.css";

export default function AdminPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { language } = useLanguage(); // 컨텐츠 다국어 처리를 위해 언어 설정만 가져옴
    const { blockedUsers, unblockUser } = useBlockedUser();

    const [activeTab, setActiveTab] = useState<'books' | 'users'>('books');

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') { router.push('/'); }
    }, [user, router]);

    if (!user || user.role !== 'ADMIN') return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>관리자 페이지</h1>
                {activeTab === 'books' && (
                    <Link href="/admin/upload" className="btn btn-primary">+ 새 책 업로드</Link>
                )}
            </div>

            <div className={styles.tabs}>
                <button onClick={() => setActiveTab('books')} className={activeTab === 'books' ? styles.activeTab : styles.tab}>
                    책 관리
                </button>
                <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? styles.activeTab : styles.tab}>
                    유저 관리
                </button>
            </div>

            {activeTab === 'books' ? (
                <section className={styles.section}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>표지</th>
                                <th>제목</th>
                                <th>저자</th>
                                <th>작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockBooks.map(book => {
                                const localizedBook = getLocalizedBook(book, language);
                                return (
                                    <tr key={book.id}>
                                        <td><img src={localizedBook.coverUrl} alt="" className={styles.thumb} /></td>
                                        <td>{localizedBook.title}</td>
                                        <td>{localizedBook.author}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Link href={`/admin/edit/${book.id}`} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', textDecoration: 'none' }}>
                                                    수정
                                                </Link>
                                                <button className="btn btn-danger" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                                                    삭제
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            ) : (
                <section className={styles.section}>
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
                                            <button onClick={() => unblockUser(user.userName)} className="btn btn-secondary">
                                                차단 해제
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            )}
        </div>
    );
}
