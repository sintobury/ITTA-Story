import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../page';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        refresh: jest.fn(),
    }),
}));

// Mock Language Context
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        t: {
            auth: {
                loginTitle: '로그인',
                id: '아이디',
                password: '비밀번호',
                idPlaceholder: '아이디를 입력하세요',
                pwPlaceholder: '비밀번호를 입력하세요',
                loginBtn: '로그인',
                userNotFound: '존재하지 않는 계정입니다.',
                wrongPassword: '비밀번호가 틀렸습니다.',
                processing: '처리 중...',
                error: '오류가 발생했습니다.',
            }
        }
    })
}));

const mockTriggerToast = jest.fn();
jest.mock('@/hooks/useToast', () => ({
    useToast: () => ({
        triggerToast: mockTriggerToast,
        toastMessage: null,
        isToastExiting: false,
    }),
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
    supabase: {
        auth: {
            signInWithPassword: jest.fn(),
        },
        rpc: jest.fn(),
    },
}));

describe('LoginPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders login form correctly', () => {
        render(<LoginPage />);
        expect(screen.getByRole('heading', { name: '로그인' })).toBeInTheDocument(); // Title
        expect(screen.getByPlaceholderText('아이디를 입력하세요')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('비밀번호를 입력하세요')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
    });

    test('handles successful login', async () => {
        // Mock success
        (supabase.rpc as jest.Mock).mockResolvedValue({ data: true, error: null });
        (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({ error: null });

        render(<LoginPage />);

        fireEvent.change(screen.getByPlaceholderText('아이디를 입력하세요'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('비밀번호를 입력하세요'), { target: { value: 'password123' } });

        const loginBtn = screen.getByRole('button', { name: '로그인' });
        fireEvent.click(loginBtn);

        await waitFor(() => {
            expect(supabase.rpc).toHaveBeenCalledWith('check_email_exists', { email_input: 'testuser@example.com' });
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'testuser@example.com',
                password: 'password123',
            });
        });
    });

    test('handles login failure (user not found)', async () => {
        // Mock user checks - user not found
        (supabase.rpc as jest.Mock).mockResolvedValue({ data: false, error: null });

        render(<LoginPage />);

        fireEvent.change(screen.getByPlaceholderText('아이디를 입력하세요'), { target: { value: 'unknown' } });
        fireEvent.change(screen.getByPlaceholderText('비밀번호를 입력하세요'), { target: { value: 'pw' } });

        fireEvent.click(screen.getByRole('button', { name: '로그인' }));

        await waitFor(() => {
            expect(mockTriggerToast).toHaveBeenCalledWith('존재하지 않는 계정입니다.');
            expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
        });
    });

    test('handles login failure (wrong password)', async () => {
        // Mock success check, but auth error
        (supabase.rpc as jest.Mock).mockResolvedValue({ data: true, error: null });
        (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({ error: { message: 'Invalid login credentials' } });

        render(<LoginPage />);

        fireEvent.change(screen.getByPlaceholderText('아이디를 입력하세요'), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText('비밀번호를 입력하세요'), { target: { value: 'wrongpw' } });

        fireEvent.click(screen.getByRole('button', { name: '로그인' }));

        await waitFor(() => {
            expect(mockTriggerToast).toHaveBeenCalledWith('비밀번호가 틀렸습니다.');
        });
    });
});
