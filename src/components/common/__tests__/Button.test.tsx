import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
    test('renders button with text', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    test('calls onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        fireEvent.click(screen.getByText('Click Me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('renders loading state', () => {
        render(<Button isLoading>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
        // Loading spinner logic might vary, checking for disabled state or class
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
});
