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
}

export default function BookInfo({
    book,
    isLiked,
    likeCount,
    isLikedAnimating,
    user,
    onReadClick,
    onLikeClick
}: BookInfoProps) {
    const { t } = useLanguage();

    return (
        <div className="flex gap-8 mb-12 bg-[var(--card-bg)] p-8 rounded-xl shadow-[var(--card-shadow)] max-[600px]:flex-col max-[600px]:items-center max-[600px]:text-center">
            <img src={book.coverUrl} alt={book.title} className="w-[200px] h-[300px] object-cover rounded-lg flex-shrink-0" />
            <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                <p className="text-[var(--secondary)] text-lg mb-6">by {book.author}</p>
                <p className="mb-6">{book.description}</p>

                <div className="flex gap-4 mt-6">
                    <button onClick={onReadClick} className="btn btn-primary">
                        📖 {t.bookDetail.readNow}
                    </button>
                    <button
                        onClick={onLikeClick}
                        className={`btn ${isLiked ? 'btn-danger' : 'btn-secondary'} relative transition-transform active:scale-90 overflow-visible ${isLikedAnimating ? 'animate-heartBounce before:content-[\'\'] before:absolute before:top-1/2 before:left-1/2 before:w-full before:h-full before:rounded-full before:z-[-1] before:border-2 before:border-red-400 before:animate-ringExpand after:content-[\'\'] after:absolute after:top-1/2 after:left-1/2 after:w-full after:h-full after:rounded-full after:z-[-1] after:animate-particlesExpand' : ''}`}
                        title={user ? (isLiked ? "Unlike" : "Like") : "Login to Like"}
                    >
                        {isLiked ? `❤️ ${t.bookDetail.like}` : `🤍 ${t.bookDetail.like}`} ({likeCount})
                    </button>
                </div>
            </div>
        </div>
    );
}
