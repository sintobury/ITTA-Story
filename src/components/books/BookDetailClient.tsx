"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { getLocalizedBook, getLocalizedPage } from "@/lib/utils";
import { Book, Comment } from "@/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useBlockedUser } from "@/context/BlockedUserContext";
import Toast from "@/components/Toast";
import Modal from "@/components/Modal";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/common/Button";
import { Label } from "@/components/common/Label";
import { Textarea } from "@/components/common/Textarea";
import BookReader from "./BookReader";
import BookInfo from "./BookInfo";
import CommentSection from "./CommentSection";
import CopyrightWarning from "./CopyrightWarning";

export default function BookDetailClient({ initialBook }: { initialBook: Book }) {
    const { user } = useAuth();
    const { language, t } = useLanguage();
    const { isBlocked, blockUser } = useBlockedUser();

    // initialBook을 직접 사용
    const rawBook = initialBook;
    const book = getLocalizedBook(rawBook, language);

    // 기본값: 앱 언어가 책에 있으면 앱 언어, 아니면 첫 번째 가용 언어
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

    const [initialPage, setInitialPage] = useState(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [pages, setPages] = useState<any[]>([]);

    const { toastMessage, isToastExiting, triggerToast } = useToast();

    const [comments, setComments] = useState<Comment[]>([]);

    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLikedAnimating, setIsLikedAnimating] = useState(false);

    const [blockTargetId, setBlockTargetId] = useState<string | null>(null);
    const [blockTarget, setBlockTarget] = useState<string | null>(null);
    const [blockReason, setBlockReason] = useState("spam");
    const [blockMemo, setBlockMemo] = useState("");

    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!rawBook) return;

            const { data: dbPages } = await supabase
                .from('pages')
                .select('*')
                .eq('book_id', rawBook.id)
                .order('page_number', { ascending: true });

            /** 페이지 데이터 구조가 동적이거나 복잡하여 임시로 any[]를 사용합니다. */
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let currentPages: any[] = [];
            if (dbPages) {
                /** Supabase 반환 데이터의 타입 매핑을 위해 any를 허용합니다. */
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const formattedPages = dbPages.map((p: any) => ({
                    pageNumber: p.page_number,
                    content: p.content,
                    imageUrl: p.image_url,
                    contentByLang: p.content_by_lang,
                    translations: p.translations
                }));
                currentPages = formattedPages.map(p => getLocalizedPage(p, readingLanguage));
                setPages(currentPages);
            }

            if (user) {
                const { data: like } = await supabase
                    .from('likes')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('book_id', rawBook.id)
                    .single();
                setIsLiked(!!like);

                const { data: progress } = await supabase
                    .from('reading_progress')
                    .select('last_page')
                    .eq('user_id', user.id)
                    .eq('book_id', rawBook.id)
                    .single();

                if (progress) {
                    // 저장된 페이지 인덱스가 현재 총 페이지 수보다 큰지 확인 (책 수정됨?)
                    if (currentPages.length > 0 && progress.last_page >= currentPages.length) {
                        console.warn("저장된 페이지 인덱스 범위를 벗어남 (책이 수정됨?), 0으로 초기화");
                        setInitialPage(0);

                        // DB 자동 보정
                        await supabase
                            .from('reading_progress')
                            .update({ last_page: 0, completed: false })
                            .eq('user_id', user.id)
                            .eq('book_id', rawBook.id);

                        triggerToast(t.bookDetail.progressReset);
                    } else {
                        setInitialPage(progress.last_page);
                    }
                }
            }
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, rawBook, readingLanguage]);

    const handlePageChange = async (pageIndex: number) => {
        // 로컬 상태 즉시 업데이트 (리더가 닫힐 때 진행도 반영)
        setInitialPage(pageIndex);

        if (user && rawBook) {
            const { error } = await supabase
                .from('reading_progress')
                .upsert({
                    user_id: user.id,
                    book_id: rawBook.id,
                    last_page: pageIndex, // DB는 0-based index 사용 (0부터 시작)
                    last_read_at: new Date().toISOString(),
                    completed: pageIndex === pages.length - 1 // 마지막 페이지 도달 시 완료 처리
                });

            if (error) console.error("독서 기록 저장 실패:", error);
        }
    };

    const startFromBeginning = () => {
        setInitialPage(0);
        setIsReading(true);
    };

    const resumeReading = () => {
        setIsReading(true);
    };

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
                    userId: c.user_id, // DB에서 user_id 매핑
                    userName: c.display_name || "User", // users 테이블 조인 또는 display_name 저장 필요
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
    }, [rawBook, rawBook.likes]); // 책이 변경될 때만 다시 가져옴

    if (!book) {
        notFound();
    }

    const initiateDeleteComment = (commentId: string) => {
        setDeleteTargetId(commentId);
    };

    const confirmDeleteComment = async () => {
        if (deleteTargetId) {
            // 낙관적 업데이트 (Optimistic Update)
            setComments(prev => prev.filter(c => c.id !== deleteTargetId));

            // DB 삭제
            const { error } = await supabase.from('comments').delete().eq('id', deleteTargetId);

            if (error) {
                console.error("댓글 삭제 실패:", error);
                triggerToast(t.bookDetail.deleteFail);
                // 롤백 로직 추가 가능
            } else {
                triggerToast(t.bookDetail.deleteSuccess);
            }
            setDeleteTargetId(null);
        }
    };

    const handleInitiateBlock = (userId: string, userName: string) => {
        setBlockTargetId(userId);
        setBlockTarget(userName);
        setBlockReason("spam");
        setBlockMemo("");
    };

    const handleConfirmBlock = () => {
        if (blockTarget && blockTargetId) {
            blockUser(blockTargetId, blockTarget, blockReason, blockMemo);
            triggerToast(`${blockTarget}님을 차단했습니다.`);
            setBlockTarget(null);
            setBlockTargetId(null);
        }
    };

    const handleToggleLike = async () => {
        if (!user) {
            triggerToast(t.bookDetail.likeTooltip.loginRequired);
            return;
        }

        if (isLiked) {
            // 좋아요 취소
            setIsLikedAnimating(false);
            setLikeCount(prev => Math.max(0, prev - 1));
            setIsLiked(false);

            await supabase
                .from('likes')
                .delete()
                .eq('user_id', user.id)
                .eq('book_id', rawBook.id);

            // books 테이블 카운트 감소 (트리거 또는 RPC 권장, 현재는 단순 감소)
            await supabase.rpc('decrement_likes', { book_id: rawBook.id });

        } else {
            // 좋아요
            setIsLikedAnimating(true);
            setTimeout(() => setIsLikedAnimating(false), 600);

            setLikeCount(prev => prev + 1);
            setIsLiked(true);

            await supabase
                .from('likes')
                .insert({ user_id: user.id, book_id: rawBook.id });

            await supabase.rpc('increment_likes', { book_id: rawBook.id });
        }
    };

    const handlePostComment = async (content: string) => {
        if (!user) return;

        // 데이터 무결성(ID 생성)을 위해 지금은 DB 응답 대기
        const { data: newComment, error } = await supabase
            .from('comments')
            .insert({
                book_id: rawBook.id,
                user_id: user.id,
                content: content,
                display_name: user.name || "User" // 트리거 또는 유저 프로필 링크로 처리하는 것이 이상적
            })
            .select()
            .single();

        if (error) {
            console.error("댓글 작성 오류:", error);
            triggerToast(t.bookDetail.postFail);
        } else {
            // 로컬 상태 추가
            const formattedComment: Comment = {
                id: newComment.id,
                bookId: newComment.book_id,
                userId: newComment.user_id,
                userName: newComment.display_name || "User",
                content: newComment.content,
                createdAt: newComment.created_at,
                translations: newComment.translations
            };
            setComments(prev => [formattedComment, ...prev]);
            triggerToast(t.bookDetail.postSuccess);
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
                        // 언어 선택 Props 전달
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
                        <Label className="text-[var(--secondary)] text-sm">차단 사유:</Label>
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
                        <Label className="text-[var(--secondary)] text-sm">메모 (선택사항):</Label>
                        <Textarea
                            value={blockMemo}
                            onChange={e => setBlockMemo(e.target.value)}
                            rows={3}
                            className="text-[0.95rem]"
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
                            삭제
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
