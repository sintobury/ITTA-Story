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
import { supabase } from "@/lib/supabase";
import { Book, Page } from "@/types";

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();
    const router = useRouter();

    const [book, setBook] = useState<Book | null>(null);
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookData = async () => {
            if (!id) return;
            setLoading(true);

            // 1. Fetch Book
            const { data: bookData, error: bookError } = await supabase
                .from('books')
                .select('*')
                .eq('id', id)
                .single();

            if (bookError || !bookData) {
                console.error("Error fetching book:", bookError);
                setBook(null); // Will trigger notFound()
                setLoading(false);
                return;
            }

            // 2. Fetch Pages
            const { data: pageData, error: pageError } = await supabase
                .from('pages')
                .select('*')
                .eq('book_id', id)
                .order('page_number', { ascending: true });

            if (pageError) {
                console.error("Error fetching pages:", pageError);
            }

            // Transform Book
            const formattedBook: Book = {
                id: bookData.id,
                title: bookData.title,
                author: bookData.author,
                description: bookData.description,
                coverUrl: bookData.cover_url,
                likes: bookData.likes_count,
                availableLanguages: bookData.available_languages,
                translations: bookData.translations || {},
                createdAt: bookData.created_at
            };

            // Transform Pages
            const formattedPages: Page[] = (pageData || []).map(p => ({
                pageNumber: p.page_number,
                content: "", // Deprecated field in UI, but good for type compatibility
                imageUrl: p.image_url,
                contentByLang: p.content_by_lang || (p.translations ?
                    Object.keys(p.translations).reduce((acc: any, lang: string) => ({ ...acc, [lang]: p.translations[lang].content }), {})
                    : {})
            }));

            setBook(formattedBook);
            setPages(formattedPages);
            setLoading(false);
        };

        fetchBookData();
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
        return <div className="max-w-[800px] mx-auto pb-16">Loading...</div>;
    }

    if (!book) {
        notFound();
    }

    return (
        <div className="w-full pb-16">
            <BookForm
                initialBook={book}
                initialPages={pages}
                mode="edit"
            />
        </div>
    );
}
