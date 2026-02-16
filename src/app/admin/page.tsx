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
import { mockBooks, getLocalizedBook } from "@/lib/seedData";
import { supabase } from "@/lib/supabase";
import Toast from "@/components/Toast";
import Modal from "@/components/Modal";
import BookManagement from "@/components/admin/BookManagement";
import UserManagement from "@/components/admin/UserManagement";
import UserCreation from "@/components/admin/UserCreation";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/common/Button";

export default function AdminPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { language } = useLanguage(); // 컨텐츠 다국어 처리를 위해 언어 설정만 가져옴
    const { blockedUsers, unblockUser } = useBlockedUser();

    const [activeTab, setActiveTab] = useState<'books' | 'users' | 'create-user' | 'system'>('books');
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const { toastMessage, isToastExiting, triggerToast } = useToast();
    const [books, setBooks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            fetchBooks();
        }
    }, [user]);

    const fetchBooks = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching books:", error);
            triggerToast("책 목록을 불러오는데 실패했습니다.");
        } else {
            // Transform Supabase data to Book interface (camelCase)
            const formattedBooks = data.map(b => ({
                id: b.id,
                title: b.title,
                author: b.author,
                description: b.description,
                coverUrl: b.cover_url,
                likes: b.likes_count,
                availableLanguages: b.available_languages,
                translations: b.translations || {},
                createdAt: b.created_at
            }));
            setBooks(formattedBooks);
        }
        setIsLoading(false);
    };

    const handleInitiateDelete = (bookId: string) => {
        setDeleteTargetId(bookId);
    };

    const handleConfirmDelete = async () => {
        if (deleteTargetId) {
            // 삭제할 책 정보 찾기 (메시지용)
            const bookToDelete = books.find(b => b.id === deleteTargetId);
            const title = bookToDelete ? bookToDelete.title : '책';

            // Optimistic UI Update
            setBooks(prev => prev.filter(b => b.id !== deleteTargetId));
            triggerToast(`${title} 삭제 중...`);
            setDeleteTargetId(null);

            const { error } = await supabase.from('books').delete().eq('id', deleteTargetId);

            if (error) {
                console.error("Failed to delete book:", error);
                triggerToast("책 삭제 실패 (DB 오류)");
                // Rollback? or just refresh
                fetchBooks();
            } else {
                triggerToast(`${title}이(가) 삭제되었습니다.`);
            }
        }
    };

    if (!user || user.role !== 'ADMIN') return null;

    return (
        <div className="w-full pb-16">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">관리자 페이지</h1>
            </div>

            <div className="mb-8 border-b border-[var(--border)] flex justify-between items-center gap-4">
                <div className="flex p-1 bg-[var(--card-bg)] rounded-xl border border-[var(--border)]">
                    <Button
                        onClick={() => setActiveTab('books')}
                        variant={activeTab === 'books' ? 'primary' : 'ghost'}
                        className={`px-4 py-2 text-sm rounded-lg h-auto transition-all ${activeTab === 'books'
                            ? 'font-bold shadow-sm'
                            : 'hover:bg-[var(--background)]'
                            }`}
                    >
                        책 관리
                    </Button>
                    <Button
                        onClick={() => setActiveTab('users')}
                        variant={activeTab === 'users' ? 'primary' : 'ghost'}
                        className={`px-4 py-2 text-sm rounded-lg h-auto transition-all ${activeTab === 'users'
                            ? 'font-bold shadow-sm'
                            : 'hover:bg-[var(--background)]'
                            }`}
                    >
                        유저 관리
                    </Button>
                    <Button
                        onClick={() => setActiveTab('create-user')}
                        variant={activeTab === 'create-user' ? 'primary' : 'ghost'}
                        className={`px-4 py-2 text-sm rounded-lg h-auto transition-all ${activeTab === 'create-user'
                            ? 'font-bold shadow-sm'
                            : 'hover:bg-[var(--background)]'
                            }`}
                    >
                        회원 생성
                    </Button>
                    <Button
                        onClick={() => setActiveTab('system')}
                        variant={activeTab === 'system' ? 'primary' : 'ghost'}
                        className={`px-4 py-2 text-sm rounded-lg h-auto transition-all ${activeTab === 'system'
                            ? 'font-bold shadow-sm'
                            : 'hover:bg-[var(--background)]'
                            }`}
                    >
                        시스템
                    </Button>
                </div>
                {activeTab === 'books' && (
                    <Button
                        onClick={() => router.push('/admin/upload')}
                        variant="primary"
                        size="sm"
                        className="px-3 py-1.5 font-bold"
                    >
                        새 책 업로드
                    </Button>
                )}
            </div>

            {activeTab === 'books' ? (
                <BookManagement
                    books={books}
                    language={language}
                    onDeleteClick={handleInitiateDelete}
                />
            ) : activeTab === 'users' ? (
                <UserManagement
                    blockedUsers={blockedUsers}
                    onUnblock={unblockUser}
                />
            ) : activeTab === 'create-user' ? (
                <UserCreation />
            ) : (
                <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                    <h2 className="text-xl font-bold mb-4">데이터 마이그레이션</h2>
                    <p className="mb-4 text-[var(--secondary)]">
                        Mock 데이터(로컬)를 Supabase 데이터베이스로 복사합니다.<br />
                        <b>주의:</b> 이미 데이터가 존재할 경우 중복될 수 있습니다. (현재 중복 체크 로직 없음)
                    </p>
                    <Button
                        onClick={async () => {
                            if (!confirm("경고: 기존 책 데이터가 모두 삭제되고 초기화됩니다.\n정말 진행하시겠습니까?")) return;
                            const { resetDatabase, seedDatabase } = await import('@/lib/seed');

                            triggerToast("데이터베이스 초기화 중...");
                            const resetLogs = await resetDatabase();

                            triggerToast("Mock 데이터 마이그레이션 시작...");
                            const seedLogs = await seedDatabase();

                            alert([...resetLogs, ...seedLogs].join('\n'));
                            triggerToast("초기화 및 마이그레이션 완료!");
                        }}
                        variant="danger"
                    >
                        DB 초기화 및 Mock 데이터 재업로드
                    </Button>
                </div>
            )}

            {/* 책 삭제 확인 모달 */}
            <Modal
                isOpen={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                title="책 삭제 확인"
                footer={
                    <>
                        <Button onClick={() => setDeleteTargetId(null)} variant="secondary">
                            취소
                        </Button>
                        <Button onClick={handleConfirmDelete} variant="danger">
                            삭제하기
                        </Button>
                    </>
                }
            >
                <div>
                    정말로 이 책을 삭제하시겠습니까?<br />
                    <span className="text-sm text-[var(--secondary)]">이 작업은 되돌릴 수 없습니다.</span>
                </div>
            </Modal>

            {/* 토스트 알림 */}
            <Toast message={toastMessage} isExiting={isToastExiting} />
        </div>
    );
}
