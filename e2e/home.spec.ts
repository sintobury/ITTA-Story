import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/E-Library/);
});

test('loads book list', async ({ page }) => {
    await page.goto('/');

    // Check if at least one book card is present
    const bookCards = page.locator('a[href^="/books/"]');
    // Wait for at least one card
    await expect(bookCards.first()).toBeVisible({ timeout: 10000 });
});

test('navigates to book detail and reader', async ({ page }) => {
    await page.goto('/');

    // Click the first book
    const firstBook = page.locator('a[href^="/books/"]').first();
    await firstBook.click();

    // Expect to be on detail page
    await expect(page).toHaveURL(/\/books\/[\w-]+/); // Regex for /books/[uuid]

    // Check for "Start Reading" button (or similar)
    // Note: Button text might be localized or specific. looking for "읽기 시작" or "Start Reading"
    // Using a broader selector or role if possible.
    // Assuming there is a button that links to /books/[id]/read? or opens a reader
    // Based on previous knowledge, it might be a button "읽기 시작"
    const readButton = page.getByRole('button', { name: /지금 읽기|처음부터|이어보기|Read/i });
    await expect(readButton).toBeVisible();
});
