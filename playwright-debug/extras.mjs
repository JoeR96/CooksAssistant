import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const events = [];
page.on('pageerror', e => events.push('pageerror: ' + e.message));
page.on('response', r => { if (r.status() >= 400) events.push('HTTP ' + r.status() + ' ' + r.url()); });

// /recipes/new anon
const r1 = await page.goto('http://localhost:3000/recipes/new', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
console.log('/recipes/new status:', r1.status(), 'url:', page.url());

// /recipes after a successful / load (is it the same page-share trick?)
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
const r2 = await page.goto('http://localhost:3000/recipes', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
console.log('/recipes (after /) status:', r2.status(), 'url:', page.url());

// Cold visit /recipes
const ctx2 = await browser.newContext();
const p2 = await ctx2.newPage();
const errs2 = [];
p2.on('pageerror', e => errs2.push(e.message));
const r3 = await p2.goto('http://localhost:3000/recipes', { waitUntil: 'domcontentloaded' });
await p2.waitForTimeout(1500);
console.log('/recipes (cold) status:', r3.status(), 'pageerrors:', errs2);

console.log('--- events ---');
events.forEach(e => console.log(e));
await browser.close();
