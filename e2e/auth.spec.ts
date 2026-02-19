import { test, expect } from '@playwright/test';

const SUPABASE_URL = 'https://hciwnrnzikfllufhpfev.supabase.co';

test.describe('Auth Flow', () => {

    test('redirects to login when accessing protected route', async ({ page }) => {
        // Mock no session to ensure loading finishes and user is null
        await page.route(`${SUPABASE_URL}/auth/v1/user`, async route => {
            await route.fulfill({ status: 401, body: JSON.stringify({ error: 'unauthorized' }) });
        });

        await page.goto('/admin');
        await expect(page).toHaveURL(/\/login/);
    });

    test('shows error when user does not exist', async ({ page }) => {
        await page.goto('/login');

        // Mock RPC check_email_exists -> false
        await page.route(`${SUPABASE_URL}/rest/v1/rpc/check_email_exists`, async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(false)
            });
        });

        // Fill form
        await page.getByPlaceholder('아이디를 입력하세요').fill('non-existent');
        await page.getByPlaceholder('비밀번호를 입력하세요').fill('password');

        // Submit
        await page.getByRole('button', { name: /로그인|Login/i }).click();

        // Expect "User not found" message (Korean: 존재하지 않는 계정입니다.)
        await expect(page.getByText(/존재하지 않는 계정입니다/)).toBeVisible();
    });

    test('shows error when password is wrong', async ({ page }) => {
        await page.goto('/login');

        // Mock RPC check_email_exists -> true
        await page.route(`${SUPABASE_URL}/rest/v1/rpc/check_email_exists`, async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(true)
            });
        });

        // Mock Supabase Auth request to fail with invalid password
        await page.route(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, async route => {
            await route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'invalid_grant', error_description: 'Invalid login credentials' })
            });
        });

        // Fill form
        await page.getByPlaceholder('아이디를 입력하세요').fill('valid-user');
        await page.getByPlaceholder('비밀번호를 입력하세요').fill('wrongpass');

        // Submit
        await page.getByRole('button', { name: /로그인|Login/i }).click();

        // Expect "Wrong password" message (Korean: 비밀번호가 틀렸습니다.)
        await expect(page.getByText(/비밀번호가 틀렸습니다/)).toBeVisible();
    });
});
