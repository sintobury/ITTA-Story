import { render, screen, fireEvent } from '@testing-library/react';
import CommentSection from '../CommentSection';
import { User } from '@/context/AuthContext';
import { Comment } from '@/types';

// Mock mocks
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush })
}));

// Mock useLanguage
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        language: 'ko',
        t: {
            bookDetail: {
                comments: '댓글',
                noComments: '댓글이 없습니다.',
                placeholder: '댓글을 입력하세요...',
                postComment: '등록',
                loginToComment: '로그인이 필요합니다.',
                goToLogin: '로그인 하러 가기'
            }
        }
    })
}));

// Mock getLocalizedComment
jest.mock('@/lib/seedData', () => ({
    getLocalizedComment: (comment: { content: { ko?: string } | string, userName?: string }) => ({
        content: (typeof comment.content === 'object' && comment.content.ko) ? comment.content.ko : comment.content,
        userName: comment.userName || 'Anonymous',
        createdAt: '2024-01-01'
    })
}));

describe('CommentSection Component', () => {
    const mockComments: Comment[] = [
        { id: '1', bookId: 'b1', userName: 'User1', content: 'Test Comment 1', createdAt: '2024-01-01' },
        { id: '2', bookId: 'b1', userName: 'User2', content: 'Test Comment 2', createdAt: '2024-01-02' }
    ];

    const mockUser: User = { id: 'u1', email: 'test@test.com', name: 'Tester', role: 'USER' };
    const mockAdmin: User = { id: 'a1', email: 'admin@test.com', name: 'Admin', role: 'ADMIN' };

    const mockHandlers = {
        onDelete: jest.fn(),
        onBlock: jest.fn(),
        onPost: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders comments list', () => {
        render(<CommentSection comments={mockComments} user={mockUser} {...mockHandlers} />);
        expect(screen.getByText('Test Comment 1')).toBeInTheDocument();
        expect(screen.getByText('Test Comment 2')).toBeInTheDocument();
        expect(screen.getByText('댓글 (2)')).toBeInTheDocument();
    });

    test('renders no comments message when empty', () => {
        render(<CommentSection comments={[]} user={mockUser} {...mockHandlers} />);
        expect(screen.getByText('댓글이 없습니다.')).toBeInTheDocument();
    });

    test('shows login prompt for guest', () => {
        render(<CommentSection comments={[]} user={null} {...mockHandlers} />);
        expect(screen.getByText('로그인이 필요합니다.')).toBeInTheDocument();
        const loginBtn = screen.getByText('로그인 하러 가기');
        fireEvent.click(loginBtn);
        expect(mockPush).toHaveBeenCalledWith('/login');
    });

    test('shows input field for logged in user', () => {
        render(<CommentSection comments={[]} user={mockUser} {...mockHandlers} />);
        expect(screen.getByPlaceholderText('댓글을 입력하세요...')).toBeInTheDocument();
        expect(screen.getByText('등록')).toBeInTheDocument();
    });

    test('calls onPost when submitting comment', () => {
        render(<CommentSection comments={[]} user={mockUser} {...mockHandlers} />);
        const input = screen.getByPlaceholderText('댓글을 입력하세요...');
        fireEvent.change(input, { target: { value: 'New Comment' } });
        fireEvent.click(screen.getByText('등록'));
        expect(mockHandlers.onPost).toHaveBeenCalledWith('New Comment');
    });

    test('does not show admin controls for normal user', () => {
        render(<CommentSection comments={mockComments} user={mockUser} {...mockHandlers} />);
        expect(screen.queryByText('🗑️ 삭제')).not.toBeInTheDocument();
        expect(screen.queryByText('🚫 차단')).not.toBeInTheDocument();
    });

    test('shows and activates admin controls for admin', () => {
        render(<CommentSection comments={mockComments} user={mockAdmin} {...mockHandlers} />);
        const deleteBtns = screen.getAllByText('🗑️ 삭제');
        const blockBtns = screen.getAllByText('🚫 차단');

        expect(deleteBtns).toHaveLength(2);
        fireEvent.click(deleteBtns[0]);
        expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');

        fireEvent.click(blockBtns[0]);
        // Note: component calls onBlock(userName)
        expect(mockHandlers.onBlock).toHaveBeenCalledWith('User1');
    });
});
