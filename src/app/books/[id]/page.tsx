import { Metadata } from 'next';
import { mockBooks } from '@/lib/mockData';
import BookDetailClient from '@/components/books/BookDetailClient';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const book = mockBooks.find((b) => b.id === id);

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
                    url: book.coverUrl,
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
    return <BookDetailClient id={id} />;
}
