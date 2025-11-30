import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {

    test('Home page loads', async ({ page }) => {
        await page.goto('/en');
        // Check for main title or specific text
        await expect(page.getByText('Optimize your CV with AI')).toBeVisible();
    });

    test('CV Analyze page loads', async ({ page }) => {
        await page.goto('/en/CV_analyze');
        // Check for title or form elements
        await expect(page.getByText('CV Analysis', { exact: true })).toBeVisible();
        await expect(page.getByText('Upload your CV (PDF)')).toBeVisible();
    });

    test('About page loads', async ({ page }) => {
        await page.goto('/en/about');
        await expect(page.getByText('Our Mission')).toBeVisible();
        await expect(page.getByText('Our Story')).toBeVisible();
    });

    test('Entreprise page loads', async ({ page }) => {
        await page.goto('/en/entreprise');
        await expect(page.getByText('Company Dashboard')).toBeVisible();
        await expect(page.getByText('Upload multiple CVs')).toBeVisible();
    });

    test('Payment page loads', async ({ page }) => {
        await page.goto('/en/payment');
        await expect(page.getByText('Choose the perfect plan for your career')).toBeVisible();
        await expect(page.getByText('Basic')).toBeVisible();
        await expect(page.getByText('VIP')).toBeVisible();
    });

    test('Build CV page loads', async ({ page }) => {
        await page.goto('/en/build-cv');
        // Check for steps or form
        await expect(page.getByText('Step 1: Basic Information')).toBeVisible();
        await expect(page.getByLabel('Full Name')).toBeVisible();
    });

    test('Login page loads', async ({ page }) => {
        await page.goto('/en/auth/login');
        console.log('Current URL:', page.url());
        console.log('Page Title:', await page.title());
        await expect(page.getByText('Welcome Back')).toBeVisible();
        await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
    });

    test('Register page loads', async ({ page }) => {
        await page.goto('/en/auth/register');
        await expect(page.getByText('Get Started')).toBeVisible();
        await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
    });

});
