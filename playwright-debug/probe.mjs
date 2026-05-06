import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://localhost:3000/sign-in', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const html = await page.content();
const fs = await import('node:fs');
fs.writeFileSync('playwright-debug/signin-html.txt', html);
const inputs = await page.locator('input').all();
for (const inp of inputs) {
  const n = await inp.getAttribute('name');
  const t = await inp.getAttribute('type');
  const ph = await inp.getAttribute('placeholder');
  const id = await inp.getAttribute('id');
  console.log(`INPUT name=${n} type=${t} id=${id} placeholder=${ph}`);
}
const buttons = await page.locator('button, a').all();
for (const b of buttons.slice(0, 30)) {
  const tx = (await b.innerText().catch(()=>'')).trim().slice(0, 60);
  if (tx) console.log('BTN/LINK: ' + tx);
}
await browser.close();
