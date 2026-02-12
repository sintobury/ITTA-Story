"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import {
    mockBooks,
    mockPages,
    mockComments,
    Comment,
    mockUserLikes,
    getLocalizedBook,
    getLocalizedPage
} from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useBlockedUser } from "@/context/BlockedUserContext";
import Toast from "@/components/Toast";
import Modal from "@/components/Modal";
import { useToast } from "@/hooks/useToast";

import BookReader from "./BookReader";
import BookInfo from "./BookInfo";
import CommentSection from "./CommentSection";
import CopyrightWarning from "./CopyrightWarning";

export default function BookDetailClient({ id }: { id: string }) {
    const { user } = useAuth();
    const { language } = useLanguage();
    const { isBlocked, blockUser } = useBlockedUser();

    const rawBook = mockBooks.find((b) => b.id === id);
    const book = rawBook ? getLocalizedBook(rawBook, language) : null;

    const [isReading, setIsReading] = useState(false);

    // [클라 확인용] 댓글 관리를 위한 로컬 상태
    const [comments, setComments] = useState<Comment[]>([]);

    // [클라 확인용] 좋아요 관리를 위한 로컬 상태
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLikedAnimating, setIsLikedAnimating] = useState(false);

    // 차단 UI 관리를 위한 상태
    const [blockTarget, setBlockTarget] = useState<string | null>(null);
    const [blockReason, setBlockReason] = useState("spam");
    const [blockMemo, setBlockMemo] = useState("");

    // 삭제 UI 관리를 위한 상태
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    // 토스트 알림 상태
    const { toastMessage, isToastExiting, triggerToast } = useToast();

    useEffect(() => {
        setComments(mockComments.filter((c) => c.bookId === id));

        if (rawBook) {
            setLikeCount(rawBook.likes);
            if (user) {
                const userLikedBooks = mockUserLikes[user.id] || [];
                setIsLiked(userLikedBooks.includes(id));
            } else {
                setIsLiked(false);
            }
        }
    }, [id, user, rawBook]);

    if (!book) {
        notFound();
    }

    const rawPages = mockPages[id] || [];
    const pages = rawPages.map(p => getLocalizedPage(p, language));

    const initiateDeleteComment = (commentId: string) => {
        setDeleteTargetId(commentId);
    };

    const confirmDeleteComment = () => {
        if (deleteTargetId) {
            setComments(prev => prev.filter(c => c.id !== deleteTargetId));
            setDeleteTargetId(null);
            triggerToast("댓글이 삭제되었습니다.");
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

    const handleToggleLike = () => {
        if (!user) {
            triggerToast("로그인 후 좋아요를 누를 수 있습니다.");
            return;
        }

        if (isLiked) {
            setIsLikedAnimating(false);
            setLikeCount(prev => prev - 1);
            setIsLiked(false);
        } else {
            setIsLikedAnimating(true);
            setTimeout(() => setIsLikedAnimating(false), 600);

            setLikeCount(prev => prev + 1);
            setIsLiked(true);
        }
    };

    const visibleComments = comments.filter(c => !isBlocked(c.userName));

    return (
        <div className="w-full py-3 animate-fadeIn flex flex-col items-center">
            {isReading ? (
                <BookReader pages={pages} onClose={() => setIsReading(false)} />
            ) : (
                <div className="max-w-[800px] w-full">
                    <BookInfo
                        book={book}
                        isLiked={isLiked}
                        likeCount={likeCount}
                        isLikedAnimating={isLikedAnimating}
                        user={user}
                        onReadClick={() => setIsReading(true)}
                        onLikeClick={handleToggleLike}
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
                        <button onClick={() => setBlockTarget(null)} className="btn btn-secondary">
                            취소
                        </button>
                        <button onClick={handleConfirmBlock} className="btn btn-danger">
                            차단하기
                        </button>
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
                        <button onClick={() => setDeleteTargetId(null)} className="btn btn-secondary">
                            취소
                        </button>
                        <button onClick={confirmDeleteComment} className="btn btn-danger">
                            삭제하기
                        </button>
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
