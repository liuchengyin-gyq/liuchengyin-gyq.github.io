import { mkdir, copyFile, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { createCanvas } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const source = 'C:/Users/gaoyi/Desktop/Resume';
const output = path.resolve('public/assets');
await mkdir(output, { recursive: true });
await mkdir('artifacts', { recursive: true });
const copies = {
  'data.png': '公共数据授权/原型图1.png',
  'data-flow.jpg': '公共数据授权/整体业务流程图.jpg',
  'traffic.png': 'TOCC/原型图1.png',
  'traffic-structure.png': 'TOCC/整体架构图.png',
  'agri.png': '智护集安冰酒葡萄种植/原型图1.png',
  'agri-flow.png': '智护集安冰酒葡萄种植/用户使用流程.png',
  'kitchen.png': '智安厨AaaS系统/原型图-后台1.png',
  'kitchen-app.png': '智安厨AaaS系统/原型图-APP3.png',
  'resume.pdf': '高滢乔简历.pdf',
};
for (const [name, original] of Object.entries(copies)) {
  await copyFile(path.join(source, original), path.join(output, name));
}

const pdf = await getDocument({ data: new Uint8Array(await readFile(path.join(source, '高滢乔简历.pdf'))), useSystemFonts: true }).promise;
const page = await pdf.getPage(1);
const viewport = page.getViewport({ scale: 2 });
const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
await writeFile('artifacts/resume-page.png', canvas.toBuffer('image/png'));
// Extract the embedded portrait directly, preserving its original resolution.
const operators = await page.getOperatorList();
for (const args of operators.argsArray) {
  if (!args || typeof args[0] !== 'string' || !args[0].startsWith('img_')) continue;
  let image;
  try { image = page.objs.get(args[0]); } catch { continue; }
  if (!image || image.width < 60 || image.height < 70 || image.width / image.height > 1 || image.width / image.height < .5) continue;
  const portrait = createCanvas(image.width, image.height);
  const context = portrait.getContext('2d');
  if (image.bitmap) context.drawImage(image.bitmap, 0, 0);
  else if (image.data) {
    const rgba = context.createImageData(image.width, image.height);
    const channels = image.data.length / (image.width * image.height);
    for (let p = 0; p < image.width * image.height; p++) {
      rgba.data[p * 4] = image.data[p * channels];
      rgba.data[p * 4 + 1] = image.data[p * channels + (channels === 1 ? 0 : 1)];
      rgba.data[p * 4 + 2] = image.data[p * channels + (channels === 1 ? 0 : 2)];
      rgba.data[p * 4 + 3] = channels === 4 ? image.data[p * channels + 3] : 255;
    }
    context.putImageData(rgba, 0, 0);
  } else continue;
  await writeFile(path.join(output, 'portrait.png'), portrait.toBuffer('image/png'));
  console.log(`Portrait: ${image.width}x${image.height}`);
  break;
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const tab = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await tab.setContent('<html><body style="margin:0"><canvas width="1600" height="1000"></canvas></body></html>');
  const media = await tab.evaluate(async () => {
    const c = document.querySelector('canvas');
    const ctx = c.getContext('2d');
    function draw(time) {
      ctx.fillStyle = '#101713';
      ctx.fillRect(0, 0, 1600, 1000);
      const glow = ctx.createRadialGradient(1120, 420, 0, 1120, 420, 680);
      glow.addColorStop(0, '#273a2c'); glow.addColorStop(1, '#101713');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, 1600, 1000);
      // Parallel curves form a quietly moving, folded ribbon.
      for (let i = 0; i < 230; i++) {
        const t = i / 229;
        ctx.beginPath();
        for (let j = 0; j <= 160; j++) {
          const u = j / 160;
          const phase = u * Math.PI * 2.1 + time * 0.25;
          const x = 610 + u * 1110 + Math.sin(phase + t * 2.5) * 130 + t * 70;
          const y = 740 - u * 460 + Math.sin(phase + 1.2) * 160 + (t - .5) * (170 + 180 * Math.sin(u * 5.2 + .3));
          if (!j) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        const light = Math.sin(t * Math.PI) * .55 + .1;
        ctx.strokeStyle = `rgba(${Math.round(125 + t * 70)},${Math.round(151 + t * 65)},${Math.round(112 + t * 45)},${light})`;
        ctx.lineWidth = .7;
        ctx.stroke();
      }
      for (let i = 0; i < 60; i++) {
        const x = (i * 179.1) % 1600;
        const y = (i * 93.7) % 1000;
        ctx.fillStyle = `rgba(192,215,168,${.08 + .08 * Math.sin(i + time)})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    draw(0);
    const poster = c.toDataURL('image/jpeg', .92).split(',')[1];
    const stream = c.captureStream(25);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 2600000 });
    const chunks = [];
    recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    const finished = new Promise(resolve => { recorder.onstop = resolve; });
    recorder.start();
    const start = performance.now();
    await new Promise(resolve => {
      function frame(now) {
        const elapsed = (now - start) / 1000;
        // A cosine cycle makes the end meet the beginning.
        draw((1 - Math.cos(elapsed / 8 * Math.PI * 2)) * 1.1);
        if (elapsed < 8) requestAnimationFrame(frame); else resolve();
      }
      requestAnimationFrame(frame);
    });
    recorder.stop();
    await finished;
    stream.getTracks().forEach(track => track.stop());
    const bytes = new Uint8Array(await new Blob(chunks).arrayBuffer());
    let binary = '';
    for (let i = 0; i < bytes.length; i += 16384) binary += String.fromCharCode(...bytes.subarray(i, i + 16384));
    return { video: btoa(binary), poster };
  });
  await writeFile(path.join(output, 'hero.webm'), Buffer.from(media.video, 'base64'));
  await writeFile(path.join(output, 'hero-poster.jpg'), Buffer.from(media.poster, 'base64'));
  console.log('Project assets, portrait and local hero video ready.');
} finally {
  await browser.close();
}
