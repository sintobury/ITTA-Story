"use client";

import Link from "next/link";
import { Book, getLocalizedBook } from "@/lib/mockData";
import { LanguageContextType } from "@/context/LanguageContext";
import styles from "@/app/admin/page.module.css";

interface BookManagementProps {
    books: Book[];
    language: LanguageContextType['language'];
    onDeleteClick: (bookId: string) => void;
}

export default function BookManagement({ books, language, onDeleteClick }: BookManagementProps) {
    return (
        <section className={styles.section} key="books">
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>표지</th>
                        <th>제목</th>
                        <th>저자</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => {
                        const localizedBook = getLocalizedBook(book, language);
                        return (
                            <tr key={book.id}>
                                <td><img src={localizedBook.coverUrl} alt="" className={styles.thumb} /></td>
                                <td>{localizedBook.title}</td>
                                <td>{localizedBook.author}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link href={`/admin/edit/${book.id}`} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', textDecoration: 'none' }}>
                                            수정
                                        </Link>
                                        <button
                                            onClick={() => onDeleteClick(book.id)}
                                            className="btn btn-danger"
                                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
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
