/**
 * [books/[id]/page.tsx]
 * 책 상세 보기 및 읽기 페이지입니다.
 * - 책의 상세 정보(표지, 설명)를 보여줍니다.
 * - 로그인한 유저는 책 내용을 페이지별로 읽을 수 있습니다(페이지네이션).
 * - 좋아요 기능과 댓글 작성/삭제 기능을 제공합니다.
 */
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
import Toast from "@/components/Toast";
import Modal from "@/components/Modal";
import { useToast } from "@/hooks/useToast";

export default function BookDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const { isBlocked, blockUser } = useBlockedUser();

    const rawBook = mockBooks.find((b) => b.id === id);
    const book = rawBook ? getLocalizedBook(rawBook, language) : null;

    const [isReading, setIsReading] = useState(false);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [direction, setDirection] = useState<'next' | 'prev' | null>(null);

    // [클라 확인용] 댓글 관리를 위한 로컬 상태 (서버 연동 시 제거/대체)
    const [comments, setComments] = useState<Comment[]>([]);

    // [클라 확인용] 좋아요 관리를 위한 로컬 상태 (서버 연동 시 제거/대체)
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
        // [클라 확인용] 댓글 데이터 초기화 (Mock Data 사용)
        setComments(mockComments.filter((c) => c.bookId === id));

        // [클라 확인용] 좋아요 상태 초기화 (Mock Data 사용)
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
        if (!user) return;

        if (isLiked) {
            // 좋아요 취소: 애니메이션 없이 상태만 변경 (혹은 진행중인 애니메이션 중단)
            setIsLikedAnimating(false);
            setLikeCount(prev => prev - 1);
            setIsLiked(false);
        } else {
            // 좋아요: 애니메이션 트리거
            setIsLikedAnimating(true);
            setTimeout(() => setIsLikedAnimating(false), 600);

            setLikeCount(prev => prev + 1);
            setIsLiked(true);
        }
    };

    // 차단된 유저의 댓글 필터링
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
                    <button onClick={() => setIsReading(false)} className={styles.closeButton}>
                        ← 책 덮기
                    </button>

                    <div className={styles.bookSpread}>
                        {/* 왼쪽 이동 버튼 */}
                        <button
                            onClick={() => {
                                setDirection('prev');
                                setCurrentPageIndex(p => Math.max(0, p - 2));
                            }}
                            className={styles.navButton}
                            disabled={currentPageIndex === 0}
                        >
                            ‹
                        </button>

                        {/* 왼쪽 페이지 (짝수) */}
                        <div
                            className={`
                                ${styles.pageWrapper} 
                                ${styles.leftPage} 
                                ${direction === 'prev' ? styles.turnPrev : ''} 
                                ${currentPageIndex > 0 ? styles.clickablePage : ''}
                            `}
                            onClick={() => {
                                if (currentPageIndex > 0) {
                                    setDirection('prev');
                                    setCurrentPageIndex(p => Math.max(0, p - 2));
                                }
                            }}
                        >
                            <div className={styles.pageContent}>
                                {pages[currentPageIndex] ? (
                                    <>
                                        {pages[currentPageIndex].imageUrl && (
                                            <PageImage src={pages[currentPageIndex].imageUrl!} alt="Page illustration" />
                                        )}
                                        <p className={styles.text}>{pages[currentPageIndex].content}</p>
                                    </>
                                ) : (
                                    <div className={styles.emptyMessage} style={{ flex: 1 }} />
                                )}
                            </div>
                            <div className={styles.pageFooter}>
                                - {currentPageIndex + 1} -
                            </div>
                        </div>

                        {/* 책등 */}
                        <div className={styles.spine}></div>

                        {/* 오른쪽 페이지 (홀수) */}
                        <div
                            className={`
                                ${styles.pageWrapper} 
                                ${styles.rightPage} 
                                ${direction === 'next' ? styles.turnNext : ''}
                                ${currentPageIndex < pages.length - 2 ? styles.clickablePage : ''}
                            `}
                            onClick={() => {
                                // 현재 오른쪽 페이지(Index+1)가 있거나, 페이지를 넘길 수 있는 경우
                                if (currentPageIndex < pages.length - (pages.length % 2 === 0 ? 2 : 1)) {
                                    setDirection('next');
                                    setCurrentPageIndex(p => Math.min(pages.length - (pages.length % 2 === 0 ? 2 : 1), p + 2));
                                }
                            }}
                        >
                            <div className={styles.pageContent}>
                                {pages[currentPageIndex + 1] ? (
                                    <>
                                        {pages[currentPageIndex + 1].imageUrl && (
                                            <PageImage src={pages[currentPageIndex + 1].imageUrl!} alt="Page illustration" />
                                        )}
                                        <p className={styles.text}>{pages[currentPageIndex + 1].content}</p>
                                    </>
                                ) : (
                                    <div className={styles.emptyMessage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--secondary)' }}>
                                        (마지막 페이지입니다)
                                    </div>
                                )}
                            </div>
                            <div className={styles.pageFooter}>
                                - {currentPageIndex + 2 <= pages.length ? currentPageIndex + 2 : ''} -
                            </div>
                        </div>

                        {/* 오른쪽 이동 버튼 */}
                        <button
                            onClick={() => {
                                setDirection('next');
                                setCurrentPageIndex(p => Math.min(pages.length - (pages.length % 2 === 0 ? 2 : 1), p + 2));
                            }}
                            className={styles.navButton}
                            disabled={currentPageIndex >= pages.length - 2}
                        >
                            ›
                        </button>
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
                                className={`btn ${isLiked ? 'btn-danger' : 'btn-secondary'} ${styles.likeButton} ${isLikedAnimating ? styles.likeBurst : ''}`}
                                title={isLiked ? "Unlike" : "Like"}
                            >
                                {isLiked ? `❤️ ${t.bookDetail.like}` : `🤍 ${t.bookDetail.like}`} ({likeCount})
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

            {/* 차단 모달 */}
            <Modal
                isOpen={!!blockTarget}
                onClose={() => setBlockTarget(null)}
                title={
                    <span>
                        유저 차단 <span style={{ color: 'var(--primary)', fontSize: '0.9em' }}>({blockTarget})</span>
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
                    <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>이 작업은 되돌릴 수 없습니다.</span>
                </div>
            </Modal>

            {/* 토스트 알림 */}
            <Toast message={toastMessage} isExiting={isToastExiting} />
        </div>
    );
}

function PageImage({ src, alt }: { src: string; alt: string }) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={styles.imageContainer}>
            {isLoading && <div className={styles.skeleton} />}
            <img
                src={src}
                alt={alt}
                className={`${styles.pageImage} ${!isLoading ? styles.pageImageLoaded : ''}`}
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
}
