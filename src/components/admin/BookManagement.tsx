"use client";

import Link from "next/link";
import { Book, getLocalizedBook } from "@/lib/mockData";
import { LanguageContextType } from "@/context/LanguageContext";

interface BookManagementProps {
    books: Book[];
    language: LanguageContextType['language'];
    onDeleteClick: (bookId: string) => void;
}

export default function BookManagement({ books, language, onDeleteClick }: BookManagementProps) {
    return (
        <section className="bg-[var(--card-bg)] p-8 rounded-xl shadow-[var(--card-shadow)] mt-8 animate-fadeIn" key="books">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr>
                        <th className="p-4 font-semibold text-[var(--secondary)] border-b border-[var(--border)]">표지</th>
                        <th className="p-4 font-semibold text-[var(--secondary)] border-b border-[var(--border)] min-w-[200px]">제목</th>
                        <th className="p-4 font-semibold text-[var(--secondary)] border-b border-[var(--border)]">저자</th>
                        <th className="p-4 font-semibold text-[var(--secondary)] border-b border-[var(--border)]">작업</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => {
                        const localizedBook = getLocalizedBook(book, language);
                        return (
                            <tr key={book.id}>
                                <td className="p-4 border-b border-[var(--border)]">
                                    <img src={localizedBook.coverUrl} alt="" className="w-10 h-[60px] object-cover rounded shadow-sm" />
                                </td>
                                <td className="p-4 border-b border-[var(--border)] font-medium text-lg">{localizedBook.title}</td>
                                <td className="p-4 border-b border-[var(--border)] text-[var(--secondary)]">{localizedBook.author}</td>
                                <td className="p-4 border-b border-[var(--border)]">
                                    <div className="flex gap-2">
                                        <Link href={`/admin/edit/${book.id}`} className="btn btn-secondary text-sm px-2.5 py-1 no-underline">
                                            수정
                                        </Link>
                                        <button
                                            onClick={() => onDeleteClick(book.id)}
                                            className="btn btn-danger text-sm px-2.5 py-1"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
}
