import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const APP = 'http://localhost:3000';
const OUT = 'ledger/playwright-walkthrough-2026-05-01-run2';
const EMAIL = process.env.TEST_USER_EMAIL;
const PASSWORD = process.env.TEST_USER_PASSWORD;
fs.mkdirSync(OUT, { recursive: true });

const results = [];
const allConsole = [];
const allNetworkFails = [];
let currentStep = 'init';

function log(step, status, msg, extras) {
  if (!extras) extras = {};
  results.push(Object.assign({ step, status, msg }, extras));
  console.log('[' + status + '] ' + step + ': ' + msg);
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

page.on('console', m => {
  if (['error', 'warning'].includes(m.type())) {
    allConsole.push({ step: currentStep, type: m.type(), text: m.text() });
  }
});
page.on('pageerror', e => allConsole.push({ step: currentStep, type: 'pageerror', text: e.message }));
page.on('response', r => {
  if (r.status() >= 400) allNetworkFails.push({ step: currentStep, status: r.status(), url: r.url() });
});

async function shot(name) {
  await page.screenshot({ path: path.join(OUT, name), fullPage: true });
}

try {
  currentStep = 'step-01';
  await page.goto(APP + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await shot('01-landing-public.png');
  const bodyText1 = await page.locator('body').innerText();
  const has1a = /CooksAssistant/i.test(bodyText1);
  const has1b = /Browse 0 recipes from our community/i.test(bodyText1);
  log('step-01', (has1a && has1b) ? 'PASS' : 'FAIL',
      'CooksAssistant=' + has1a + ', BrowseCopy=' + has1b,
      { bodyExcerpt: bodyText1.slice(0, 400) });

  currentStep = 'step-02';
  await page.goto(APP + '/recipes', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await shot('02-recipes-public.png');
  const bodyText2 = await page.locator('body').innerText();
  const has2 = /No recipes found/i.test(bodyText2);
  log('step-02', has2 ? 'PASS' : 'FAIL', "No recipes found copy=" + has2,
      { bodyExcerpt: bodyText2.slice(0, 400) });

  currentStep = 'step-03';
  await page.goto(APP + '/sign-in', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.waitForTimeout(1500);
  await shot('03-signin-form.png');
  const emailInputCount = await page.locator('input[name="identifier"]').count();
  const continueBtnCount = await page.locator('button:has-text("Continue")').count();
  log('step-03',
      (emailInputCount > 0 && continueBtnCount > 0) ? 'PASS' : 'FAIL',
      'email-input=' + emailInputCount + ', continue-btn=' + continueBtnCount);

  currentStep = 'step-04';
  try {
    await page.fill('input[name="identifier"]', EMAIL);
    await page.click('button:has-text("Continue")');
    await page.waitForSelector('input[name="password"]', { timeout: 15000 });
    await shot('04a-password-prompt.png');
    await page.fill('input[name="password"]', PASSWORD);
    await page.click('button:has-text("Continue")');
    await page.waitForURL(APP + '/', { timeout: 25000 });
    await page.waitForLoadState('networkidle').catch(()=>{});
    await shot('04b-after-login.png');
    log('step-04', 'PASS', 'redirected to ' + page.url());
  } catch (e) {
    await shot('04-FAIL.png');
    log('step-04', 'FAIL', 'signin error: ' + e.message);
    throw e;
  }

  currentStep = 'step-05';
  const bodyText5 = await page.locator('body').innerText();
  const has5a = /My Recipes/i.test(bodyText5);
  const has5b = /0 recipes in your collection/i.test(bodyText5);
  const plusBtnCandidates = [
    'header button:has-text("Add Recipe")',
    'button:has-text("Add Recipe")',
    'header button:has-text("Add")',
    'a[href="/recipes/new"]'
  ];
  let plusFound = null;
  for (const sel of plusBtnCandidates) {
    if (await page.locator(sel).count() > 0) { plusFound = sel; break; }
  }
  await shot('05-dashboard.png');
  log('step-05',
      (has5a && has5b && plusFound) ? 'PASS' : 'WARN',
      'MyRecipes=' + has5a + ', ZeroCopy=' + has5b + ', plusBtn=' + (plusFound || 'NOT FOUND'),
      { bodyExcerpt: bodyText5.slice(0, 600) });

  let recipeId = null;
  currentStep = 'step-06';
  try {
    if (!plusFound) throw new Error('No add-recipe button found in step 5');
    await page.click(plusFound);
    await page.waitForTimeout(1500);
    await shot('06-add-form-opened.png');
    // MUI Dialog with TextField — use getByLabel inside the role=dialog
    const dialog = page.getByRole('dialog');
    const dialogVisible = await dialog.count() > 0;
    let titleSel = null;
    let titleLocator = null;
    if (dialogVisible) {
      titleLocator = dialog.getByLabel(/Recipe Title/i);
      if (await titleLocator.count() > 0) titleSel = 'dialog>>label:Recipe Title';
    }
    if (!titleSel) {
      titleLocator = page.getByLabel(/Recipe Title/i);
      if (await titleLocator.count() > 0) titleSel = 'page>>label:Recipe Title';
    }
    if (!titleSel) {
      const fb = page.locator('#title, input[name="title"]').first();
      if (await fb.count() > 0) { titleLocator = fb; titleSel = 'fallback#title'; }
    }
    log('step-06', titleSel ? 'PASS' : 'FAIL',
        'title-input=' + (titleSel || 'NOT FOUND') + ', url=' + page.url());
    if (!titleSel) throw new Error('No title input found');

    currentStep = 'step-07';
    await titleLocator.first().fill('Test Pasta');
    const descByLabel = (dialogVisible ? dialog : page).getByLabel(/^Description$/i);
    if (await descByLabel.count() > 0) {
      await descByLabel.first().fill('A simple pasta dish');
    } else {
      const descCandidates = ['#description', 'textarea[id="description"]', 'textarea[name="description"]', 'textarea[placeholder*="description" i]'];
      for (const s of descCandidates) {
        if (await page.locator(s).count() > 0) { await page.fill(s, 'A simple pasta dish'); break; }
      }
    }
    const dinnerBtn = (dialogVisible ? dialog : page).getByText(/^Dinner$/).first();
    if (await dinnerBtn.count() > 0) { await dinnerBtn.click(); }
    const mealTypeNative = await page.locator('select[name="mealType"]').count();
    if (mealTypeNative > 0) {
      await page.selectOption('select[name="mealType"]', 'dinner');
    } else {
      const mealTrigger = page.locator('[role="combobox"]').first();
      if (await mealTrigger.count() > 0) {
        try {
          await mealTrigger.click();
          await page.waitForTimeout(300);
          const dinnerOpt = page.locator('[role="option"]').filter({ hasText: /dinner/i }).first();
          if (await dinnerOpt.count() > 0) await dinnerOpt.click();
          else await page.keyboard.press('Escape');
        } catch (err) {}
      }
    }
    const ingredients = ['200g pasta', '2 cloves garlic', 'olive oil'];
    const ingInputs = page.locator('input[placeholder^="Ingredient "]');
    for (let i = 0; i < ingredients.length; i++) {
      let count = await ingInputs.count();
      if (i >= count) {
        const addBtn = page.locator('button').filter({ hasText: /add ingredient/i }).first();
        if (await addBtn.count() > 0) { await addBtn.click(); await page.waitForTimeout(150); }
      }
      const target = ingInputs.nth(i);
      if (await target.count() > 0) await target.fill(ingredients[i]);
    }
    const stepsArea = page.locator('textarea[name="steps"], textarea[name="instructions"]').first();
    if (await stepsArea.count() > 0) {
      await stepsArea.fill('Boil pasta\nFry garlic\nCombine');
    } else {
      const stepInputs = page.locator('textarea[placeholder^="Step "]');
      const stepValues = ['Boil pasta', 'Fry garlic', 'Combine'];
      for (let i = 0; i < stepValues.length; i++) {
        let c = await stepInputs.count();
        if (i >= c) {
          const addStepBtn = page.locator('button').filter({ hasText: /add step/i }).first();
          if (await addStepBtn.count() > 0) { await addStepBtn.click(); await page.waitForTimeout(150); }
        }
        const t = stepInputs.nth(i);
        if (await t.count() > 0) await t.fill(stepValues[i]);
      }
    }
    await shot('07-form-filled.png');
    log('step-07', 'PASS', 'form filled (best-effort selectors)');

    currentStep = 'step-08';
    const apiRespPromise = page.waitForResponse(r => r.url().endsWith('/api/recipes') && r.request().method() === 'POST', { timeout: 15000 }).catch(() => null);
    const submitBtn = (dialogVisible ? dialog : page).locator('button').filter({ hasText: /^Create Recipe$/ }).first();
    let submitFallback = false;
    if (await submitBtn.count() === 0) { submitFallback = true; }
    const submitBtnFinal = submitFallback
      ? page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Create"), button:has-text("Submit")').first()
      : submitBtn;
    if (!submitFallback && await submitBtn.count() === 0) throw new Error('No submit button');
    await submitBtnFinal.click();
    const apiResp = await apiRespPromise;
    let apiRecipeId = null;
    let apiStatus = null;
    if (apiResp) {
      apiStatus = apiResp.status();
      try { const j = await apiResp.json(); apiRecipeId = j && (j.id || j.recipe?.id || j.data?.id); } catch {}
    }
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle').catch(() => {});
    await shot('08-after-submit.png');
    const urlAfter = page.url();
    const onDetail = /\/recipes\/[^/]+$/.test(urlAfter) && !/\/recipes\/new$/.test(urlAfter);
    if (onDetail) recipeId = urlAfter.split('/').pop();
    const bodyAfter = await page.locator('body').innerText();
    const sawTestPasta = /Test Pasta/i.test(bodyAfter);
    if (apiRecipeId) recipeId = apiRecipeId;
    log('step-08-api', (apiStatus && apiStatus < 300) ? 'PASS' : 'FAIL', 'POST /api/recipes status=' + apiStatus + ', apiRecipeId=' + (apiRecipeId || 'null'));
    log('step-08', (apiStatus && apiStatus < 300 && (sawTestPasta || apiRecipeId)) ? 'PASS' : 'FAIL',
        'url=' + urlAfter + ', onDetail=' + onDetail + ', sawTestPasta=' + sawTestPasta + ', recipeId=' + (recipeId || 'null'));

    currentStep = 'step-09';
    if (!onDetail) {
      await page.goto(APP + '/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(800);
      await shot('08b-back-on-dashboard.png');
      const card = page.locator('a').filter({ hasText: /Test Pasta/i }).first();
      if (await card.count() > 0) {
        await card.click();
        await page.waitForLoadState('networkidle').catch(()=>{});
        await page.waitForTimeout(800);
      } else if (recipeId) {
        await page.goto(APP + '/recipes/' + recipeId, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(800);
      }
    }
    const detailUrl = page.url();
    const m = detailUrl.match(/\/recipes\/([^/?#]+)/);
    if (m) recipeId = m[1];
    await shot('09-detail-page.png');
    const detailBody = await page.locator('body').innerText();
    const sawTitle9 = /Test Pasta/i.test(detailBody);
    const sawIng9 = /200g pasta|olive oil|garlic/i.test(detailBody);
    const sawStep9 = /Boil pasta|Fry garlic/i.test(detailBody);
    log('step-09',
        (sawTitle9 && sawIng9 && sawStep9) ? 'PASS' : 'WARN',
        'url=' + detailUrl + ', title=' + sawTitle9 + ', ing=' + sawIng9 + ', steps=' + sawStep9 + ', recipeId=' + recipeId);

    currentStep = 'step-10';
    // Edit button is an MUI IconButton with <Edit /> icon (no visible text). Try multiple locators.
    const editBtnCandidates = [
      'button:has([data-testid="EditIcon"])',
      'button[aria-label*="edit" i]',
      'a[href*="edit"]',
      'a:has-text("Edit")',
      'button:has-text("Edit")'
    ];
    let editLoc = null;
    let editSelUsed = null;
    for (const sel of editBtnCandidates) {
      const c = await page.locator(sel).count();
      if (c > 0) { editLoc = page.locator(sel).first(); editSelUsed = sel; break; }
    }
    if (!editLoc) {
      log('step-10', 'FAIL', 'No edit button on detail page (tried: ' + editBtnCandidates.join(' | ') + ')');
    } else {
      await editLoc.click();
      await page.waitForTimeout(1500);
      await shot('10a-edit-form.png');
      // Edit modal is the same MUI Dialog as create. Find title via getByLabel inside the dialog.
      const editDialog = page.getByRole('dialog');
      const editDialogVisible = await editDialog.count() > 0;
      let editTitleLoc = null;
      if (editDialogVisible) {
        const cand = editDialog.getByLabel(/Recipe Title/i);
        if (await cand.count() > 0) editTitleLoc = cand.first();
      }
      if (!editTitleLoc) {
        const fb = page.locator('#title, input[name="title"]').first();
        if (await fb.count() > 0) editTitleLoc = fb;
      }
      if (!editTitleLoc) {
        log('step-10', 'FAIL', 'No title input on edit modal (editSelUsed=' + editSelUsed + ', dialogVisible=' + editDialogVisible + ')');
      } else {
        await editTitleLoc.fill('Test Pasta v2');
        const updateRespPromise = page.waitForResponse(r => r.url().includes('/api/recipes/') && r.request().method() === 'PUT', { timeout: 15000 }).catch(() => null);
        const saveBtn = (editDialogVisible ? editDialog : page).locator('button').filter({ hasText: /Update Recipe|^Update$|^Save$/ }).first();
        const saveBtnFinal = (await saveBtn.count() > 0)
          ? saveBtn
          : page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Update")').first();
        await saveBtnFinal.click();
        const upResp = await updateRespPromise;
        if (upResp) {
          log('step-10-api', upResp.status() < 300 ? 'PASS' : 'FAIL', 'PUT /api/recipes/'+recipeId+' status=' + upResp.status());
        } else {
          log('step-10-api', 'WARN', 'no PUT /api/recipes/[id] observed');
        }
        await page.waitForLoadState('networkidle').catch(()=>{});
        await page.waitForTimeout(1500);
        await shot('10b-after-edit.png');
        const afterEditUrl = page.url();
        if (recipeId) { await page.goto(APP + '/recipes/' + recipeId, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(800); await shot('10c-detail-after-edit.png'); }
        const afterBody = await page.locator('body').innerText();
        const sawV2 = /Test Pasta v2/i.test(afterBody);
        log('step-10', sawV2 ? 'PASS' : 'FAIL', 'after-edit-url=' + page.url() + ', sawV2=' + sawV2);
      }
    }

    currentStep = 'step-11';
    await page.goto(APP + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
    await shot('11-dashboard-after-edit.png');
    const dashBody11 = await page.locator('body').innerText();
    const sawV2Dash = /Test Pasta v2/i.test(dashBody11);
    log('step-11', sawV2Dash ? 'PASS' : 'FAIL', 'sawV2OnDashboard=' + sawV2Dash);
  } catch (e) {
    await shot(currentStep + '-ERROR.png');
    log(currentStep, 'FAIL', 'exception: ' + e.message);
  }

  let planId = null;
  currentStep = 'step-12';
  await page.goto(APP + '/meal-plans', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await shot('12-mealplans-empty.png');
  const body12 = await page.locator('body').innerText();
  const has12a = /No meal plans yet/i.test(body12);
  log('step-12', has12a ? 'PASS' : 'FAIL', "No meal plans yet copy=" + has12a,
      { bodyExcerpt: body12.slice(0, 400) });

  currentStep = 'step-13';
  try {
    const r = await page.evaluate(async () => {
      const res = await fetch('/api/meal-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Week', startDate: '2026-05-04', endDate: '2026-05-10' })
      });
      let body;
      try { body = await res.json(); } catch (e) { body = await res.text(); }
      return { status: res.status, body };
    });
    if (r.status >= 200 && r.status < 300) {
      planId = (r.body && (r.body.id || (r.body.mealPlan && r.body.mealPlan.id) || (r.body.data && r.body.data.id))) || null;
      log('step-13', planId ? 'PASS' : 'WARN',
          'status=' + r.status + ', planId=' + (planId || 'NOT FOUND IN BODY'),
          { bodyJson: JSON.stringify(r.body).slice(0, 500) });
    } else {
      log('step-13', 'FAIL', 'status=' + r.status,
          { bodyJson: JSON.stringify(r.body).slice(0, 500) });
    }
  } catch (e) {
    log('step-13', 'FAIL', 'exception: ' + e.message);
  }

  currentStep = 'step-14';
  await page.goto(APP + '/meal-plans', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await shot('14-mealplans-after-create.png');
  const body14 = await page.locator('body').innerText();
  const sawTestWeek = /Test Week/i.test(body14);
  log('step-14', sawTestWeek ? 'PASS' : 'FAIL', 'sawTestWeek=' + sawTestWeek,
      { bodyExcerpt: body14.slice(0, 400) });

  currentStep = 'step-15';
  if (planId) {
    await page.goto(APP + '/meal-plans/' + planId, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
    await shot('15-plan-detail.png');
    const body15 = await page.locator('body').innerText();
    const sawNoMeals = /No meals planned yet/i.test(body15);
    log('step-15', sawNoMeals ? 'PASS' : 'FAIL', "No meals planned yet copy=" + sawNoMeals + ', url=' + page.url(),
        { bodyExcerpt: body15.slice(0, 400) });
  } else {
    log('step-15', 'SKIP', 'no planId from step 13');
  }

  currentStep = 'step-16';
  if (planId && recipeId) {
    try {
      const r2 = await page.evaluate(async (args) => {
        const res = await fetch('/api/meal-plans/' + args.planId + '/meals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipeId: args.recipeId, scheduledDate: '2026-05-06', mealType: 'dinner', servings: 4 })
        });
        let body;
        try { body = await res.json(); } catch (e) { body = await res.text(); }
        return { status: res.status, body };
      }, { planId, recipeId });
      log('step-16',
          (r2.status >= 200 && r2.status < 300) ? 'PASS' : 'FAIL',
          'status=' + r2.status,
          { bodyJson: JSON.stringify(r2.body).slice(0, 500) });
    } catch (e) {
      log('step-16', 'FAIL', 'exception: ' + e.message);
    }
  } else {
    log('step-16', 'SKIP', 'missing ids planId=' + planId + ', recipeId=' + recipeId);
  }

  currentStep = 'step-17';
  if (planId) {
    await page.goto(APP + '/meal-plans/' + planId, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
    await shot('17-plan-detail-with-meal.png');
    const body17 = await page.locator('body').innerText();
    const sawPasta17 = /Test Pasta/i.test(body17);
    const sawPlanned = /planned/i.test(body17);
    log('step-17', (sawPasta17 && sawPlanned) ? 'PASS' : 'WARN',
        'sawTestPasta=' + sawPasta17 + ', sawPlannedStatus=' + sawPlanned,
        { bodyExcerpt: body17.slice(0, 600) });
  } else {
    log('step-17', 'SKIP', 'no planId');
  }

  currentStep = 'step-18';
  await page.goto(APP + '/shopping-list', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await shot('18-shopping-list-empty.png');
  const body18 = await page.locator('body').innerText();
  const sawAvailable = /Available meal plans|Test Week/i.test(body18);
  log('step-18', sawAvailable ? 'PASS' : 'WARN',
      'sawAvailableOrPlan=' + sawAvailable,
      { bodyExcerpt: body18.slice(0, 600) });

  currentStep = 'step-19';
  if (planId) {
    try {
      const r3 = await page.evaluate(async (args) => {
        const res = await fetch('/api/shopping-list/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mealPlanId: args.planId })
        });
        let body;
        try { body = await res.json(); } catch (e) { body = await res.text(); }
        return { status: res.status, body };
      }, { planId });
      log('step-19', (r3.status >= 200 && r3.status < 300) ? 'PASS' : 'FAIL',
          'status=' + r3.status,
          { bodyJson: JSON.stringify(r3.body).slice(0, 500) });
    } catch (e) {
      log('step-19', 'FAIL', 'exception: ' + e.message);
    }
  } else {
    log('step-19', 'SKIP', 'no planId');
  }

  currentStep = 'step-20';
  await page.goto(APP + '/shopping-list', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await shot('20-shopping-list-with-items.png');
  const body20 = await page.locator('body').innerText();
  const sawPasta20 = /pasta/i.test(body20);
  const sawGarlic20 = /garlic/i.test(body20);
  const sawOlive20 = /olive oil/i.test(body20);
  const cnt = [sawPasta20, sawGarlic20, sawOlive20].filter(Boolean).length;
  log('step-20', cnt === 3 ? 'PASS' : 'WARN',
      'pasta=' + sawPasta20 + ', garlic=' + sawGarlic20 + ', olive=' + sawOlive20 + ', items=' + cnt + '/3',
      { bodyExcerpt: body20.slice(0, 600) });

  currentStep = 'step-21';
  const r21 = await page.goto(APP + '/brisket', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await shot('21-brisket-404.png');
  log('step-21', r21.status() === 404 ? 'PASS' : 'FAIL', 'status=' + r21.status());

  currentStep = 'step-22';
  const r22 = await page.goto(APP + '/categories', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await shot('22-categories-404.png');
  log('step-22', r22.status() === 404 ? 'PASS' : 'FAIL', 'status=' + r22.status());

} catch (fatal) {
  console.error('FATAL:', fatal.stack || fatal.message);
} finally {
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ results, allConsole, allNetworkFails }, null, 2));
  console.log('=== RESULTS ===');
  results.forEach(r => console.log(r.status + '\t' + r.step + '\t' + r.msg));
  console.log('=== CONSOLE/PAGE ERRORS ===');
  allConsole.forEach(c => console.log('[' + c.step + '] (' + c.type + ') ' + c.text.slice(0, 250)));
  console.log('=== NETWORK 4xx/5xx ===');
  allNetworkFails.forEach(n => console.log('[' + n.step + '] ' + n.status + ' ' + n.url));
  await browser.close();
}
