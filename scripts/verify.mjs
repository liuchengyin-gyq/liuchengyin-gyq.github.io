import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
try {
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'], reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().includes('127.0.0.1')) errors.push(`${response.status()} ${response.url()}`); });
  for (const [name, width, height] of [['desktop', 1440, 1000], ['wide', 1920, 1080], ['mobile', 390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      await Promise.all([...document.images].map(async image => {
        image.loading = 'eager';
        await image.decode();
      }));
    });
    await page.screenshot({ path: `artifacts/${name}.png`, fullPage: true });
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      images: [...document.images].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src),
      sections: document.querySelectorAll('main > section').length,
      video: { ready: document.querySelector('video').readyState, width: document.querySelector('video').videoWidth },
    }));
    console.log(name, JSON.stringify(layout));
    if (layout.overflow || layout.images.length || layout.sections !== 5 || !layout.video.width) errors.push(`${name}: invalid layout or media`);
    if (name !== 'mobile' && await page.getByRole('button', { name: '打开导航' }).isVisible()) errors.push('Desktop mobile menu is visible');
    if (name === 'mobile') {
      await page.getByRole('button', { name: '打开导航' }).click();
      await page.getByRole('navigation').getByRole('link', { name: '精选项目' }).click();
      if (await page.getByRole('button', { name: '关闭导航' }).count()) errors.push('Mobile menu did not close');
    }
  }
  for (const [viewport, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
   await page.setViewportSize({ width, height });
   for (const [name, count] of [['公共数据授权运营平台', 6], ['TOCC 交通运行监测与指挥', 5], ['智护集安 · 冰酒葡萄种植', 7], ['智安厨 AaaS 系统', 4]]) {
    await page.getByRole('button', { name: `查看${name}项目详情`, exact: true }).click();
    await page.getByRole('dialog').waitFor();
    const gallery = page.getByRole('region', { name: '项目作品图片' });
    await gallery.scrollIntoViewIfNeeded();
    await expect(gallery.locator('canvas')).toBeVisible();
    await expect(gallery.locator('.flex-carousel__title')).toBeVisible();
    await expect(gallery.locator('.flex-carousel__live')).toContainText(`共 ${count} 张`);
    const sources = await page.evaluate(() =>
      performance.getEntriesByType('resource').filter(entry => entry.name.includes('/assets/gallery/')).map(entry => entry.name));
    const project = ['data', 'traffic', 'agri', 'kitchen'][['公共数据授权运营平台', 'TOCC 交通运行监测与指挥', '智护集安 · 冰酒葡萄种植', '智安厨 AaaS 系统'].indexOf(name)];
    expect(new Set(sources.filter(url => url.includes(`/gallery/${project}/`))).size).toBe(count);
    await page.waitForTimeout(500);
    const shot = await gallery.screenshot({ path: `artifacts/gallery-${viewport}-${project}.png` });
    const pixels = await page.evaluate(async base64 => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      const data = ctx.getImageData(0, Math.floor(image.height * .25), image.width, Math.floor(image.height * .45)).data;
      let bright = 0;
      const colors = new Set();
      for (let i = 0; i < data.length; i += 16) {
        colors.add(`${data[i] >> 4},${data[i + 1] >> 4},${data[i + 2] >> 4}`);
        if (Math.max(data[i], data[i + 1], data[i + 2]) > 90) bright++;
      }
      return { bright, colors: colors.size };
    }, shot.toString('base64'));
    expect(pixels.bright).toBeGreaterThan(200);
    expect(pixels.colors).toBeGreaterThan(30);
    console.log('Gallery', viewport, project, JSON.stringify(pixels));
    await page.getByRole('button', { name: '关闭项目详情' }).focus();
    await page.keyboard.press('Tab');
    await expect(gallery).toBeFocused();
    await gallery.press('ArrowRight');
    await expect(gallery.locator('.flex-carousel__live')).toContainText('第 2 张');
    await page.waitForTimeout(600);
    await gallery.press('Enter');
    await expect(gallery.locator('.flex-carousel__count')).toHaveAttribute('data-hidden', '');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(gallery.locator('.flex-carousel__count')).not.toHaveAttribute('data-hidden', '');
    if (project === 'data') {
      await page.waitForTimeout(500);
      const bounds = await gallery.boundingBox();
      await page.mouse.move(bounds.x + bounds.width * .75, bounds.y + bounds.height * .5);
      await page.mouse.down();
      await page.mouse.move(bounds.x + bounds.width * .25, bounds.y + bounds.height * .5, { steps: 20 });
      await page.mouse.up();
      await expect(gallery.locator('.flex-carousel__live')).not.toContainText('第 2 张');
    }
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('button', { name: `查看${name}项目详情`, exact: true })).toBeFocused();
   }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: '复制邮箱', exact: true }).click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  if (clipboard !== 'gaoyingqiao2022@163.com') errors.push('Clipboard mismatch');
  const download = page.waitForEvent('download');
  await page.getByRole('link', { name: '下载完整简历' }).click();
  console.log('Resume download:', (await download).suggestedFilename());
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });
  const video = page.locator('video');
  const start = await video.evaluate(element => element.currentTime);
  await page.waitForTimeout(800);
  const end = await video.evaluate(element => element.currentTime);
  if (end <= start) errors.push('Video did not advance');
  await page.getByRole('button', { name: '暂停背景视频' }).click();
  if (!(await video.evaluate(element => element.paused))) errors.push('Video pause failed');
  await page.getByRole('button', { name: '播放背景视频' }).click();
  await page.screenshot({ path: 'artifacts/hero-desktop.png' });
  console.log('Browser errors:', JSON.stringify(errors));
  if (errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
