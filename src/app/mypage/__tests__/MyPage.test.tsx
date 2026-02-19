import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MyPage from '../page';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

// Mock mocks
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush })
}));

// AuthContext 모킹
const mockUser = { id: 'u1', email: 'test@test.com', name: 'Tester', role: 'USER' };
jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn()
}));

// LanguageContext 모킹
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        language: 'ko',
        t: {
            myPage: {
                title: '마이 페이지',
                tabs: { reading: '읽고 있는 책', completed: '완독한 책', liked: '좋아요', comments: '내 댓글' },
                resume: '이어보기',
                unit: '페이지',
                loading: '로딩 중...',
                unknownBook: '알 수 없는 책',
                noReading: '읽고 있는 책이 없습니다.',
                noCompleted: '완독한 책이 없습니다.',
                completedBadge: '완독',
                goBrowse: '책 둘러보기',
                noLiked: '좋아요한 책이 없습니다.',
                noComments: '작성한 댓글이 없습니다.'
            }
        }
    })
}));

// seedData 모킹
jest.mock('@/lib/seedData', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getLocalizedBook: (book: any) => ({
        title: book.title,
        author: book.author,
        coverUrl: book.cover_url
    })
}));

// Supabase 모킹
jest.mock('@/lib/supabase', () => ({
    supabase: {
        from: jest.fn()
    }
}));

describe('MyPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('redirects if not logged in', () => {
        (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });
        render(<MyPage />);
        expect(mockPush).toHaveBeenCalledWith('/login');
    });

    test('fetches and displays reading progress', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });

        const mockReadingData = [
            {
                user_id: 'u1',
                book_id: 'b1',
                last_page: 5,
                last_read_at: '2024-01-01',
                books: { title: 'Book 1', author: 'Author 1', cover_url: '/img1.png' }
            }
        ];

        (supabase.from as jest.Mock).mockImplementation((table) => {
            if (table === 'reading_progress') {
                return {
                    select: jest.fn().mockReturnThis(),
                    eq: jest.fn().mockReturnThis(),
                    neq: jest.fn().mockReturnThis(),
                    order: jest.fn().mockResolvedValue({ data: mockReadingData, error: null })
                };
            }
            return {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockResolvedValue({ data: [], error: null })
            };
        });

        render(<MyPage />);

        await waitFor(() => {
            expect(screen.getByText('Book 1')).toBeInTheDocument();
        });
        expect(screen.getByText('이어보기 6페이지')).toBeInTheDocument();
    });

    test('switches tabs', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });

        (supabase.from as jest.Mock).mockImplementation(() => ({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            neq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: [], error: null })
        }));

        render(<MyPage />);

        await waitFor(() => expect(screen.getByText('읽고 있는 책이 없습니다.')).toBeInTheDocument());

        fireEvent.click(screen.getByText('좋아요'));
        expect(await screen.findByText('좋아요한 책이 없습니다.')).toBeInTheDocument();

        fireEvent.click(screen.getByText('내 댓글'));
        expect(await screen.findByText('작성한 댓글이 없습니다.')).toBeInTheDocument();
    });
});
