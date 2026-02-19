import { test, expect } from '@playwright/test';

const SUPABASE_URL = 'https://hciwnrnzikfllufhpfev.supabase.co';
const PROJECT_REF = 'hciwnrnzikfllufhpfev';

test.describe('Admin Flow', () => {

    test.beforeEach(async ({ page }) => {
        // Mock authenticated admin session
        await page.addInitScript(({ projectRef }) => {
            const mockSession = {
                access_token: 'fake-access-token',
                refresh_token: 'fake-refresh-token',
                expires_in: 3600,
                expires_at: Math.floor(Date.now() / 1000) + 3600,
                token_type: 'bearer',
                user: {
                    id: 'admin-id',
                    aud: 'authenticated',
                    role: 'authenticated',
                    email: 'admin@test.com',
                    app_metadata: { provider: 'email', providers: ['email'] },
                    user_metadata: { role: 'ADMIN' }, // Custom role check
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }
            };
            window.localStorage.setItem(`sb-${projectRef}-auth-token`, JSON.stringify(mockSession));
        }, { projectRef: PROJECT_REF });

        // Ensure session call also returns success if made
        // Ensure session call also returns success if made
        await page.route(`${SUPABASE_URL}/auth/v1/session`, async route => route.continue());

        // Mock users table for role check (returns object for .single())
        await page.route(`${SUPABASE_URL}/rest/v1/users*`, async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/vnd.pgrst.object+json',
                body: JSON.stringify({ role: 'ADMIN' })
            });
        });
    });

    test('accesses admin dashboard', async ({ page }) => {
        // Mock data fetching for books/profiles in admin dashboard
        await page.route(`${SUPABASE_URL}/rest/v1/books*`, async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([])
            });
        });
        await page.route(`${SUPABASE_URL}/rest/v1/profiles*`, async route => {
            await route.fulfill({ status: 200, body: JSON.stringify([]) });
        });

        // Mock auth user call to confirm token validity (called by AuthContext)
        // Actually Supabase response for .single() is object? No, usually array is returned by API, client handles single?
        // Let's verify. Usually /rest/v1/users?id=eq.... returns [ { role: 'ADMIN' } ].
        // So I should return array.


        // Mock auth user call to confirm token validity (called by AuthContext)
        await page.route(`${SUPABASE_URL}/auth/v1/user`, async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 'admin-id',
                    aud: 'authenticated',
                    role: 'authenticated',
                    email: 'admin@test.com',
                    app_metadata: { provider: 'email', providers: ['email'] },
                    user_metadata: { role: 'ADMIN' },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
            });
        });


        await page.goto('/admin');

        // Should not redirect to login
        await expect(page).toHaveURL(/\/admin/);

        // Check for "Create Book" button presence
        // Text might be "새 책 업로드" or "Create Book"
        // In admin/page.tsx: "새 책 업로드"
        await expect(page.getByTestId('create-book-btn')).toBeVisible();
    });

    test('navigates to create book page', async ({ page }) => {
        // Setup same mocks
        await page.route(`${SUPABASE_URL}/rest/v1/books*`, async route => route.fulfill({ status: 200, body: '[]' }));
        await page.route(`${SUPABASE_URL}/auth/v1/user`, async route => route.fulfill({
            status: 200,
            body: JSON.stringify({
                id: 'admin-id',
                email: 'admin@test.com',
                user_metadata: { role: 'ADMIN' },
                app_metadata: {},
                aud: 'authenticated',
                created_at: new Date().toISOString()
            })
        }));

        await page.goto('/admin');
        await page.getByTestId('create-book-btn').click();

        await expect(page).toHaveURL(/\/admin\/upload/);

        // Check form elements
        await expect(page.getByPlaceholder(/책 제목/)).toBeVisible();
    });
});
