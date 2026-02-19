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
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [book, setBook] = useState<Book | null>(null);
    const [pages, setPages] = useState<Page[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    // 관리자 권한 확인 및 리다이렉트
    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchBookData = async () => {
            if (!id) return;
            setDataLoading(true);

            // 1. 책 정보 가져오기
            const { data: bookData, error: bookError } = await supabase
                .from('books')
                .select('*')
                .eq('id', id)
                .single();

            if (bookError || !bookData) {
                console.error("Error fetching book:", bookError);
                setBook(null); // notFound() 트리거 예정
                setDataLoading(false);
                return;
            }

            // 2. 페이지 정보 가져오기
            const { data: pageData, error: pageError } = await supabase
                .from('pages')
                .select('*')
                .eq('book_id', id)
                .order('page_number', { ascending: true });

            if (pageError) {
                console.error("Error fetching pages:", pageError);
            }

            // 책 데이터 변환 (DB -> App)
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

            // 페이지 데이터 변환 (DB -> App)
            const formattedPages: Page[] = (pageData || []).map(p => ({
                pageNumber: p.page_number,
                content: "", // UI에서 더 이상 사용하지 않음 (타입 호환성용)
                imageUrl: p.image_url,
                contentByLang: p.content_by_lang || (p.translations ?
                    Object.keys(p.translations).reduce((acc: Record<string, string>, lang: string) => ({ ...acc, [lang]: p.translations[lang].content }), {})
                    : {})
            }));

            setBook(formattedBook);
            setPages(formattedPages);
            setDataLoading(false);
        };

        if (user && user.role === 'ADMIN') {
            fetchBookData();
        }
    }, [id, user]);


    // 1. 인증 로딩 중이거나 권한 없을 때 -> 렌더링 안 함 (리다이렉트 대기)
    if (authLoading || !user || user.role !== 'ADMIN') {
        return null;
    }

    // 2. 데이터 로딩 중 -> 로딩 UI 표시
    if (dataLoading) {
        return <div className="max-w-[800px] mx-auto pb-16 pt-20 text-center">데이터를 불러오는 중...</div>;
    }

    // 3. 데이터 없음 -> 404
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
