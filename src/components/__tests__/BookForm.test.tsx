import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookForm from '../BookForm';
import { supabase } from '@/lib/supabase';

// Helper to mock useToast
const mockTriggerToast = jest.fn();
jest.mock('@/hooks/useToast', () => ({
    useToast: () => ({
        triggerToast: mockTriggerToast,
        toastMessage: null,
        isToastExiting: false
    })
}));

// Mock next/navigation
const mockRouterPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockRouterPush,
        refresh: jest.fn(),
        back: jest.fn()
    })
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
    supabase: {
        from: jest.fn(),
        storage: {
            from: jest.fn().mockReturnValue({
                upload: jest.fn().mockResolvedValue({ error: null }),
                getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'http://mock-url.com/img.png' } })
            })
        }
    }
}));

// Mock React Quill
// Mock React Quill
/** 테스트 환경에서 Quill 라이브러리를 모킹하기 위해 any 타입을 허용합니다. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
jest.mock('react-quill-new', () => function MockQuill({ value, onChange, placeholder }: any) {
    return (
        <textarea
            data-testid="rich-text-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    );
});

// Mock Image
/** 테스트 환경에서 Next.js Image 컴포넌트 props를 단순화하기 위해 any를 사용합니다. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
jest.mock('next/image', () => function MockImage(props: any) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
});

// Polyfill scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();
window.scrollTo = jest.fn();

describe('BookForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders form fields correctly', () => {
        render(<BookForm mode="create" />);
        expect(screen.getByPlaceholderText('책 제목')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('저자명')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('책 설명')).toBeInTheDocument();
        expect(screen.getByText('✨ 업로드')).toBeInTheDocument();
    });

    test('validates required fields', async () => {
        render(<BookForm mode="create" />);

        const submitBtn = screen.getByText('✨ 업로드');
        fireEvent.click(submitBtn);

        expect(mockTriggerToast).toHaveBeenCalledWith('책 기본 정보를 모두 입력해주세요.');
    });

    // TODO: Add test for partial content validation (e.g. ko typed, en missing) if logic exists
    // The current logic: triggerToast(`${i + 1}페이지의 [${missingLangLabel}] 내용을 입력해주세요.`);

    test('submits valid form data', async () => {
        // Setup Supabase mocks for successful insert
        const mockInsert = jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { id: 'new-book-id' }, error: null })
            })
        });

        // Mock chain: supabase.from('books').insert(...)
        // And supabase.from('pages').insert(...)
        (supabase.from as jest.Mock).mockImplementation((table) => {
            if (table === 'books') {
                return { insert: mockInsert };
            }
            if (table === 'pages') {
                return { insert: jest.fn().mockResolvedValue({ error: null }) };
            }
            return {};
        });

        render(<BookForm mode="create" />);

        // Fill basic info
        fireEvent.change(screen.getByPlaceholderText('책 제목'), { target: { value: 'Test Title' } });
        fireEvent.change(screen.getByPlaceholderText('저자명'), { target: { value: 'Test Author' } });
        fireEvent.change(screen.getByPlaceholderText('책 설명'), { target: { value: 'Test Desc' } });

        // Fill page content (Korean default)
        const editors = screen.getAllByTestId('rich-text-editor');
        // Currently 1 page, 1 editor visible (for 'ko')
        fireEvent.change(editors[0], { target: { value: 'Test Content KO' } });

        // Submit
        fireEvent.click(screen.getByText('✨ 업로드'));

        await waitFor(() => {
            expect(mockTriggerToast).toHaveBeenCalledWith('책을 등록하는 중입니다...');
        });

        await waitFor(() => {
            expect(mockTriggerToast).toHaveBeenCalledWith('책이 성공적으로 등록되었습니다!');
        });

        // Check redirection
        // Wait for timeout (1000ms) - might need fake timers
    });
});
