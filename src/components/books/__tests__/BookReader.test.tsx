import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookReader from '../BookReader';
import { Page } from '@/types';

// Mock Language Context
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        t: {
            bookDetail: {
                closeBook: 'Close Book'
            },
            rightClickWarning: 'Right click disabled'
        }
    })
}));

// Mock Button
// Mock Button
jest.mock('@/components/common/Button', () => ({
    Button: ({ children, onClick, disabled, className }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button onClick={onClick} disabled={disabled} className={className}>
            {children}
        </button>
    )
}));

// Mock Image
jest.mock('next/image', () => function MockImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
});


describe('BookReader Component', () => {
    const mockPages: Page[] = [
        { pageNumber: 1, content: '<p>Page 1 Content</p>', imageUrl: '/img1.png' },
        { pageNumber: 2, content: '<p>Page 2 Content</p>', imageUrl: '/img2.png' },
        { pageNumber: 3, content: '<p>Page 3 Content</p>', imageUrl: '/img3.png' }
    ];

    const mockHandlers = {
        onClose: jest.fn(),
        onTriggerToast: jest.fn(),
        onPageChange: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders initial page', () => {
        render(<BookReader pages={mockPages} initialPage={0} {...mockHandlers} />);
        expect(screen.getByText('Page 1 Content')).toBeInTheDocument();
        // Check for 1/3 indicator or similar? Component shows "- 1 -"
        expect(screen.getByText('- 1 -')).toBeInTheDocument();
    });

    test('navigates to next page', () => {
        render(<BookReader pages={mockPages} initialPage={0} {...mockHandlers} />);
        const nextBtn = screen.getByText('›');
        fireEvent.click(nextBtn);

        expect(screen.getByText('Page 2 Content')).toBeInTheDocument();
        expect(screen.getByText('- 2 -')).toBeInTheDocument();
        expect(mockHandlers.onPageChange).toHaveBeenCalledWith(1); // 0-based index
    });

    test('navigates to previous page', () => {
        render(<BookReader pages={mockPages} initialPage={1} {...mockHandlers} />);
        const prevBtn = screen.getByText('‹');
        fireEvent.click(prevBtn);

        expect(screen.getByText('Page 1 Content')).toBeInTheDocument();
        expect(mockHandlers.onPageChange).toHaveBeenCalledWith(0);
    });

    test('disables prev button on first page', () => {
        render(<BookReader pages={mockPages} initialPage={0} {...mockHandlers} />);
        expect(screen.getByText('‹')).toBeDisabled();
    });

    test('disables next button on last page', () => {
        render(<BookReader pages={mockPages} initialPage={2} {...mockHandlers} />);
        expect(screen.getByText('›')).toBeDisabled();
    });

    test('triggers prompt on right click', () => {
        render(<BookReader pages={mockPages} initialPage={0} {...mockHandlers} />);
        // Right click on the container (or any child)
        fireEvent.contextMenu(screen.getByText('Page 1 Content'));
        expect(mockHandlers.onTriggerToast).toHaveBeenCalledWith('Right click disabled');
    });

    test('closes book', () => {
        render(<BookReader pages={mockPages} initialPage={0} {...mockHandlers} />);
        fireEvent.click(screen.getByText('← Close Book'));
        expect(mockHandlers.onClose).toHaveBeenCalled();
    });
});
