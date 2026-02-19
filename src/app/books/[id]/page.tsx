import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BookDetailClient from '@/components/books/BookDetailClient';

import { SITE_NAME } from '@/lib/constants';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    const { data: book } = await supabase
        .from('books')
        .select('title, description, cover_url')
        .eq('id', id)
        .single();

    if (!book) {
        return {
            title: `책을 찾을 수 없음 | ${SITE_NAME}`,
            description: '요청하신 책을 찾을 수 없습니다.',
        };
    }

    return {
        title: `${book.title} | ${SITE_NAME}`,
        description: book.description,
        openGraph: {
            title: book.title,
            description: book.description,
            images: [
                {
                    url: book.cover_url,
                    width: 800,
                    height: 600,
                    alt: book.title,
                },
            ],
        },
    };
}

export default async function BookDetailPage({ params }: Props) {
    const { id } = await params;

    // 책 데이터 가져오기
    const { data: book, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !book) {
        notFound();
    }

    // 클라이언트 컴포넌트로 데이터 전달
    // DB의 snake_case를 클라이언트 컴포넌트가 기대하는 camelCase로 변환
    // 클라이언트 컴포넌트가 DB 형식을 직접 사용하도록 수정할 수도 있지만, 현재는 여기서 변환하여 전달함.
    const formattedBook = {
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        coverUrl: book.cover_url,
        likes: book.likes_count,
        availableLanguages: book.available_languages,
        translations: book.translations,
    };

    return <BookDetailClient initialBook={formattedBook} />;
}
