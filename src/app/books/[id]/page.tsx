"use client";

import { useState, use, useEffect } from "react";
import { notFound } from "next/navigation";
import {
    mockBooks,
    mockPages,
    mockComments,
    Comment,
    mockUserLikes,
    getLocalizedBook,
    getLocalizedPage,
    getLocalizedComment
} from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useBlockedUser } from "@/context/BlockedUserContext";
import styles from "./page.module.css";

export default function BookDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const { isBlocked, blockUser } = useBlockedUser();

    const rawBook = mockBooks.find((b) => b.id === id);
    const book = rawBook ? getLocalizedBook(rawBook, language) : null;

    const [isReading, setIsReading] = useState(false);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    // Local state for comments
    const [comments, setComments] = useState<Comment[]>([]);

    // Local state for Likes
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    // States for blocking UI
    const [blockTarget, setBlockTarget] = useState<string | null>(null);
    const [blockReason, setBlockReason] = useState("spam");
    const [blockMemo, setBlockMemo] = useState("");

    // States for delete UI
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    useEffect(() => {
        // Initialize comments
        setComments(mockComments.filter((c) => c.bookId === id));

        // Initialize likes
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
            setBlockTarget(null);
        }
    };

    const handleToggleLike = () => {
        if (!user) return;

        if (isLiked) {
            setLikeCount(prev => prev - 1);
            setIsLiked(false);
        } else {
            setLikeCount(prev => prev + 1);
            setIsLiked(true);
        }
    };

    // Filter comments based on blocked status
    const visibleComments = comments.filter(c => !isBlocked(c.userName));

    if (!user) {
        return (
            <div className={styles.container}>
                <div className={styles.lockedState}>
                    <img src={book.coverUrl} alt={book.title} className={styles.lockedCover} />
                    <h1>{book.title}</h1>
                    <p className={styles.author}>by {book.author}</p>
                    <p className={styles.description}>{book.description}</p>

                    <div className={styles.lockMessage}>
                        <p>🔒 {t.bookDetail.locked}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {isReading ? (
                <div className={styles.readerContainer}>
                    <div className={styles.readerHeader}>
                        <button onClick={() => setIsReading(false)} className="btn btn-secondary">
                            ← {t.bookDetail.back}
                        </button>
                        <span>{book.title} - Page {currentPageIndex + 1} / {pages.length || 1}</span>
                    </div>

                    <div className={styles.pageContent}>
                        {pages[currentPageIndex] ? (
                            <>
                                {pages[currentPageIndex].imageUrl && (
                                    <img src={pages[currentPageIndex].imageUrl} alt="Page illustration" className={styles.pageImage} />
                                )}
                                <p className={styles.text}>{pages[currentPageIndex].content}</p>
                            </>
                        ) : (
                            <p className={styles.emptyMessage}>No content available for this page.</p>
                        )}
                    </div>

                    <div className={styles.readerControls}>
                        {currentPageIndex > 0 ? (
                            <button
                                onClick={() => setCurrentPageIndex(p => p - 1)}
                                className="btn btn-secondary"
                            >
                                {t.bookDetail.previous}
                            </button>
                        ) : (
                            <div /> /* Spacer */
                        )}

                        {currentPageIndex < pages.length - 1 ? (
                            <button
                                onClick={() => setCurrentPageIndex(p => p + 1)}
                                className="btn btn-primary"
                            >
                                {t.bookDetail.next}
                            </button>
                        ) : (
                            <div /> /* Spacer */
                        )}
                    </div>
                </div>
            ) : (
                <div className={styles.bookHero}>
                    <img src={book.coverUrl} alt={book.title} className={styles.heroCover} />
                    <div className={styles.heroInfo}>
                        <h1>{book.title}</h1>
                        <p className={styles.author}>by {book.author}</p>
                        <p className={styles.description}>{book.description}</p>

                        <div className={styles.heroActions}>
                            <button onClick={() => setIsReading(true)} className="btn btn-primary">
                                📖 {t.bookDetail.readNow}
                            </button>
                            <button
                                onClick={handleToggleLike}
                                className={`btn ${isLiked ? 'btn-danger' : 'btn-secondary'}`}
                                title={isLiked ? "Unlike" : "Like"}
                            >
                                {isLiked ? `❤️ ${t.bookDetail.liked}` : `🤍 ${t.bookDetail.like}`} ({likeCount})
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.commentsSection}>
                <h3>{t.bookDetail.comments} ({visibleComments.length})</h3>
                <div className={styles.commentList}>
                    {visibleComments.length > 0 ? (
                        visibleComments.map(comment => {
                            const localizedComment = getLocalizedComment(comment, language);
                            return (
                                <div key={comment.id} className={styles.comment}>
                                    <div className={styles.commentHeader}>
                                        <strong>{localizedComment.userName}</strong>
                                        <span className={styles.date}>{localizedComment.createdAt}</span>
                                    </div>
                                    <p>{localizedComment.content}</p>
                                    {user.role === 'ADMIN' && (
                                        <div className={styles.adminActions}>
                                            <button
                                                onClick={() => initiateDeleteComment(comment.id)}
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            >
                                                🗑️ 삭제
                                            </button>
                                            <button
                                                onClick={() => handleInitiateBlock(comment.userName)}
                                                className={`${styles.actionBtn} ${styles.blockBtn}`}
                                            >
                                                🚫 차단
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className={styles.noComments}>{t.bookDetail.noComments}</p>
                    )}
                </div>

                <div className={styles.addComment}>
                    <textarea placeholder={t.bookDetail.placeholder} className={styles.textarea} rows={3} />
                    <button className="btn btn-primary">{t.bookDetail.postComment}</button>
                </div>
            </div>

            {/* Block Modal */}
            {blockTarget && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>유저 차단 <span style={{ color: 'var(--primary)', fontSize: '0.9em' }}>({blockTarget})</span></h3>

                        <div className={styles.formGroup}>
                            <label className={styles.inputLabel}>차단 사유</label>
                            <select
                                value={blockReason}
                                onChange={e => setBlockReason(e.target.value)}
                                className={styles.selectInput}
                            >
                                <option value="spam">광고/스팸</option>
                                <option value="abuse">욕설/비방</option>
                                <option value="other">기타</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.inputLabel}>메모 (선택사항)</label>
                            <textarea
                                value={blockMemo}
                                onChange={e => setBlockMemo(e.target.value)}
                                rows={3}
                                className={styles.textAreaInput}
                                placeholder="관리자용 메모를 입력하세요"
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <button onClick={() => setBlockTarget(null)} className="btn btn-secondary">
                                취소
                            </button>
                            <button onClick={handleConfirmBlock} className="btn btn-danger">
                                차단하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteTargetId && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>댓글 삭제</h3>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--foreground)' }}>
                            정말로 이 댓글을 삭제하시겠습니까?<br />
                            <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>이 작업은 되돌릴 수 없습니다.</span>
                        </p>

                        <div className={styles.modalActions}>
                            <button onClick={() => setDeleteTargetId(null)} className="btn btn-secondary">
                                취소
                            </button>
                            <button onClick={confirmDeleteComment} className="btn btn-danger">
                                삭제하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
