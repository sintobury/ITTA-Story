"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { mockBooks, mockReadingHistory, mockUserLikes, mockComments, getLocalizedBook } from "@/lib/mockData";
import Link from "next/link";
import { Button } from "@/components/common/Button";

type Tab = "reading" | "liked" | "comments";

export default function MyPage() {
    const { user } = useAuth();
    const { language, t } = useLanguage(); // t needs myPage related translations, but I'll use hardcoded for now or add them
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("reading");

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    if (!user) return null;

    // 1. Reading List
    const readingHistory = mockReadingHistory[user.id] || [];
    const readingBooks = readingHistory.map(history => {
        const book = mockBooks.find(b => b.id === history.bookId);
        return book ? { ...getLocalizedBook(book, language), ...history } : null;
    }).filter(Boolean);

    // 2. Liked Books
    const likedBookIds = mockUserLikes[user.id] || [];
    const likedBooks = likedBookIds.map(id => {
        const book = mockBooks.find(b => b.id === id);
        return book ? getLocalizedBook(book, language) : null;
    }).filter(Boolean);

    // 3. My Comments
    // In a real app, we'd query comments by userId. Here we filter mockComments.
    // Assuming mockComments has userName, but we need userId. 
    // mockComments uses 'userName'. mockUser in AuthContext has 'name'. 
    // Let's assume user.name matches comment.userName for mock purposes.
    const myComments = mockComments.filter(c => c.userName === user.name).map(c => {
        const book = mockBooks.find(b => b.id === c.bookId);
        return {
            ...c,
            bookTitle: book ? getLocalizedBook(book, language).title : "Unknown Book"
        };
    });

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8 animate-fadeIn">
            <h1 className="text-3xl font-bold mb-8 text-[var(--foreground)]">{t.myPage.title}</h1>

            {/* Tabs */}
            <div className="flex border-b border-[var(--border)] mb-8">
                <Button
                    onClick={() => setActiveTab("reading")}
                    variant="ghost"
                    className={`px-6 py-3 font-bold text-sm transition-all border-b-2 rounded-none h-auto hover:bg-transparent ${activeTab === "reading"
                        ? "border-[var(--primary)] text-[var(--primary)]"
                        : "border-transparent text-[var(--secondary)] hover:text-[var(--foreground)]"
                        }`}
                >
                    {t.myPage.tabs.reading}
                </Button>
                <Button
                    onClick={() => setActiveTab("liked")}
                    variant="ghost"
                    className={`px-6 py-3 font-bold text-sm transition-all border-b-2 rounded-none h-auto hover:bg-transparent ${activeTab === "liked"
                        ? "border-[var(--primary)] text-[var(--primary)]"
                        : "border-transparent text-[var(--secondary)] hover:text-[var(--foreground)]"
                        }`}
                >
                    {t.myPage.tabs.liked}
                </Button>
                <Button
                    onClick={() => setActiveTab("comments")}
                    variant="ghost"
                    className={`px-6 py-3 font-bold text-sm transition-all border-b-2 rounded-none h-auto hover:bg-transparent ${activeTab === "comments"
                        ? "border-[var(--primary)] text-[var(--primary)]"
                        : "border-transparent text-[var(--secondary)] hover:text-[var(--foreground)]"
                        }`}
                >
                    {t.myPage.tabs.comments}
                </Button>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === "reading" && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-fadeIn">
                        {readingBooks.length > 0 ? (
                            readingBooks.map((book: any) => (
                                <Link key={book.id} href={`/books/${book.id}`} className="group block">
                                    <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all">
                                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-xs p-2 backdrop-blur-sm">
                                            {t.myPage.resume} {book.lastPage}{t.myPage.unit}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">{book.title}</h3>
                                    <p className="text-xs text-[var(--secondary)] truncate">{book.author}</p>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-[var(--secondary)]">
                                <p className="mb-4 text-lg">{t.myPage.noReading}</p>
                                <Link href="/" className="btn btn-primary">{t.myPage.goBrowse}</Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "liked" && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-fadeIn">
                        {likedBooks.length > 0 ? (
                            likedBooks.map((book: any) => (
                                <Link key={book.id} href={`/books/${book.id}`} className="group block">
                                    <div className="aspect-[2/3] mb-3 overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all">
                                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <h3 className="font-bold text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">{book.title}</h3>
                                    <p className="text-xs text-[var(--secondary)] truncate">{book.author}</p>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-[var(--secondary)]">
                                <p className="mb-4 text-lg">{t.myPage.noLiked}</p>
                                <Link href="/" className="btn btn-primary">{t.myPage.goBrowse}</Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "comments" && (
                    <div className="flex flex-col gap-4 animate-fadeIn">
                        {myComments.length > 0 ? (
                            myComments.map((comment) => (
                                <Link key={comment.id} href={`/books/${comment.bookId}`} className="block bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-[var(--foreground)] text-sm">
                                            📖 {comment.bookTitle}
                                        </h4>
                                        <span className="text-xs text-[var(--secondary)]">{comment.createdAt}</span>
                                    </div>
                                    <p className="text-[var(--foreground)] text-sm line-clamp-2">{comment.content}</p>
                                </Link>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-[var(--secondary)]">
                                <p className="text-lg">{t.myPage.noComments}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
