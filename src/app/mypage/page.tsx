"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedBook } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/common/Button";

type Tab = "reading" | "completed" | "liked" | "comments";

export default function MyPage() {
    const { user, loading: authLoading } = useAuth();
    const { language, t } = useLanguage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("reading");

    // 데이터 상태
    /** 초기 데이터 로딩 시 타입 불일치를 유연하게 처리하기 위해 any를 허용합니다. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [readingList, setReadingList] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [completedList, setCompletedList] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [likedList, setLikedList] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [commentList, setCommentList] = useState<any[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    // 비로그인 시 리다이렉트 (Auth 로딩이 끝난 후 체크)
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchMyData = async () => {
            if (!user) return;
            setDataLoading(true);

            try {
                // 1. 읽고 있는 책 (진행 중)
                const { data: readingData } = await supabase
                    .from('reading_progress')
                    .select('*, books(*)')
                    .eq('user_id', user.id)
                    .neq('completed', true)
                    .order('last_read_at', { ascending: false });

                if (readingData) {
                    /** 조인된 데이터의 복잡한 타입 추론을 피하기 위해 any를 사용합니다. */
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const formattedReading = readingData.map((item: any) => ({
                        ...getLocalizedBook(item.books, language),
                        lastPage: item.last_page + 1,
                        lastReadAt: item.last_read_at
                    }));
                    setReadingList(formattedReading);
                }

                // 2. 다 읽은 책 (완독)
                const { data: completedData } = await supabase
                    .from('reading_progress')
                    .select('*, books(*)')
                    .eq('user_id', user.id)
                    .eq('completed', true)
                    .order('last_read_at', { ascending: false });

                if (completedData) {
                    /** 조인된 데이터의 복잡한 타입 추론을 피하기 위해 any를 사용합니다. */
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const formattedCompleted = completedData.map((item: any) => ({
                        ...getLocalizedBook(item.books, language),
                        lastPage: item.last_page + 1,
                        lastReadAt: item.last_read_at
                    }));
                    setCompletedList(formattedCompleted);
                }

                // 3. 좋아요한 책
                const { data: likesData } = await supabase
                    .from('likes')
                    .select('*, books(*)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (likesData) {
                    /** 조인된 데이터의 복잡한 타입 추론을 피하기 위해 any를 사용합니다. */
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const formattedLikes = likesData.map((item: any) => getLocalizedBook(item.books, language));
                    setLikedList(formattedLikes);
                }

                // 4. 내 댓글
                const { data: commentsData } = await supabase
                    .from('comments')
                    .select('*, books(*)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (commentsData) {
                    /** 조인된 데이터의 복잡한 타입 추론을 피하기 위해 any를 사용합니다. */
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const formattedComments = commentsData.map((item: any) => ({
                        id: item.id,
                        bookId: item.book_id,
                        bookTitle: item.books ? getLocalizedBook(item.books, language).title : t.myPage.unknownBook,
                        content: item.content,
                        createdAt: new Date(item.created_at).toLocaleDateString(),
                        translations: item.translations
                    }));
                    setCommentList(formattedComments);
                }

            } catch (error) {
                console.error("Error fetching my page data:", error);
            } finally {
                setDataLoading(false);
            }
        };

        fetchMyData();
    }, [user, language, t]);

    if (!user) return null;

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8 animate-fadeIn">
            <h1 className="text-3xl font-bold mb-8 text-[var(--foreground)]">{t.myPage.title}</h1>

            <div className="flex flex-row gap-4 md:gap-8 items-start">
                {/* 좌측 탭 사이드바 메뉴 */}
                <div className="flex flex-col gap-1 md:gap-2 bg-[var(--card-bg)] p-2 md:p-4 rounded-2xl border border-[var(--border)] shadow-sm shrink-0 w-max">
                    <Button
                        onClick={() => setActiveTab("reading")}
                        variant={activeTab === "reading" ? "primary" : "ghost"}
                        className={`w-full !justify-start px-3 py-2 md:px-5 md:py-3 text-xs md:text-sm font-medium rounded-xl h-auto transition-all ${activeTab === "reading"
                            ? "shadow-md"
                            : "hover:bg-[var(--background)] text-[var(--secondary)]"
                            }`}
                    >
                        {t.myPage.tabs.reading}
                    </Button>
                    <Button
                        onClick={() => setActiveTab("completed")}
                        variant={activeTab === "completed" ? "primary" : "ghost"}
                        className={`w-full !justify-start px-3 py-2 md:px-5 md:py-3 text-xs md:text-sm font-medium rounded-xl h-auto transition-all ${activeTab === "completed"
                            ? "shadow-md"
                            : "hover:bg-[var(--background)] text-[var(--secondary)]"
                            }`}
                    >
                        {t.myPage.tabs.completed}
                    </Button>
                    <Button
                        onClick={() => setActiveTab("liked")}
                        variant={activeTab === "liked" ? "primary" : "ghost"}
                        className={`w-full !justify-start px-3 py-2 md:px-5 md:py-3 text-xs md:text-sm font-medium rounded-xl h-auto transition-all ${activeTab === "liked"
                            ? "shadow-md"
                            : "hover:bg-[var(--background)] text-[var(--secondary)]"
                            }`}
                    >
                        {t.myPage.tabs.liked}
                    </Button>
                    <Button
                        onClick={() => setActiveTab("comments")}
                        variant={activeTab === "comments" ? "primary" : "ghost"}
                        className={`w-full !justify-start px-3 py-2 md:px-5 md:py-3 text-xs md:text-sm font-medium rounded-xl h-auto transition-all ${activeTab === "comments"
                            ? "shadow-md"
                            : "hover:bg-[var(--background)] text-[var(--secondary)]"
                            }`}
                    >
                        {t.myPage.tabs.comments}
                    </Button>
                </div>

                {/* 우측 콘텐츠 */}
                <div className="flex-1 min-h-[400px] max-w-[850px]">
                    {dataLoading ? (
                        <div className="flex justify-center py-20">{t.myPage.loading}</div>
                    ) : (
                        <>
                            {activeTab === "reading" && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
                                    {readingList.length > 0 ? (
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        readingList.map((book: any) => (
                                            <div key={book.id} className="max-w-[450px] lg:max-w-none">
                                                <Link href={`/books/${book.id}`} className="bg-[var(--card-bg)] rounded-xl overflow-hidden shadow-[var(--card-shadow)] border border-[var(--border)] transition-all duration-300 flex flex-col md:flex-row relative group hover:-translate-y-1 hover:shadow-xl h-auto md:h-[230px] lg:h-[280px]">
                                                    {/* 이미지 영역: 모바일 100%, 데스크탑 2/3 */}
                                                    <div className="w-full md:w-2/3 h-[240px] md:h-full relative bg-[var(--background)] flex-shrink-0 border-b md:border-b-0 md:border-r border-[var(--border)] rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                                                        <Image
                                                            src={book.coverUrl || book.cover_url}
                                                            alt={book.title}
                                                            fill
                                                            className="object-contain group-hover:scale-[1.03] transition-transform duration-300 p-2"
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 50vw"
                                                        />
                                                        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm z-10 shadow-sm border border-white/10">
                                                            {t.myPage.resume} {book.lastPage}{t.myPage.unit}
                                                        </div>
                                                    </div>
                                                    {/* 텍스트 영역: 모바일 100%, 데스크탑 1/3 */}
                                                    <div className="w-full md:w-1/3 p-5 md:p-6 flex flex-col justify-center bg-[var(--card-bg)]">
                                                        <h3 className="font-bold text-xl lg:text-2xl text-[var(--foreground)] line-clamp-3 leading-snug mb-2 group-hover:text-[var(--primary)] transition-colors">{book.title}</h3>
                                                        <p className="text-sm lg:text-base text-[var(--secondary)] truncate font-medium">{book.author}</p>
                                                    </div>
                                                </Link>
                                            </div>
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
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
                                            {completedList.length > 0 ? (
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                completedList.map((book: any) => (
                                                    <div key={book.id} className="max-w-[450px] lg:max-w-none">
                                                        <Link href={`/books/${book.id}`} className="bg-[var(--card-bg)] rounded-xl overflow-hidden shadow-[var(--card-shadow)] border border-[var(--border)] transition-all duration-300 flex flex-col md:flex-row relative group hover:-translate-y-1 hover:shadow-xl h-auto md:h-[230px] lg:h-[280px]">
                                                            {/* 이미지 영역: 모바일 100%, 데스크탑 2/3 */}
                                                            <div className="w-full md:w-2/3 h-[240px] md:h-full relative bg-[var(--background)] flex-shrink-0 border-b md:border-b-0 md:border-r border-[var(--border)] rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                                                                <div className="w-full h-full relative grayscale hover:grayscale-0 transition-all duration-300">
                                                                    <Image
                                                                        src={book.coverUrl || book.cover_url}
                                                                        alt={book.title}
                                                                        fill
                                                                        className="object-contain group-hover:scale-[1.03] transition-transform duration-300 p-2"
                                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 50vw"
                                                                    />
                                                                </div>
                                                                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md z-10">
                                                                    {t.myPage.completedBadge}
                                                                </div>
                                                            </div>
                                                            {/* 텍스트 영역: 모바일 100%, 데스크탑 1/3 */}
                                                            <div className="w-full md:w-1/3 p-5 md:p-6 flex flex-col justify-center bg-[var(--card-bg)]">
                                                                <h3 className="font-bold text-xl lg:text-2xl text-[var(--foreground)] line-clamp-3 leading-snug mb-2 group-hover:text-[var(--primary)] transition-colors">{book.title}</h3>
                                                                <p className="text-sm lg:text-base text-[var(--secondary)] truncate font-medium">{book.author}</p>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                ))
                                                        ) : (
                                                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-[var(--secondary)]">
                                                            <p className="mb-4 text-lg">{t.myPage.noCompleted}</p>
                                                            <Link href="/" className="btn btn-primary">{t.myPage.goBrowse}</Link>
                                                        </div>
                                    )}
                                                    </div>
                                                )}

                                            {activeTab === "liked" && (
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
                                                    {likedList.length > 0 ? (
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        likedList.map((book: any) => (
                                                            <div key={book.id} className="max-w-[450px] lg:max-w-none">
                                                                <Link href={`/books/${book.id}`} className="bg-[var(--card-bg)] rounded-xl overflow-hidden shadow-[var(--card-shadow)] border border-[var(--border)] transition-all duration-300 flex flex-col md:flex-row relative group hover:-translate-y-1 hover:shadow-xl h-auto md:h-[230px] lg:h-[280px]">
                                                                    {/* 이미지 영역: 모바일 100%, 데스크탑 2/3 */}
                                                                    <div className="w-full md:w-2/3 h-[240px] md:h-full relative bg-[var(--background)] flex-shrink-0 border-b md:border-b-0 md:border-r border-[var(--border)] rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                                                                        <Image
                                                                            src={book.coverUrl || book.cover_url}
                                                                            alt={book.title}
                                                                            fill
                                                                            className="object-contain group-hover:scale-[1.03] transition-transform duration-300 p-2"
                                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 50vw"
                                                                        />
                                                                        <div className="absolute top-3 right-3 bg-[var(--card-bg)] text-red-500 text-xs px-2 py-1 rounded-full font-bold shadow-md border border-[var(--border)] z-10">
                                                                            ❤️
                                                                        </div>
                                                                    </div>
                                                                    {/* 텍스트 영역: 모바일 100%, 데스크탑 1/3 */}
                                                                    <div className="w-full md:w-1/3 p-5 md:p-6 flex flex-col justify-center bg-[var(--card-bg)]">
                                                                        <h3 className="font-bold text-xl lg:text-2xl text-[var(--foreground)] line-clamp-3 leading-snug mb-2 group-hover:text-[var(--primary)] transition-colors">{book.title}</h3>
                                                                        <p className="text-sm lg:text-base text-[var(--secondary)] truncate font-medium">{book.author}</p>
                                                                    </div>
                                                                </Link>
                                                            </div>
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
        </div>
                    );
}
