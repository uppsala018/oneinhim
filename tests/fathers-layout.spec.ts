import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const screenshotDir = path.join(__dirname, 'screenshots');

test.beforeAll(() => {
  fs.mkdirSync(screenshotDir, { recursive: true });
});

// Fathers page is heavy (14 MB JSON) — use domcontentloaded + generous pause
// Run sequentially to avoid dev-server saturation
test.describe.configure({ mode: 'serial' });

test('fathers desktop: hero panel, gold H1, father cards', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/library/fathers', { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await page.waitForTimeout(3000);

  // Desktop hero panel: eyebrow only exists in the desktop layout (not in the mobile component)
  await expect(page.locator('text=Patristics').first()).toBeVisible();

  await page.screenshot({
    path: path.join(screenshotDir, 'fathers-desktop-chromium.png'),
    fullPage: false,
  });
});

test('fathers tablet: mobile library with search visible', async ({ browser }) => {
  test.setTimeout(120_000);
  const ctx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const page = await ctx.newPage();

  await page.goto('/library/fathers', { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await page.waitForTimeout(2000);

  // At 768px, the mobile library shows (lg:hidden = visible)
  await expect(page.locator('.fathers-mobile').first()).toBeVisible();
  await expect(page.locator('.fathers-mobile__topbar')).toBeVisible();

  await page.screenshot({
    path: path.join(screenshotDir, 'fathers-tablet-chromium.png'),
    fullPage: false,
  });
  await ctx.close();
});

test('fathers mobile: mobile library renders cleanly', async ({ browser }) => {
  test.setTimeout(120_000);
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  await page.goto('/library/fathers', { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await page.waitForTimeout(2000);

  await expect(page.locator('.fathers-mobile').first()).toBeVisible();

  // No broken glyph spans visible (the SVG icons replaced them)
  const badText = page.locator('text=â').first();
  await expect(badText).toHaveCount(0);

  await page.screenshot({
    path: path.join(screenshotDir, 'fathers-mobile-chromium.png'),
    fullPage: false,
  });
  await ctx.close();
});

// Smoke-checks
test('smoke: /library/history desktop', async ({ page }) => {
  await page.goto('/library/history', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await expect(page.locator('h1').filter({ hasText: '2000 Years' }).first()).toBeVisible();
  await page.screenshot({ path: path.join(screenshotDir, 'smoke-history-desktop.png') });
});

test('smoke: /library/councils desktop', async ({ page }) => {
  await page.goto('/library/councils', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await expect(page.locator('h1').filter({ hasText: 'Ecumenical Councils' }).first()).toBeVisible();
  await page.screenshot({ path: path.join(screenshotDir, 'smoke-councils-desktop.png') });
});

test('smoke: /library/bibles desktop', async ({ page }) => {
  await page.goto('/library/bibles', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await expect(page.locator('h1').filter({ hasText: 'Study the Bible' }).first()).toBeVisible();
  await page.screenshot({ path: path.join(screenshotDir, 'smoke-bibles-desktop.png') });
});
