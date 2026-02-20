"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Comment } from "@/types";
import { getLocalizedComment, formatDate } from "@/lib/utils";
import { Button } from "@/components/common/Button";
import { Textarea } from "@/components/common/Textarea";
import { User } from "@/context/AuthContext";

interface CommentSectionProps {
    comments: Comment[];
    user: User | null;
    onDelete: (id: string) => void;
    onBlock: (userId: string, userName: string) => void;
    onPost: (content: string) => void;
}

export default function CommentSection({ comments, user, onDelete, onBlock, onPost }: CommentSectionProps) {
    const { t, language } = useLanguage();
    const router = useRouter();
    const [newComment, setNewComment] = React.useState("");

    const handlePost = () => {
        if (!newComment.trim()) return;
        onPost(newComment);
        setNewComment("");
    };

    return (
        <div>
            <h3 className="mb-6 text-xl font-bold">{t.bookDetail.comments} ({comments.length})</h3>
            <div className="flex flex-col gap-4 mb-8">
                {comments.length > 0 ? (
                    comments.map(comment => {
                        const localizedComment = getLocalizedComment(comment, language);
                        return (
                            <div key={comment.id} className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)]">
                                <div className="flex justify-between mb-2 text-sm">
                                    <strong>{localizedComment.userName}</strong>
                                    <span className="text-[var(--secondary)]">{formatDate(localizedComment.createdAt)}</span>
                                </div>
                                <p>{localizedComment.content}</p>
                                {(user?.role === 'ADMIN' || user?.id === comment.userId) && (
                                    <div className="flex gap-3 mt-3 justify-end">
                                        <Button
                                            onClick={() => onDelete(comment.id)}
                                            size="sm"
                                            className="bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca] border-none"
                                        >
                                            🗑️ 삭제
                                        </Button>
                                        {user?.role === 'ADMIN' && (
                                            <Button
                                                onClick={() => onBlock(comment.userId, comment.userName)}
                                                size="sm"
                                                className="bg-[#ffedd5] text-[#ea580c] hover:bg-[#fed7aa] border-none"
                                            >
                                                🚫 차단
                                            </Button>
                                        )}
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
                    <Textarea
                        placeholder={t.bookDetail.placeholder}
                        className="w-full p-4 font-inherit resize-y"
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button
                        variant="primary"
                        className="self-end"
                        onClick={handlePost}
                        disabled={!newComment.trim()}
                    >
                        {t.bookDetail.postComment}
                    </Button>
                </div>
            ) : (
                <div className="p-6 bg-[var(--background)] border border-[var(--border)] rounded-lg text-center">
                    <p className="text-[var(--secondary)] mb-4">{t.bookDetail.loginToComment}</p>
                    <Button onClick={() => router.push('/login')} variant="secondary">
                        {t.bookDetail.goToLogin}
                    </Button>
                </div>
            )}
        </div>
    );
}
