// Measures rendered section heights of each screen at iPhone 16 Pro size
// (393x852 CSS px, standalone). Usable height = 852 - 59 (top inset) - 34 (home indicator) = 759.
// Usage: node measure.js [path-to-html] [--shot]
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright-core');
const file = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : path.join(__dirname, '..', 'workout-tracker.html');
const shot = process.argv.includes('--shot');
const USABLE = 852 - 59 - 34;

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  if (process.argv.includes('--seed')) {
    const day = (n) => new Date(Date.now() - n * 864e5).toISOString();
    const entry = (w, r, n, extra = {}) => ({ exerciseName: 'x', usedAlt: false, weight: w, sets: [{ weight: Math.round(w*0.5), reps: 5, completed: true, warmup: true }, { weight: Math.round(w*0.7), reps: 3, completed: true, warmup: true }, { weight: w, reps: r, completed: true }, { weight: w, reps: r, completed: true }, { weight: w, reps: r, completed: true }], date: day(n), skipped: false, ...extra });
    const seed = { day2: { exercises: { deadlift: [entry(215, 6, 40), entry(225, 5, 30, { notes: 'belt too loose, tighten before set 2' }), entry(230, 5, 20), entry(235, 4, 10)] }, sessions: [{ date: day(10), absDone: true }, { date: day(20), absDone: true }, { date: day(30), absDone: false }] } };
    await ctx.addInitScript((v) => { localStorage.setItem('workoutLog_4day', v); }, JSON.stringify(seed));
  }
  await page.goto('file://' + file, { waitUntil: 'load' });
  await page.waitForSelector('#root button', { timeout: 20000 });

  const report = async (label) => {
    const r = await page.evaluate(() => {
      const root = document.getElementById('root');
      const first = root.firstElementChild;
      const inner = first && first.firstElementChild;
      const kids = inner ? [...inner.children] : [];
      const isFixed = (el) => getComputedStyle(el).position === 'fixed';
      let contentBottom = 0, fixedH = 0;
      for (const k of kids) {
        const rect = k.getBoundingClientRect();
        if (isFixed(k)) fixedH = Math.max(fixedH, rect.height); else contentBottom = Math.max(contentBottom, rect.bottom);
      }
      return {
        contentBottom: Math.round(contentBottom), fixedH: Math.round(fixedH),
        sections: kids.map(k => ({ tag: k.tagName, cls: (k.className || '').toString().slice(0, 40), h: Math.round(k.getBoundingClientRect().height), fixed: isFixed(k), text: (k.textContent || '').trim().slice(0, 40) }))
      };
    });
    // Standalone iPhone 16 Pro: 59px top inset is added by CSS env() on device (not in emulation),
    // fixed bars sit above the 34px home indicator. Content must end above the fixed bar.
    const need = r.contentBottom + 59;
    const limit = 852 - 34 - (r.fixedH ? r.fixedH + 8 : 0);
    const over = need - limit;
    console.log(`\n== ${label}: content needs ${need}px, limit ${limit}px → ${over > 0 ? 'OVERFLOWS by ' + over + 'px' : 'FITS (' + (-over) + 'px spare)'}`);
    for (const s of r.sections) console.log(`   ${String(s.h).padStart(4)}px${s.fixed ? '*' : ' '} ${s.tag.toLowerCase().padEnd(8)} ${s.cls.padEnd(40)} ${s.text}`);
    if (shot) await page.screenshot({ path: path.join(__dirname, `shot-${label.replace(/\W+/g, '_')}.png`), fullPage: true });
  };

  const click = async (text) => {
    const h = await page.$$('button');
    for (const b of h) { const t = (await b.textContent()).replace(/\s+/g, ' ').trim(); if (t.includes(text)) { await b.click(); await page.waitForTimeout(400); return true; } }
    return false;
  };

  await report('program-select');
  await click('Strongman');
  await report('home');
  await click('Upper Power');
  await report('day-overview');
  // jump into exercise 1 (deadlift-style days have 5 set rows; use Lower Power for worst case)
  await click('Back'); await click('Lower Power');
  await report('day-overview-9-exercises');
  await page.click('.exercise-row'); await page.waitForTimeout(500);
  await report(process.argv.includes('--seed') ? 'exercise-deadlift-5-sets-WITH-history' : 'exercise-deadlift-5-sets');
  // Walk to summary and complete (worst case: 6-exercise day)
  for (let i = 0; i < 8; i++) { const ok = await click('›'); if (!ok) break; }
  await page.waitForTimeout(400);
  await report('summary-6-exercises');
  await click('Complete workout');
  await page.waitForTimeout(600);
  await report('complete');
  await browser.close();
})();
