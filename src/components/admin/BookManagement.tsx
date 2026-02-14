"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Book, getLocalizedBook } from "@/lib/mockData";
import { LanguageContextType } from "@/context/LanguageContext";
import { Button } from "@/components/common/Button";
import Image from "next/image";

interface BookManagementProps {
    books: Book[];
    language: LanguageContextType['language'];
    onDeleteClick: (bookId: string) => void;
}

export default function BookManagement({ books, language, onDeleteClick }: BookManagementProps) {
    const router = useRouter();
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
                                    <div className="relative w-10 h-[60px]">
                                        <Image
                                            src={localizedBook.coverUrl}
                                            alt=""
                                            fill
                                            className="object-cover rounded shadow-sm"
                                            sizes="40px"
                                        />
                                    </div>
                                </td>
                                <td className="p-4 border-b border-[var(--border)] font-medium text-lg">{localizedBook.title}</td>
                                <td className="p-4 border-b border-[var(--border)] text-[var(--secondary)]">{localizedBook.author}</td>
                                <td className="p-4 border-b border-[var(--border)]">
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => router.push(`/admin/edit/${book.id}`)}
                                            variant="secondary"
                                            size="sm"
                                            className="px-2.5 py-1"
                                        >
                                            수정
                                        </Button>
                                        <Button
                                            onClick={() => onDeleteClick(book.id)}
                                            variant="danger"
                                            size="sm"
                                            className="px-2.5 py-1"
                                        >
                                            삭제
                                        </Button>
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
