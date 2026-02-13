"use client";

import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { Book } from "@/lib/mockData";

interface BookInfoProps {
    book: Book;
    isLiked: boolean;
    likeCount: number;
    isLikedAnimating: boolean;
    user: any;
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
        <div className="flex gap-8 mb-12 bg-[var(--card-bg)] p-8 rounded-xl shadow-[var(--card-shadow)] max-[600px]:flex-col max-[600px]:items-center max-[600px]:text-center">
            <img src={book.coverUrl} alt={book.title} className="w-[200px] h-[300px] object-cover rounded-lg flex-shrink-0 shadow-md" />
            <div className="flex-1 flex flex-col">
                <h1 className="text-3xl font-bold mb-2 text-[var(--foreground)]">{book.title}</h1>
                <p className="text-[var(--secondary)] text-lg mb-6">by {book.author}</p>
                <p className="mb-6 text-[var(--foreground)] leading-relaxed">{book.description}</p>

                <div className="mt-auto pt-6 border-t border-[var(--border)]">
                    {/* 언어 선택 UI */}
                    {book.availableLanguages && book.availableLanguages.length > 1 && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[var(--secondary)] mb-2">
                                언어 선택 (Language)
                            </label>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                {book.availableLanguages.map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => onLanguageChange(lang)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${readingLanguage === lang
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                            }`}
                                    >
                                        {LANGUAGE_LABELS[lang] || lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 max-[600px]:justify-center">
                        <button onClick={onReadClick} className="btn btn-primary flex-1 max-w-[200px] shadow-lg shadow-blue-500/30">
                            📖 {t.bookDetail.readNow}
                        </button>
                        <button
                            onClick={onLikeClick}
                            className={`btn ${isLiked ? 'btn-danger' : 'btn-secondary'} relative transition-transform active:scale-90 overflow-visible ${isLikedAnimating ? 'animate-heartBounce before:content-[\'\'] before:absolute before:top-1/2 before:left-1/2 before:w-full before:h-full before:rounded-full before:z-[-1] before:border-2 before:border-red-400 before:animate-ringExpand after:content-[\'\'] after:absolute after:top-1/2 after:left-1/2 after:w-full after:h-full after:rounded-full after:z-[-1] after:animate-particlesExpand' : ''}`}
                            title={user ? (isLiked ? t.bookDetail.likeTooltip.unlike : t.bookDetail.likeTooltip.like) : t.bookDetail.likeTooltip.loginRequired}
                        >
                            {isLiked ? `❤️ ${t.bookDetail.like}` : `🤍 ${t.bookDetail.like}`} ({likeCount})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
