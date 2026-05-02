import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const APP = 'http://localhost:3000';
const OUT = 'ledger/playwright-walkthrough-2026-05-01';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const results = [];
const consoleEvents = [];
const netFails = [];
let step = 'init';
page.on('pageerror', e => consoleEvents.push({ step, type: 'pageerror', text: e.message }));
page.on('console', m => { if (m.type()==='error') consoleEvents.push({step, type:'error', text: m.text()}); });
page.on('response', r => { if (r.status() >= 400) netFails.push({step, status: r.status(), url: r.url()}); });

async function shot(n) { await page.screenshot({ path: path.join(OUT, n), fullPage: true }); }

// step 21
step = 'step-21';
const r21 = await page.goto(APP + '/brisket', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
await shot('21-brisket-404.png');
results.push({step, status: r21.status() === 404 ? 'PASS' : 'FAIL', msg: 'status=' + r21.status()});

// step 22
step = 'step-22';
const r22 = await page.goto(APP + '/categories', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
await shot('22-categories-404.png');
results.push({step, status: r22.status() === 404 ? 'PASS' : 'FAIL', msg: 'status=' + r22.status()});

// also check anon redirects for protected routes
step = 'meal-plans-anon';
const r12anon = await page.goto(APP + '/meal-plans', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
await shot('xx-meal-plans-anon.png');
results.push({step, status: 'INFO', msg: 'status=' + r12anon.status() + ', url=' + page.url()});

step = 'shopping-list-anon';
const r18anon = await page.goto(APP + '/shopping-list', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
await shot('xx-shopping-list-anon.png');
results.push({step, status: 'INFO', msg: 'status=' + r18anon.status() + ', url=' + page.url()});

console.log(JSON.stringify({results, consoleEvents, netFails}, null, 2));
await browser.close();
