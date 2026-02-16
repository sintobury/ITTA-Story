import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BookDetailClient from '@/components/books/BookDetailClient';

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
            title: 'Book Not Found | E-Library',
            description: 'The requested book could not be found.',
        };
    }

    return {
        title: `${book.title} | E-Library`,
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

    // Fetch Book Data
    const { data: book, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !book) {
        notFound();
    }

    // Pass data to Client Component
    // Transform snake_case to camelCase for compatibility with Client Component expectations
    // Or update Client Component to accept DB format. 
    // Let's transform here to minimize Client component changes for now, 
    // but ideally Client should use shared types.
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
