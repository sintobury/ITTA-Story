"use client";

import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { Book } from "@/types";
import Image from "next/image";
import { Button } from "@/components/common/Button";
import { Label } from "@/components/common/Label";
import { User } from "@/context/AuthContext";

interface BookInfoProps {
    book: Book;
    isLiked: boolean;
    likeCount: number;
    isLikedAnimating: boolean;
    user: User | null;

    onReadStart: () => void;
    onReadResume: () => void;
    initialPage: number;
    totalPages: number;
    onLikeClick: () => void;
    readingLanguage: string;
    onLanguageChange: (lang: string) => void;
}

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
    onReadStart,
    onReadResume,
    initialPage,
    totalPages,
    onLikeClick,
    readingLanguage,
    onLanguageChange
}: BookInfoProps) {
    const { t } = useLanguage();


    return (
        <div className="flex bg-[var(--card-bg)] p-0 md:p-6 rounded-xl shadow-[var(--card-shadow)] flex-col md:flex-row md:gap-6 overflow-hidden">
            {/* 상단/좌측 이미지 영역 */}
            <div className="flex flex-col justify-start w-full md:w-1/2 md:max-w-[400px] flex-shrink-0">
                {/* 모바일: 가로 꽉 차게, 데스크탑: 최대 절반 너비 차지.
                    원본 비율에 맞춰 빈 공간 없이 높이가 자동 조절되도록 width/height 속성과 w-full h-auto 조합을 사용합니다. */}
                <div className="w-full rounded-lg shadow-md overflow-hidden bg-[var(--background)] md:bg-transparent flex justify-center items-start">
                    <Image
                        src={book.coverUrl}
                        alt={book.title}
                        width={600}
                        height={900}
                        className="w-full h-auto object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                </div>
            </div>

            {/* 하단/우측 텍스트 및 버튼 영역 */}
            <div className="flex-1 flex flex-col justify-between py-5 px-5 md:py-1 md:px-0">
                {/* 텍스트 정보 */}
                <div className="mb-4 md:mb-0">
                    <h1 className="text-xl md:text-2xl font-bold mb-1 text-[var(--foreground)]">{book.title}</h1>
                    <p className="text-[var(--secondary)] text-xs md:text-sm mb-3">{t.bookDetail.authorLabel} {book.author}</p>
                    <p className="text-[var(--foreground)] text-sm leading-relaxed line-clamp-6">{book.description}</p>
                </div>

                <div className="pt-4 border-t border-[var(--border)] w-full block">
                    {/* 언어 선택 UI */}
                    {book.availableLanguages && book.availableLanguages.length > 1 && (
                        <div className="mb-4">
                            {/* 라벨과 총 페이지 수는 같은 줄에 (오른쪽 정렬) */}
                            <div className="flex justify-between items-end mb-2 w-full">
                                <Label className="text-xs font-medium text-[var(--secondary)] mb-0">
                                    {t.bookDetail.language}
                                </Label>
                                {totalPages > 0 && (
                                    <span className="text-xs text-[var(--secondary)] ml-auto">
                                        {t.bookDetail.totalPages} {totalPages}p
                                    </span>
                                )}
                            </div>
                            {/* 언어 버튼들은 라벨 바로 아래 좌측 정렬 */}
                            <div className="flex flex-wrap gap-2 justify-start">
                                {book.availableLanguages.map((lang) => (
                                    <Button
                                        key={lang}
                                        onClick={() => onLanguageChange(lang)}
                                        variant={readingLanguage === lang ? 'primary' : 'readable-gray'}
                                        size="sm"
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all h-auto ${readingLanguage === lang ? 'shadow-md' : ''}`}
                                    >
                                        {LANGUAGE_LABELS[lang] || lang.toUpperCase()}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 액션 버튼 (읽기, 좋아요) - 좌측 정렬 유지 */}
                    <div className="flex gap-3 justify-start flex-wrap mt-2">
                        {initialPage > 0 ? (
                            <>
                                <Button
                                    onClick={onReadStart}
                                    variant="secondary"
                                    className="flex-1 min-w-[120px] max-w-[160px] shadow-sm text-sm"
                                >
                                    {t.bookDetail.readFromStart}
                                </Button>
                                <Button
                                    onClick={onReadResume}
                                    variant="primary"
                                    className="flex-1 min-w-[120px] max-w-[180px] shadow-md shadow-blue-500/20 text-sm"
                                >
                                    {`${t.bookDetail.resumePage} ${initialPage + 1}p`}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={onReadStart}
                                variant="primary"
                                className="flex-1 min-w-[120px] max-w-[160px] shadow-md shadow-blue-500/20 text-sm"
                            >
                                📖 {t.bookDetail.readNow}
                            </Button>
                        )}

                        <Button
                            onClick={onLikeClick}
                            variant={isLiked ? "danger" : "secondary"}
                            className={`relative min-w-[90px] text-sm transition-transform active:scale-95 overflow-visible ${isLikedAnimating ? 'animate-heartBounce before:content-[\'\'] before:absolute before:top-1/2 before:left-1/2 before:w-full before:h-full before:rounded-full before:z-[-1] before:border-2 before:border-red-400 before:animate-ringExpand after:content-[\'\'] after:absolute after:top-1/2 after:left-1/2 after:w-full after:h-full after:rounded-full after:z-[-1] after:animate-particlesExpand' : ''}`}
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

