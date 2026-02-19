import { render, screen, fireEvent } from '@testing-library/react';
import HomePagination from '../HomePagination';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

describe('HomePagination Component', () => {
    const mockRouterPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({
            push: mockRouterPush,
        });
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    });

    test('renders nothing when totalPages is 1', () => {
        const { container } = render(<HomePagination totalPages={1} currentPage={1} />);
        expect(container).toBeEmptyDOMElement();
    });

    test('renders pagination buttons when totalPages > 1', () => {
        render(<HomePagination totalPages={5} currentPage={3} />); // Center it to show all? Or just check subset
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('disables prev/first buttons on first page', () => {
        render(<HomePagination totalPages={5} currentPage={1} />);
        // Finding by text content <, << might be tricky if encoded.
        // The component uses < and << literally.
        const prevBtn = screen.getByText('<');
        const firstBtn = screen.getByText('<<');
        expect(prevBtn).toBeDisabled();
        expect(firstBtn).toBeDisabled();
    });

    test('calls router.push with correct URL on page click', () => {
        render(<HomePagination totalPages={5} currentPage={1} />);
        fireEvent.click(screen.getByText('2'));
        expect(mockRouterPush).toHaveBeenCalledWith('/?page=2');
    });

    test('handles next button click', () => {
        render(<HomePagination totalPages={5} currentPage={1} />);
        fireEvent.click(screen.getByText('>'));
        expect(mockRouterPush).toHaveBeenCalledWith('/?page=2');
    });

    test('correctly windows page numbers (current +/- 2)', () => {
        // Total 10 pages, current 5. Should show 3, 4, 5, 6, 7
        render(<HomePagination totalPages={10} currentPage={5} />);
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();
        expect(screen.queryByText('1')).not.toBeInTheDocument(); // Outside window
        expect(screen.queryByText('2')).not.toBeInTheDocument();
        expect(screen.queryByText('8')).not.toBeInTheDocument();
    });
});
