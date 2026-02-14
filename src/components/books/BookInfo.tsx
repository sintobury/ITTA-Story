"use client";

import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { Book } from "@/lib/mockData";
import Image from "next/image";
import { Button } from "@/components/common/Button";
import { User } from "@/context/AuthContext";

interface BookInfoProps {
    book: Book;
    isLiked: boolean;
    likeCount: number;
    isLikedAnimating: boolean;
    user: User | null;
    onReadClick: () => void;
    onLikeClick: () => void;
    // [New] 언어 선택 Props
    readingLanguage: string;
    onLanguageChange: (lang: string) => void;
}

// 언어 라벨 매핑 (BookForm과 동일하게 맞춤)
const LANGUAGE_LABELS: Record<string, string> = {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
    zh: '中文',
};

export default function BookInfo({
    book,
    isLiked,
    likeCount,
    isLikedAnimating,
    user,
    onReadClick,
    onLikeClick,
    readingLanguage,
    onLanguageChange
}: BookInfoProps) {
    const { t } = useLanguage();

    return (
        <div className="flex gap-6 bg-[var(--card-bg)] p-6 rounded-xl shadow-[var(--card-shadow)] max-[600px]:flex-col max-[600px]:items-center max-[600px]:text-center">
            <div className="flex flex-col h-full justify-between">
                <div className="relative w-[180px] h-auto aspect-[2/3] rounded-lg shadow-md overflow-hidden flex-shrink-0">
                    <Image
                        src={book.coverUrl}
                        alt={book.title}
                        fill
                        className="object-cover"
                        sizes="180px"
                        priority
                    />
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                    <h1 className="text-2xl font-bold mb-1 text-[var(--foreground)]">{book.title}</h1>
                    <p className="text-[var(--secondary)] text-sm mb-3">by {book.author}</p>
                    <p className="text-[var(--foreground)] text-sm leading-relaxed line-clamp-6">{book.description}</p>
                </div>

                <div className="pt-3 border-t border-[var(--border)]">
                    {/* 언어 선택 UI */}
                    {book.availableLanguages && book.availableLanguages.length > 1 && (
                        <div className="mb-3">
                            <label className="block text-xs font-medium text-[var(--secondary)] mb-1.5">
                                언어 선택 (Language)
                            </label>
                            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                                {book.availableLanguages.map((lang) => (
                                    <Button
                                        key={lang}
                                        onClick={() => onLanguageChange(lang)}
                                        size="sm"
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all h-auto border-none ${readingLanguage === lang
                                            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                            }`}
                                    >
                                        {LANGUAGE_LABELS[lang] || lang.toUpperCase()}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 max-[600px]:justify-center">
                        <Button
                            onClick={onReadClick}
                            variant="primary"
                            className="flex-1 max-w-[140px] shadow-md shadow-blue-500/20"
                        >
                            📖 {t.bookDetail.readNow}
                        </Button>
                        <Button
                            onClick={onLikeClick}
                            variant={isLiked ? "danger" : "secondary"}
                            className={`relative transition-transform active:scale-95 overflow-visible ${isLikedAnimating ? 'animate-heartBounce before:content-[\'\'] before:absolute before:top-1/2 before:left-1/2 before:w-full before:h-full before:rounded-full before:z-[-1] before:border-2 before:border-red-400 before:animate-ringExpand after:content-[\'\'] after:absolute after:top-1/2 after:left-1/2 after:w-full after:h-full after:rounded-full after:z-[-1] after:animate-particlesExpand' : ''}`}
                            title={user ? (isLiked ? t.bookDetail.likeTooltip.unlike : t.bookDetail.likeTooltip.like) : t.bookDetail.likeTooltip.loginRequired}
                        >
                            {isLiked ? `❤️ ${t.bookDetail.like}` : `🤍 ${t.bookDetail.like}`} ({likeCount})
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
