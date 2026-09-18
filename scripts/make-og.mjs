#!/usr/bin/env node
/**
 * Renders the social preview image from the site's own design tokens.
 * Run manually after changing identity copy: `node scripts/make-og.mjs`.
 * The PNG is committed; the build does not depend on Playwright.
 */
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../public/og.png', import.meta.url));

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @page { margin: 0 }
  body {
    margin: 0; width: 1200px; height: 630px; background: #f2f0e8; color: #151515;
    font-family: system-ui, sans-serif; display: grid; grid-template-rows: auto 1fr auto;
    padding: 56px 72px; box-sizing: border-box;
  }
  .meta { font-family: ui-monospace, monospace; font-size: 20px; letter-spacing: 0.08em;
    text-transform: uppercase; color: #595957; display: flex; justify-content: space-between;
    border-bottom: 1px solid #151515; padding-bottom: 14px; }
  h1 { font-size: 104px; line-height: 0.95; letter-spacing: -0.035em; margin: 48px 0 0; font-weight: 700; }
  .role { font-size: 36px; font-weight: 600; letter-spacing: -0.02em; margin-top: 28px;
    padding-top: 16px; border-top: 4px solid #e24421; display: inline-block; }
  .foot { font-family: ui-monospace, monospace; font-size: 20px; letter-spacing: 0.08em;
    text-transform: uppercase; color: #595957; display: flex; gap: 40px;
    border-top: 1px solid #c8c4b8; padding-top: 16px; }
  .foot span:first-child { color: #b3321a; }
</style></head><body>
  <p class="meta"><span>Sheet 00 / Identity</span><span>Rev. 2026/09</span></p>
  <div>
    <h1>Ivan<br>Dolgov</h1>
    <p class="role">Tech Lead / Full-Stack Engineer</p>
  </div>
  <p class="foot"><span>Tokyo</span><span>Web systems · Architecture · Cloud · Enterprise software</span></p>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await mkdir(fileURLToPath(new URL('../public/', import.meta.url)), { recursive: true });
await page.screenshot({ path: out });
await browser.close();
console.log(`Wrote ${out}`);
