"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedBook } from "@/lib/utils";
import { Book } from "@/types";

interface BookGridProps {
    books: Book[];
}

export default function BookGrid({ books }: BookGridProps) {
    const { language } = useLanguage();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-fadeIn">
            {books.map((book) => {
                const localizedBook = getLocalizedBook(book, language);

                return (
                    <Link href={`/books/${book.id}`} key={book.id}
                        /* 가로형 카드 레이아웃 */
                        className="bg-[var(--card-bg)] rounded-xl overflow-hidden shadow-[var(--card-shadow)] transition-all duration-[400ms] cubic-bezier(0.25,0.8,0.25,1) flex flex-row relative no-underline text-inherit group hover:rotate-1 hover:scale-102 hover:shadow-xl hover:z-10 hover:-translate-y-1 h-[280px] [backface-visibility:hidden] [transform:translateZ(0)]"
                    >
                        {/* 이미지 영역 (2/3) */}
                        <div className="w-2/3 h-full overflow-hidden bg-gray-100 relative rounded-l-xl">
                            <Image
                                src={localizedBook.coverUrl}
                                alt={localizedBook.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:contrast-[1.05]"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {/* 좋아요 뱃지 */}
                            {book.likes > 0 && (
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 z-10 backdrop-blur-sm">
                                    <span>❤️</span> {book.likes}
                                </div>
                            )}
                        </div>

                        {/* 정보 영역 (1/3) */}
                        <div className="w-1/3 p-6 flex flex-col justify-center border-l border-[var(--border)] rounded-r-xl">
                            <h2 className="text-[1.5rem] font-bold mb-3 leading-tight overflow-hidden text-ellipsis line-clamp-3 text-[var(--foreground)]">
                                {localizedBook.title}
                            </h2>
                            <p className="text-[0.95rem] text-[var(--secondary)] font-medium">
                                {localizedBook.author}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
