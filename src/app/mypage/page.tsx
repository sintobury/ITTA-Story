"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { mockBooks, getLocalizedBook } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/common/Button";

type Tab = "reading" | "completed" | "liked" | "comments";

export default function MyPage() {
    const { user } = useAuth();
    const { language, t } = useLanguage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("reading");

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    if (!user) return null;

    // Data States
    const [readingList, setReadingList] = useState<any[]>([]);
    const [completedList, setCompletedList] = useState<any[]>([]);
    const [likedList, setLikedList] = useState<any[]>([]);
    const [commentList, setCommentList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyData = async () => {
            if (!user) return;
            setLoading(true);

            try {
                // 1. Reading History (In Progress)
                const { data: readingData } = await supabase
                    .from('reading_progress')
                    .select('*, books(*)')
                    .eq('user_id', user.id)
                    .neq('completed', true)
                    .order('last_read_at', { ascending: false });

                if (readingData) {
                    const formattedReading = readingData.map((item: any) => ({
                        ...getLocalizedBook(item.books, language),
                        lastPage: item.last_page + 1,
                        lastReadAt: item.last_read_at
                    }));
                    setReadingList(formattedReading);
                }

                // 2. Completed Books
                const { data: completedData } = await supabase
                    .from('reading_progress')
                    .select('*, books(*)')
                    .eq('user_id', user.id)
                    .eq('completed', true)
                    .order('last_read_at', { ascending: false });

                if (completedData) {
                    const formattedCompleted = completedData.map((item: any) => ({
                        ...getLocalizedBook(item.books, language),
                        lastPage: item.last_page + 1,
                        lastReadAt: item.last_read_at
                    }));
                    setCompletedList(formattedCompleted);
                }

                // 3. Liked Books
                const { data: likesData } = await supabase
                    .from('likes')
                    .select('*, books(*)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (likesData) {
                    const formattedLikes = likesData.map((item: any) => getLocalizedBook(item.books, language));
                    setLikedList(formattedLikes);
                }

                // 4. My Comments
                const { data: commentsData } = await supabase
                    .from('comments')
                    .select('*, books(*)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (commentsData) {
                    const formattedComments = commentsData.map((item: any) => ({
                        id: item.id,
                        bookId: item.book_id,
                        bookTitle: item.books ? getLocalizedBook(item.books, language).title : "Unknown Book",
                        content: item.content,
                        createdAt: new Date(item.created_at).toLocaleDateString(),
                        translations: item.translations
                    }));
                    setCommentList(formattedComments);
                }

            } catch (error) {
                console.error("Error fetching my page data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyData();
    }, [user, language]);

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8 animate-fadeIn">
            <h1 className="text-3xl font-bold mb-8 text-[var(--foreground)]">{t.myPage.title}</h1>

            {/* Tabs (Pill Style) */}
            <div className="flex justify-center mb-8 bg-[var(--card-bg)] p-1.5 rounded-2xl border border-[var(--border)] shadow-sm inline-flex">
                <Button
                    onClick={() => setActiveTab("reading")}
                    variant={activeTab === "reading" ? "primary" : "ghost"}
                    className={`px-5 py-2 text-sm font-medium rounded-xl h-auto transition-all ${activeTab === "reading"
                        ? "shadow-md"
                        : "hover:bg-[var(--background)] text-[var(--secondary)]"
                        }`}
                >
                    {t.myPage.tabs.reading}
                </Button>
                <Button
                    onClick={() => setActiveTab("completed")}
                    variant={activeTab === "completed" ? "primary" : "ghost"}
                    className={`px-5 py-2 text-sm font-medium rounded-xl h-auto transition-all ${activeTab === "completed"
                        ? "shadow-md"
                        : "hover:bg-[var(--background)] text-[var(--secondary)]"
                        }`}
                >
                    {t.myPage.tabs.completed}
                </Button>
                <Button
                    onClick={() => setActiveTab("liked")}
                    variant={activeTab === "liked" ? "primary" : "ghost"}
                    className={`px-5 py-2 text-sm font-medium rounded-xl h-auto transition-all ${activeTab === "liked"
                        ? "shadow-md"
                        : "hover:bg-[var(--background)] text-[var(--secondary)]"
                        }`}
                >
                    {t.myPage.tabs.liked}
                </Button>
                <Button
                    onClick={() => setActiveTab("comments")}
                    variant={activeTab === "comments" ? "primary" : "ghost"}
                    className={`px-5 py-2 text-sm font-medium rounded-xl h-auto transition-all ${activeTab === "comments"
                        ? "shadow-md"
                        : "hover:bg-[var(--background)] text-[var(--secondary)]"
                        }`}
                >
                    {t.myPage.tabs.comments}
                </Button>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center py-20">Loading...</div>
                ) : (
                    <>
                        {activeTab === "reading" && (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-fadeIn">
                                {readingList.length > 0 ? (
                                    readingList.map((book: any) => (
                                        <Link key={book.id} href={`/books/${book.id}`} className="group block">
                                            <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all">
                                                <Image
                                                    src={book.coverUrl || book.cover_url}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                                />
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

                        {activeTab === "completed" && (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-fadeIn">
                                {completedList.length > 0 ? (
                                    completedList.map((book: any) => (
                                        <Link key={book.id} href={`/books/${book.id}`} className="group block">
                                            <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all grayscale hover:grayscale-0">
                                                <Image
                                                    src={book.coverUrl || book.cover_url}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                                />
                                                <div className="absolute top-2 right-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm shadow-sm">
                                                    ✔ 완독
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">{book.title}</h3>
                                            <p className="text-xs text-[var(--secondary)] truncate">{book.author}</p>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-[var(--secondary)]">
                                        <p className="mb-4 text-lg">아직 다 읽은 책이 없습니다.</p>
                                        <Link href="/" className="btn btn-primary">{t.myPage.goBrowse}</Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "liked" && (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-fadeIn">
                                {likedList.length > 0 ? (
                                    likedList.map((book: any) => (
                                        <Link key={book.id} href={`/books/${book.id}`} className="group block">
                                            <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all">
                                                <Image
                                                    src={book.coverUrl || book.cover_url}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                                />
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
                                {commentList.length > 0 ? (
                                    commentList.map((comment) => (
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
                    </>
                )}
            </div>
        </div>
    );
}
