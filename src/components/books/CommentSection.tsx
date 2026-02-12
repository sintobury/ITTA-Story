"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Comment, getLocalizedComment } from "@/lib/mockData";

interface CommentSectionProps {
    comments: Comment[];
    user: any;
    onDelete: (commentId: string) => void;
    onBlock: (userName: string) => void;
}

export default function CommentSection({ comments, user, onDelete, onBlock }: CommentSectionProps) {
    const { t, language } = useLanguage();
    const router = useRouter();

    return (
        <div className="mt-12">
            <h3 className="mb-6 text-xl font-bold">{t.bookDetail.comments} ({comments.length})</h3>
            <div className="flex flex-col gap-4 mb-8">
                {comments.length > 0 ? (
                    comments.map(comment => {
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
                                            onClick={() => onDelete(comment.id)}
                                            className="px-3 py-1.5 rounded-md border-none text-sm font-semibold cursor-pointer transition-all flex items-center gap-1.5 bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca] hover:-translate-y-px"
                                        >
                                            🗑️ 삭제
                                        </button>
                                        <button
                                            onClick={() => onBlock(comment.userName)}
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
    );
}
