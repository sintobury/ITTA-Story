import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
// Mock supabase
jest.mock('@/lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: jest.fn(),
            onAuthStateChange: jest.fn(),
            signOut: jest.fn(),
        },
        from: jest.fn(),
    },
}));

import { supabase } from '@/lib/supabase';

// Helper component to consume context
const TestComponent = () => {
    const { user, loading, logout } = useAuth();
    if (loading) return <div>Loading...</div>;
    return (
        <div>
            <div data-testid="user-email">{user?.email}</div>
            <div data-testid="user-role">{user?.role}</div>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should invoke getSession on mount', async () => {
        // Mock getSession to return no session
        (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
            data: { session: null },
            error: null,
        });

        // Mock onAuthStateChange
        (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
            data: { subscription: { unsubscribe: jest.fn() } },
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
        expect(supabase.auth.getSession).toHaveBeenCalledTimes(1);
    });

    test('should set user when session exists', async () => {
        const mockUser = {
            id: '123',
            email: 'test@example.com',
        };

        (supabase.auth.getSession as jest.Mock).mockResolvedValue({
            data: { session: { user: mockUser } },
        });

        (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
            data: { subscription: { unsubscribe: jest.fn() } },
        });

        // Mock user profile fetch
        (supabase.from as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
                }),
            }),
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com'));
        expect(screen.getByTestId('user-role')).toHaveTextContent('ADMIN');
    });

    test('should handle logout', async () => {
        (supabase.auth.getSession as jest.Mock).mockResolvedValue({
            data: { session: { user: { id: '123', email: 'test@example.com' } } },
        });
        (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
            data: { subscription: { unsubscribe: jest.fn() } },
        });

        // Mock profile fetch
        (supabase.from as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({ data: { role: 'user' }, error: null }),
                }),
            }),
        });

        // Mock signOut
        (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });

        // Mock window.location
        const originalLocation = window.location;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (window as any).location;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).location = { href: '' };

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => expect(screen.getByText('Logout')).toBeInTheDocument());

        await act(async () => {
            screen.getByText('Logout').click();
        });

        expect(supabase.auth.signOut).toHaveBeenCalled();
        expect(window.location.href).toBe('http://localhost/');

        // Restore
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).location = originalLocation;
    });
});
