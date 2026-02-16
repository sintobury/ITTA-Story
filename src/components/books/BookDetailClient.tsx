"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import {
    mockBooks, // Keep for fallback? No, remove.
    mockPages,
    mockComments,
    Comment,
    mockUserLikes,
    getLocalizedBook,
    getLocalizedPage,
    mockReadingHistory,
    Book, // Import Book interface
} from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useBlockedUser } from "@/context/BlockedUserContext";
import Toast from "@/components/Toast";
import Modal from "@/components/Modal";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/common/Button";

import BookReader from "./BookReader";
import BookInfo from "./BookInfo";
import CommentSection from "./CommentSection";
import CopyrightWarning from "./CopyrightWarning";

export default function BookDetailClient({ initialBook }: { initialBook: Book }) {
    const { user } = useAuth();
    const { language } = useLanguage();
    const { isBlocked, blockUser } = useBlockedUser();

    // Use initialBook directly
    const rawBook = initialBook;
    const book = getLocalizedBook(rawBook, language);

    // [New] 읽기 언어 상태 (기본값: 앱 언어가 책에 있으면 앱 언어, 아니면 첫 번째 가용 언어)
    const [readingLanguage, setReadingLanguage] = useState<string>(language);

    useEffect(() => {
        if (rawBook?.availableLanguages) {
            if (rawBook.availableLanguages.includes(language)) {
                setReadingLanguage(language);
            } else if (rawBook.availableLanguages.length > 0) {
                setReadingLanguage(rawBook.availableLanguages[0]);
            }
        }
    }, [language, rawBook]);

    const [isReading, setIsReading] = useState(false);

    // [New] 초기 페이지 상태 및 읽기 기록 저장 로직
    const [initialPage, setInitialPage] = useState(0);

    // Pages State
    const [pages, setPages] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            if (!rawBook) return;

            // 1. Fetch Pages First
            const { data: dbPages } = await supabase
                .from('pages')
                .select('*')
                .eq('book_id', rawBook.id)
                .order('page_number', { ascending: true });

            let currentPages: any[] = [];
            if (dbPages) {
                const formattedPages = dbPages.map(p => ({
                    pageNumber: p.page_number,
                    content: p.content,
                    imageUrl: p.image_url,
                    contentByLang: p.content_by_lang,
                    translations: p.translations
                }));
                currentPages = formattedPages.map(p => getLocalizedPage(p, readingLanguage));
                setPages(currentPages);
            }

            // 2. Fetch User Data (Progress & Likes)
            if (user) {
                // Like Status
                const { data: like } = await supabase
                    .from('likes')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('book_id', rawBook.id)
                    .single();
                setIsLiked(!!like);

                // Reading Progress
                const { data: progress } = await supabase
                    .from('reading_progress')
                    .select('last_page')
                    .eq('user_id', user.id)
                    .eq('book_id', rawBook.id)
                    .single();

                if (progress) {
                    // [Validation] Check if stored page index is valid for current total pages
                    if (currentPages.length > 0 && progress.last_page >= currentPages.length) {
                        console.warn("Stored page index out of bounds (Book edited?), resetting to 0");
                        setInitialPage(0);

                        // Auto-correct DB
                        await supabase
                            .from('reading_progress')
                            .update({ last_page: 0, completed: false })
                            .eq('user_id', user.id)
                            .eq('book_id', rawBook.id);

                        triggerToast("책 내용이 변경되어 첫 페이지부터 시작합니다.");
                    } else {
                        setInitialPage(progress.last_page);
                    }
                }
            }
        };

        loadData();
    }, [user, rawBook, readingLanguage]);

    const handlePageChange = async (pageIndex: number) => {
        // Update local state immediately so UI reflects progress when reader closes
        setInitialPage(pageIndex);

        if (user && rawBook) {
            const { error } = await supabase
                .from('reading_progress')
                .upsert({
                    user_id: user.id,
                    book_id: rawBook.id,
                    last_page: pageIndex, // 0-based index for DB
                    last_read_at: new Date().toISOString(),
                    completed: pageIndex === pages.length - 1 // Mark as completed if last page
                });

            if (error) console.error("Error saving reading progress:", error);
        }
    };

    // [클라 확인용] 댓글 관리를 위한 로컬 상태
    const [comments, setComments] = useState<Comment[]>([]);

    // [클라 확인용] 좋아요 관리를 위한 로컬 상태
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0); // Initialize from props?
    const [isLikedAnimating, setIsLikedAnimating] = useState(false);

    // 차단 UI 관리를 위한 상태
    const [blockTarget, setBlockTarget] = useState<string | null>(null);
    const [blockReason, setBlockReason] = useState("spam");
    const [blockMemo, setBlockMemo] = useState("");

    // 삭제 UI 관리를 위한 상태
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const startFromBeginning = () => {
        setInitialPage(0);
        setIsReading(true);
    };

    const resumeReading = () => {
        setIsReading(true);
    };

    // 토스트 알림 상태
    const { toastMessage, isToastExiting, triggerToast } = useToast();

    useEffect(() => {
        const fetchComments = async () => {
            const { data: dbComments } = await supabase
                .from('comments')
                .select('*')
                .eq('book_id', rawBook.id)
                .order('created_at', { ascending: false });

            if (dbComments) {
                const formattedComments: Comment[] = dbComments.map(c => ({
                    id: c.id,
                    bookId: c.book_id,
                    userName: c.display_name || "User", // need to join users table properly or store display_name
                    content: c.content,
                    createdAt: c.created_at,
                    translations: c.translations
                }));
                setComments(formattedComments);
            }
        };

        if (rawBook) {
            setLikeCount(rawBook.likes);
            fetchComments();
        }
    }, [rawBook.id]); // only re-fetch if book changes

    if (!book) {
        notFound();
    }

    // Legacy mapping removed
    // const rawPages = mockPages[id] || [];
    // const pages = rawPages.map(p => getLocalizedPage(p, readingLanguage));

    const initiateDeleteComment = (commentId: string) => {
        setDeleteTargetId(commentId);
    };

    const confirmDeleteComment = async () => {
        if (deleteTargetId) {
            // Optimistic Update
            setComments(prev => prev.filter(c => c.id !== deleteTargetId));

            // DB Delete
            const { error } = await supabase.from('comments').delete().eq('id', deleteTargetId);

            if (error) {
                console.error("Failed to delete comment:", error);
                triggerToast("댓글 삭제 실패");
                // Rollback? (Skip for now)
            } else {
                triggerToast("댓글이 삭제되었습니다.");
            }
            setDeleteTargetId(null);
        }
    };

    const handleInitiateBlock = (userName: string) => {
        setBlockTarget(userName);
        setBlockReason("spam");
        setBlockMemo("");
    };

    const handleConfirmBlock = () => {
        if (blockTarget) {
            blockUser(blockTarget, blockReason, blockMemo);
            triggerToast(`${blockTarget}님을 차단했습니다.`);
            setBlockTarget(null);
        }
    };

    const handleToggleLike = async () => {
        if (!user) {
            triggerToast("로그인 후 좋아요를 누를 수 있습니다.");
            return;
        }

        if (isLiked) {
            // Unlike
            setIsLikedAnimating(false);
            setLikeCount(prev => Math.max(0, prev - 1));
            setIsLiked(false);

            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('user_id', user.id)
                .eq('book_id', rawBook.id);

            // Also decrease count in books table? 
            // Trigger or Rpc is better, but simple increment works for now
            await supabase.rpc('decrement_likes', { book_id: rawBook.id });

        } else {
            // Like
            setIsLikedAnimating(true);
            setTimeout(() => setIsLikedAnimating(false), 600);

            setLikeCount(prev => prev + 1);
            setIsLiked(true);

            const { error } = await supabase
                .from('likes')
                .insert({ user_id: user.id, book_id: rawBook.id });

            await supabase.rpc('increment_likes', { book_id: rawBook.id });
        }
    };

    const handlePostComment = async (content: string) => {
        if (!user) return;

        // Optimistic UI update (optional, but good for UX)
        // Need to create a temp comment? 
        // Let's just wait for DB for now for simplicity and data integrity (ID generation)

        const { data: newComment, error } = await supabase
            .from('comments')
            .insert({
                book_id: rawBook.id,
                user_id: user.id,
                content: content,
                display_name: user.name || "User" // Should ideally be handle by trigger or user profile link
            })
            .select()
            .single();

        if (error) {
            console.error("Error posting comment:", error);
            triggerToast("댓글 작성 실패");
        } else {
            // Add to local state
            const formattedComment: Comment = {
                id: newComment.id,
                bookId: newComment.book_id,
                userName: newComment.display_name || "User",
                content: newComment.content,
                createdAt: newComment.created_at,
                translations: newComment.translations
            };
            setComments(prev => [formattedComment, ...prev]);
            triggerToast("댓글이 작성되었습니다.");
        }
    };

    const visibleComments = comments.filter(c => !isBlocked(c.userName));

    return (
        <div className="w-full py-3 animate-fadeIn flex flex-col items-center">
            {isReading ? (
                <BookReader
                    pages={pages}
                    onClose={() => setIsReading(false)}
                    onTriggerToast={triggerToast}
                    initialPage={initialPage}
                    onPageChange={handlePageChange}
                />
            ) : (
                <div className="max-w-[800px] w-full">
                    <BookInfo
                        book={book}
                        isLiked={isLiked}
                        likeCount={likeCount}
                        isLikedAnimating={isLikedAnimating}
                        user={user}
                        onReadStart={startFromBeginning}
                        onReadResume={resumeReading}
                        initialPage={initialPage}
                        totalPages={pages.length}
                        onLikeClick={handleToggleLike}
                        // [New] 언어 선택 Props 전달
                        readingLanguage={readingLanguage}
                        onLanguageChange={setReadingLanguage}
                    />
                </div>
            )}

            <div className="max-w-[800px] w-full flex flex-col">
                <CopyrightWarning />

                <CommentSection
                    comments={visibleComments}
                    user={user}
                    onDelete={initiateDeleteComment}
                    onBlock={handleInitiateBlock}
                    onPost={handlePostComment}
                />
            </div>

            {/* 차단 모달 */}
            <Modal
                isOpen={!!blockTarget}
                onClose={() => setBlockTarget(null)}
                title={
                    <span>
                        유저 차단 <span className="text-[var(--primary)] text-sm">({blockTarget})</span>
                    </span>
                }
                footer={
                    <>
                        <Button onClick={() => setBlockTarget(null)} variant="secondary">
                            취소
                        </Button>
                        <Button onClick={handleConfirmBlock} variant="danger">
                            차단하기
                        </Button>
                    </>
                }
            >
                <div>
                    <div className="mb-5">
                        <label className="block mb-2 font-medium text-[var(--secondary)] text-sm">차단 사유</label>
                        <select
                            value={blockReason}
                            onChange={e => setBlockReason(e.target.value)}
                            className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] text-[0.95rem] transition-colors focus:outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_2px_rgba(52,152,219,0.1)]"
                        >
                            <option value="spam">광고/스팸</option>
                            <option value="abuse">욕설/비방</option>
                            <option value="other">기타</option>
                        </select>
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 font-medium text-[var(--secondary)] text-sm">메모 (선택사항)</label>
                        <textarea
                            value={blockMemo}
                            onChange={e => setBlockMemo(e.target.value)}
                            rows={3}
                            className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] text-[0.95rem] transition-colors focus:outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_2px_rgba(52,152,219,0.1)]"
                            placeholder="관리자용 메모를 입력하세요"
                        />
                    </div>
                </div>
            </Modal>

            {/* 삭제 모달 */}
            <Modal
                isOpen={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                title="댓글 삭제"
                footer={
                    <>
                        <Button onClick={() => setDeleteTargetId(null)} variant="secondary">
                            취소
                        </Button>
                        <Button onClick={confirmDeleteComment} variant="danger">
                            삭제하기
                        </Button>
                    </>
                }
            >
                <div>
                    정말로 이 댓글을 삭제하시겠습니까?<br />
                    <span className="text-sm text-[var(--secondary)]">이 작업은 되돌릴 수 없습니다.</span>
                </div>
            </Modal>

            {/* 토스트 알림 */}
            <Toast message={toastMessage} isExiting={isToastExiting} />
        </div>
    );
}
