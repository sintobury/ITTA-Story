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
        // 책 정보 찾기
        const foundBook = mockBooks.find(b => b.id === id);
        if (foundBook) {
            setBook(foundBook);
            setPages(mockPages[id] || []);
        }
        setLoading(false);
    }, [id]);

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            // 메인 관리자 페이지에서 리다이렉트 처리
            // 유저 로딩 대기
        }
    }, [user, router]);


    if (!user || user.role !== 'ADMIN') {
        // 권한 확인 대기 (목업에서는 빈 화면 처리)
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
