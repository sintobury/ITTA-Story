"use client";

import { useRouter } from "next/navigation";
import { Book } from "@/types";
import { getLocalizedBook } from "@/lib/utils";
import { LanguageContextType } from "@/context/LanguageContext";
import { Button } from "@/components/common/Button";
import { Table, Th, Td } from "@/components/common/Table";
import Image from "next/image";
import { BOOK_MANAGEMENT_HEADERS } from "@/lib/constants";

interface BookManagementProps {
    books: Book[];
    language: LanguageContextType['language'];
    onDeleteClick: (bookId: string) => void;
}

export default function BookManagement({ books, language, onDeleteClick }: BookManagementProps) {
    const router = useRouter();

    return (
        <section className="bg-[var(--card-bg)] p-8 rounded-xl shadow-[var(--card-shadow)] mt-8 animate-fadeIn" key="books">
            <Table>
                <thead>
                    <tr>
                        {BOOK_MANAGEMENT_HEADERS.map((header) => (
                            <Th key={header.label} className={header.className}>{header.label}</Th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => {
                        const localizedBook = getLocalizedBook(book, language);
                        return (
                            <tr key={book.id}>
                                <Td>
                                    <div className="relative w-10 h-[60px]">
                                        <Image
                                            src={localizedBook.coverUrl}
                                            alt=""
                                            fill
                                            className="object-cover rounded shadow-sm"
                                            sizes="40px"
                                        />
                                    </div>
                                </Td>
                                <Td className="font-medium text-lg">{localizedBook.title}</Td>
                                <Td className="text-[var(--secondary)]">{localizedBook.author}</Td>
                                <Td>
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
                                </Td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </section>
    );
}
