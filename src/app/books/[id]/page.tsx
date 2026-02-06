/**
 * [books/[id]/page.tsx]
 * 책 상세 보기 및 읽기 페이지입니다.
 * - 책의 상세 정보(표지, 설명)를 보여줍니다.
 * - 로그인한 유저는 책 내용을 페이지별로 읽을 수 있습니다(페이지네이션).
 * - 좋아요 기능과 댓글 작성/삭제 기능을 제공합니다.
 */
"use client";

import { useState, use, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
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
import Toast from "@/components/Toast";
import Modal from "@/components/Modal";
import { useToast } from "@/hooks/useToast";

export default function BookDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();
    const router = useRouter(); // 로그인 페이지 이동을 위해 추가
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
        // 게스트: 토스트 메시지 출력
        if (!user) {
            triggerToast("로그인 후 좋아요를 누를 수 있습니다.");
            return;
        }

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

    // [제거됨] 로그인 차단 로직 (게스트 읽기 허용)

    return (
        <div className="max-w-[800px] mx-auto py-8 animate-fadeIn">
            {isReading ? (
                <div className="max-w-[1200px] mx-auto min-h-[80vh] flex flex-col items-center justify-center relative pt-12">
                    <button
                        onClick={() => setIsReading(false)}
                        className="absolute top-0 right-0 z-30 bg-white py-2.5 px-5 rounded-full border border-[var(--border)] font-medium cursor-pointer shadow-sm transition-all text-sm text-[var(--foreground)] flex items-center gap-2 hover:bg-[#f8f9fa] hover:-translate-y-0.5 hover:shadow-md hover:text-[var(--primary)] hover:border-[var(--primary)]"
                    >
                        ← 책 덮기
                    </button>

                    <div className="flex items-center justify-center gap-0 my-4 mb-8 perspective-[1500px]">
                        {/* 왼쪽 이동 버튼 */}
                        <button
                            onClick={() => {
                                setDirection('prev');
                                setCurrentPageIndex(p => Math.max(0, p - 2));
                            }}
                            className="bg-white/80 border border-[var(--border)] rounded-full w-[50px] h-[50px] flex items-center justify-center text-2xl cursor-pointer transition-all shadow-md mx-6 text-[var(--primary)] z-20 hover:bg-[var(--primary)] hover:text-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:bg-[#eee]"
                            disabled={currentPageIndex === 0}
                        >
                            ‹
                        </button>

                        {/* 왼쪽 페이지 (짝수) */}
                        <div
                            className={`
                                w-[450px] h-[560px] flex flex-col justify-between origin-center-bottom bg-[#fffbf0] p-12 pb-4 border border-[#f0e6d2] relative transition-transform shadow-md duration-200
                                rounded-l-xl rounded-r-sm shadow-[inset_-15px_0_20px_rgba(0,0,0,0.03),_-5px_5px_15px_rgba(0,0,0,0.1)] border-r-0 origin-right
                                ${direction === 'prev' ? 'animate-flipInLeft' : ''} 
                                ${currentPageIndex > 0 ? 'cursor-pointer hover:-translate-y-[2px] hover:shadow-[inset_0_0_20px_rgba(0,0,0,0.02),_4px_8px_20px_rgba(0,0,0,0.15)]' : ''}
                            `}
                            onClick={() => {
                                if (currentPageIndex > 0) {
                                    setDirection('prev');
                                    setCurrentPageIndex(p => Math.max(0, p - 2));
                                }
                            }}
                        >
                            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center perspective-[1000px] overflow-hidden">
                                {pages[currentPageIndex] ? (
                                    <>
                                        {pages[currentPageIndex].imageUrl && (
                                            <PageImage src={pages[currentPageIndex].imageUrl!} alt="Page illustration" />
                                        )}
                                        <p className="text-xl leading-[1.8] max-w-[600px]">{pages[currentPageIndex].content}</p>
                                    </>
                                ) : (
                                    <div className="flex-1" />
                                )}
                            </div>
                            <div className="w-full flex justify-center text-sm text-[var(--secondary)] pt-4">
                                - {currentPageIndex + 1} -
                            </div>
                        </div>

                        {/* 책등 */}
                        <div className="w-[2px] h-[540px] bg-[#d1d5db] shadow-inner z-10"></div>

                        {/* 오른쪽 페이지 (홀수) */}
                        <div
                            className={`
                                w-[450px] h-[560px] flex flex-col justify-between origin-center-bottom bg-[#fffbf0] p-12 pb-4 border border-[#f0e6d2] relative transition-transform shadow-md duration-200
                                rounded-r-xl rounded-l-sm shadow-[inset_15px_0_20px_rgba(0,0,0,0.03),_5px_5px_15px_rgba(0,0,0,0.1)] border-l-0 origin-left
                                ${direction === 'next' ? 'animate-flipInRight' : ''}
                                ${currentPageIndex < pages.length - 2 ? 'cursor-pointer hover:-translate-y-[2px] hover:shadow-[inset_0_0_20px_rgba(0,0,0,0.02),_4px_8px_20px_rgba(0,0,0,0.15)]' : ''}
                            `}
                            onClick={() => {
                                // 현재 오른쪽 페이지(Index+1)가 있거나, 페이지를 넘길 수 있는 경우
                                if (currentPageIndex < pages.length - (pages.length % 2 === 0 ? 2 : 1)) {
                                    setDirection('next');
                                    setCurrentPageIndex(p => Math.min(pages.length - (pages.length % 2 === 0 ? 2 : 1), p + 2));
                                }
                            }}
                        >
                            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center perspective-[1000px] overflow-hidden">
                                {pages[currentPageIndex + 1] ? (
                                    <>
                                        {pages[currentPageIndex + 1].imageUrl && (
                                            <PageImage src={pages[currentPageIndex + 1].imageUrl!} alt="Page illustration" />
                                        )}
                                        <p className="text-xl leading-[1.8] max-w-[600px]">{pages[currentPageIndex + 1].content}</p>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-[var(--secondary)] italic">
                                        (마지막 페이지입니다)
                                    </div>
                                )}
                            </div>
                            <div className="w-full flex justify-center text-sm text-[var(--secondary)] pt-4">
                                - {currentPageIndex + 2 <= pages.length ? currentPageIndex + 2 : ''} -
                            </div>
                        </div>

                        {/* 오른쪽 이동 버튼 */}
                        <button
                            onClick={() => {
                                setDirection('next');
                                setCurrentPageIndex(p => Math.min(pages.length - (pages.length % 2 === 0 ? 2 : 1), p + 2));
                            }}
                            className="bg-white/80 border border-[var(--border)] rounded-full w-[50px] h-[50px] flex items-center justify-center text-2xl cursor-pointer transition-all shadow-md mx-6 text-[var(--primary)] z-20 hover:bg-[var(--primary)] hover:text-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:bg-[#eee]"
                            disabled={currentPageIndex >= pages.length - 2}
                        >
                            ›
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex gap-8 mb-12 bg-[var(--card-bg)] p-8 rounded-xl shadow-[var(--card-shadow)] max-[600px]:flex-col max-[600px]:items-center max-[600px]:text-center">
                    <img src={book.coverUrl} alt={book.title} className="w-[200px] h-[300px] object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                        <p className="text-[var(--secondary)] text-lg mb-6">by {book.author}</p>
                        <p className="mb-6">{book.description}</p>

                        <div className="flex gap-4 mt-6">
                            <button onClick={() => setIsReading(true)} className="btn btn-primary">
                                📖 {t.bookDetail.readNow}
                            </button>
                            <button
                                onClick={handleToggleLike}
                                className={`btn ${isLiked ? 'btn-danger' : 'btn-secondary'} relative transition-transform active:scale-90 overflow-visible ${isLikedAnimating ? 'animate-heartBounce before:content-[\'\'] before:absolute before:top-1/2 before:left-1/2 before:w-full before:h-full before:rounded-full before:z-[-1] before:border-2 before:border-red-400 before:animate-ringExpand after:content-[\'\'] after:absolute after:top-1/2 after:left-1/2 after:w-full after:h-full after:rounded-full after:z-[-1] after:animate-particlesExpand' : ''}`}
                                title={user ? (isLiked ? "Unlike" : "Like") : "Login to Like"}
                            >
                                {isLiked ? `❤️ ${t.bookDetail.like}` : `🤍 ${t.bookDetail.like}`} ({likeCount})
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-12">
                <h3 className="mb-6 text-xl font-bold">{t.bookDetail.comments} ({visibleComments.length})</h3>
                <div className="flex flex-col gap-4 mb-8">
                    {visibleComments.length > 0 ? (
                        visibleComments.map(comment => {
                            const localizedComment = getLocalizedComment(comment, language);
                            return (
                                <div key={comment.id} className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)]">
                                    <div className="flex justify-between mb-2 text-sm">
                                        <strong>{localizedComment.userName}</strong>
                                        <span className="text-[var(--secondary)]">{localizedComment.createdAt}</span>
                                    </div>
                                    <p>{localizedComment.content}</p>
                                    {user?.role === 'ADMIN' && (
                                        <div className="flex gap-3 mt-3 justify-end">
                                            <button
                                                onClick={() => initiateDeleteComment(comment.id)}
                                                className="px-3 py-1.5 rounded-md border-none text-sm font-semibold cursor-pointer transition-all flex items-center gap-1.5 bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca] hover:-translate-y-px"
                                            >
                                                🗑️ 삭제
                                            </button>
                                            <button
                                                onClick={() => handleInitiateBlock(comment.userName)}
                                                className="px-3 py-1.5 rounded-md border-none text-sm font-semibold cursor-pointer transition-all flex items-center gap-1.5 bg-[#ffedd5] text-[#ea580c] hover:bg-[#fed7aa] hover:-translate-y-px"
                                            >
                                                🚫 차단
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-[var(--secondary)] italic">{t.bookDetail.noComments}</p>
                    )}
                </div>

                {user ? (
                    <div className="flex flex-col gap-4">
                        <textarea
                            placeholder={t.bookDetail.placeholder}
                            className="w-full p-4 border border-[var(--border)] rounded-lg font-inherit resize-y focus:outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_2px_rgba(52,152,219,0.1)] transition-colors"
                            rows={3}
                        />
                        <button className="btn btn-primary self-start">{t.bookDetail.postComment}</button>
                    </div>
                ) : (
                    <div className="p-6 bg-[var(--background)] border border-[var(--border)] rounded-lg text-center">
                        <p className="text-[var(--secondary)] mb-4">로그인하고 댓글을 남겨보세요! ✍️</p>
                        <button onClick={() => router.push('/login')} className="btn btn-secondary">
                            로그인하러 가기
                        </button>
                    </div>
                )}
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

function PageImage({ src, alt }: { src: string; alt: string }) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={`relative w-full min-h-[200px] mb-8 rounded-lg overflow-hidden ${isLoading ? 'bg-[#f3f4f6]' : 'bg-transparent'}`}>
            {isLoading && <div className="absolute top-0 left-0 w-full h-full bg-gray-200 animate-pulse z-10" />}
            <img
                src={src}
                alt={alt}
                className={`block max-w-full max-h-[400px] w-full object-contain rounded-lg transition-opacity duration-700 ${!isLoading ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
}
