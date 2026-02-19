import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal Component', () => {
    test('renders nothing when isOpen is false', () => {
        render(
            <Modal isOpen={false} title="Test Modal" onClose={jest.fn()}>
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    test('renders content when isOpen is true', () => {
        render(
            <Modal isOpen={true} title="Test Modal" onClose={jest.fn()}>
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    test('calls onClose when clicking overlay', () => {
        const handleClose = jest.fn();
        render(
            <Modal isOpen={true} title="Test Modal" onClose={handleClose}>
                <div>Modal Content</div>
            </Modal>
        );

        // Click the overlay (first div)
        // Since the overlay covers everything, getting it by role logic or just the text's parent's parent might be tricky.
        // But the outer div has `fixed inset-0`.
        // We can find it by class or acting on the container's first child if we are careful.
        // Better: add data-testid to Modal.tsx? Or select by text and traverse up.
        // Actually, the outer div has an onClick.
        // Let's assume the outer div adds a role or just use `fireEvent.click` on the container's first child.

        // Alternatively, finding by text "Modal Content" gives inner div. Parent of parent is overlay.
        const content = screen.getByText('Modal Content');
        const overlay = content.closest('.fixed');

        fireEvent.click(overlay!);
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('does not call onClose when clicking content', () => {
        const handleClose = jest.fn();
        render(
            <Modal isOpen={true} title="Test Modal" onClose={handleClose}>
                <div>Modal Content</div>
            </Modal>
        );

        const content = screen.getByText('Modal Content');
        fireEvent.click(content);
        expect(handleClose).not.toHaveBeenCalled();
    });
});
