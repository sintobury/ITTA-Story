/**
 * [admin/edit/[id]/page.tsx]
 * 기존 책 정보를 수정하는 페이지입니다. (관리자 전용)
 * - URL 파라미터(id)로 책 정보를 불러와 BookForm에 전달합니다.
 * - 내용을 수정한 뒤 저장할 수 있습니다.
 */
"use client";

import { use, useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import BookForm from "@/components/BookForm";
import { mockBooks, mockPages, Book, Page } from "@/lib/mockData";
import styles from "@/app/admin/upload/page.module.css";

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();
    const router = useRouter();

    const [book, setBook] = useState<Book | null>(null);
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Find book
        const foundBook = mockBooks.find(b => b.id === id);
        if (foundBook) {
            setBook(foundBook);
            setPages(mockPages[id] || []);
        }
        setLoading(false);
    }, [id]);

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            // Let the main admin page handle redirect or just redirect here
            // But for now, just waiting for user loading
        }
    }, [user, router]);


    if (!user || user.role !== 'ADMIN') {
        // Wait for auth check usually, but for mock just show nothing or denied
        return null;
    }

    if (loading) {
        return <div className={styles.container}>Loading...</div>;
    }

    if (!book) {
        notFound();
    }

    return (
        <div className={styles.container}>
            <BookForm
                initialBook={book}
                initialPages={pages}
                mode="edit"
            />
        </div>
    );
}
