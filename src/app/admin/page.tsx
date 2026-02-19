/**
 * [admin/page.tsx]
 * 관리자 대시보드 페이지입니다. (관리자 권한 필요)
 * - 등록된 모든 책을 테이블 형태로 조회, 수정(Edit), 삭제(Delete)할 수 있습니다.
 * - 차단된 유저 목록을 관리(차단 해제)할 수 있습니다.
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useBlockedUser } from "@/context/BlockedUserContext";
import { supabase } from "@/lib/supabase";
import Toast from "@/components/Toast";
import Modal from "@/components/Modal";
import BookManagement from "@/components/admin/BookManagement";
import UserManagement from "@/components/admin/UserManagement";
import UserCreation from "@/components/admin/UserCreation";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/common/Button";

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { language } = useLanguage();
    const { blockedUsers, unblockUser } = useBlockedUser();

    const [activeTab, setActiveTab] = useState<'books' | 'users' | 'create-user'>('books');
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const { toastMessage, isToastExiting, triggerToast } = useToast();
    /** 다양한 필드를 포함하는 책 데이터를 유연하게 처리하기 위해 any를 사용합니다. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [books, setBooks] = useState<any[]>([]);

    // 관리자가 아니면 리다이렉트
    useEffect(() => {
        if (!loading && (!user || user.role !== 'ADMIN')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const fetchBooks = async () => {
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching books:", error);
            triggerToast("책 목록을 불러오는데 실패했습니다.");
        } else {
            // Supabase 데이터를 Book 인터페이스로 변환 (camelCase)
            /** DB 스키마(snake_case)와 프론트엔드 타입(camelCase) 간 변환을 위해 any를 사용합니다. */
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formattedBooks = data.map((b: any) => ({
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
    };

    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            fetchBooks();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleInitiateDelete = (bookId: string) => {
        setDeleteTargetId(bookId);
    };

    const handleConfirmDelete = async () => {
        if (deleteTargetId) {
            // 삭제할 책 정보 찾기 (메시지용)
            const bookToDelete = books.find(b => b.id === deleteTargetId);
            const title = bookToDelete ? bookToDelete.title : '책';

            // 낙관적 UI 업데이트 (Optimistic UI Update)
            setBooks(prev => prev.filter(b => b.id !== deleteTargetId));
            triggerToast(`${title} 삭제 중...`);
            setDeleteTargetId(null);

            const { error } = await supabase.from('books').delete().eq('id', deleteTargetId);

            if (error) {
                console.error("Failed to delete book:", error);
                triggerToast("책 삭제 실패 (DB 오류)");
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
                </div>
                {activeTab === 'books' && (
                    <Button
                        onClick={() => router.push('/admin/upload')}
                        variant="primary"
                        size="sm"
                        className="px-3 py-1.5 font-bold"
                        data-testid="create-book-btn"
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
            ) : (
                <UserCreation />
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
