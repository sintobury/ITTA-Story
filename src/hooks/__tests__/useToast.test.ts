import { renderHook, act } from '@testing-library/react';
import { useToast } from '../useToast';

describe('useToast Hook', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should have initial state null', () => {
        const { result } = renderHook(() => useToast());
        expect(result.current.toastMessage).toBeNull();
        expect(result.current.isToastExiting).toBe(false);
    });

    test('should update message when triggered', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.triggerToast('Test Message');
        });

        expect(result.current.toastMessage).toBe('Test Message');
        expect(result.current.isToastExiting).toBe(false);
    });

    test('should start exiting after 2 seconds', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.triggerToast('Test Message');
        });

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(result.current.isToastExiting).toBe(true);
        expect(result.current.toastMessage).toBe('Test Message'); // Still visible, but exiting
    });

    test('should clear message after 2.5 seconds', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.triggerToast('Test Message');
        });

        act(() => {
            jest.advanceTimersByTime(2500);
        });

        expect(result.current.toastMessage).toBeNull();
        expect(result.current.isToastExiting).toBe(false);
    });
});
