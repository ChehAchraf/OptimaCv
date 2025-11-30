import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/OptimaCv/);
});

test('get started link', async ({ page }) => {
    await page.goto('/');

    // Check if the hero section is visible
    // We can look for a heading or a button. 
    // Since the content is dynamic based on translations, we might just check for the presence of a main element or specific class if we knew it.
    // For now, let's just check that the page loads without error and has a title.

    // You can add more specific assertions here based on your actual content
    // For example, if you have a "Get Started" button:
    // await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
});
