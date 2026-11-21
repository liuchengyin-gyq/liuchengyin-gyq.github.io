import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

// Capture actual intro frames without waiting for remote fonts until the intro is over.
process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = '1';
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
let page;
try {
  page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.opening')).toBeVisible();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'artifacts/motion-opening.png' });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: 'artifacts/motion-hero-enter.png' });
  await expect(page.locator('#root')).toHaveAttribute('data-motion-ready', 'true', { timeout: 8000 });
  await expect(page.locator('.opening')).toBeHidden();
  await page.screenshot({ path: 'artifacts/motion-hero-ready.png' });
  await expect(page.locator('.hero-title-line').first()).toHaveCSS('transform', 'none');

  for (const section of ['about', 'projects', 'strengths', 'contact']) {
    await page.evaluate(id => {
      document.documentElement.style.scrollBehavior = 'auto';
      const element = document.getElementById(id);
      window.scrollTo(0, element.offsetTop - 90);
    }, section);
    await page.waitForTimeout(2200);
    await expect(page.locator('.header')).toHaveClass(/header-pinned/);
    const title = page.locator(`#${section} .motion-word`).first();
    await expect(title).toHaveCSS('transform', 'none');
    await page.screenshot({ path: `artifacts/motion-${section}.png` });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }

  // Fast jumps still reveal each target row; modal remains fully usable.
  const card = page.locator('.project-card').last();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2200);
  await expect(card).toHaveCSS('visibility', 'visible');
  await card.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(card).toBeFocused();

  // A deep link skips the opening; responsive changes re-create scroll triggers cleanly.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:5173/#strengths', { waitUntil: 'networkidle' });
  await expect(page.locator('.opening')).toBeHidden();
  await page.waitForTimeout(2400);
  await page.screenshot({ path: 'artifacts/motion-mobile-strengths.png' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await expect(page.locator('#strengths .motion-word').first()).toHaveCSS('transform', 'none');
  await expect(page.locator('.strength-card').first()).toHaveCSS('visibility', 'visible');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.strength-card').last()).toHaveCSS('visibility', 'visible');
  await expect(page.locator('.strength-card').last()).toHaveCSS('transform', 'none');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await expect(page.locator('.opening')).toBeHidden();
  await expect(page.locator('.hero-title-line').first()).toHaveCSS('transform', 'none');

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload({ waitUntil: 'load' });
  await page.keyboard.press('Tab');
  await expect(page.locator('.opening')).toBeHidden();
  await expect(page.locator('.hero-title-line').first()).toHaveCSS('transform', 'none');

  console.log('Opening, section reveals, fast scroll, modal, deep link, mobile, reduced motion, keyboard interruption: passed');
  console.log('Browser errors:', JSON.stringify(errors));
  expect(errors).toEqual([]);
} catch (error) {
  console.log('Browser errors:', JSON.stringify(errors));
  console.log('Motion state:', await page.evaluate(() => ({
    ready: document.getElementById('root')?.dataset.motionReady,
    opening: document.querySelector('.opening')?.outerHTML,
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    scroll: scrollY,
  })));
  throw error;
} finally {
  await browser.close();
}
