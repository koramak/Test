// Regenerates the reference screenshots in ../design/current-screens for the design
// brief: every screen at iPhone 16 Pro size (393x852, 2x) with representative history.
// Usage: node screens.js
const path = require('path');
const { chromium } = require('playwright-core');
const file = path.join(__dirname, '..', 'workout-tracker.html');
const out = path.join(__dirname, '..', 'design', 'current-screens');
const day = (n) => new Date(Date.now() - n * 864e5).toISOString();
const set = (weight, reps, extra = {}) => ({ weight, reps, completed: true, ...extra });
const entry = (name, sets, n, extra = {}) => ({ exerciseName: name, usedAlt: false, weight: (sets.find(s => !s.warmup) || sets[0]).weight, sets, date: day(n), skipped: false, ...extra });
const dl = (w, r, n, extra) => entry('Conventional Deadlift', [set(Math.round(w * 0.5), 5, { warmup: true }), set(Math.round(w * 0.75), 3, { warmup: true }), set(w, r), set(w, r), set(w, r - 1)], n, extra);
const three = (name, w, reps, n, extra) => entry(name, reps.map(r => set(w, r)), n, extra);
const seed = {
  day1: { sessions: [{ date: day(11), absDone: true, durationMin: 47 }], exercises: {
    log_press: [entry('Log Strict Press', [set(55, 5, { warmup: true }), set(95, 5), set(95, 4), set(95, 4)], 11)] } },
  day2: { sessions: [40, 30, 20, 10].map(n => ({ date: day(n), absDone: n !== 30, durationMin: 52 })), exercises: {
    deadlift: [dl(215, 6, 40), dl(225, 5, 30, { notes: 'belt too loose, tighten before set 2' }), dl(230, 5, 20), dl(235, 5, 10)],
    hack_squat: [entry('Hack Squat', [set(110, 8, { warmup: true }), set(180, 9), set(180, 8), set(180, 8)], 10)],
    leg_curl: [three('Leg Curl', 90, [11, 10, 9], 10)], leg_ext: [three('Leg Extension', 100, [13, 12, 12], 10)],
    farmers_walk: [three("Farmer's Walk", 70, [60, 60, 55], 10)] } },
  day3: { sessions: [23, 16, 9].map(n => ({ date: day(n), absDone: true, durationMin: 50, prs: n === 9 ? ['EZ Bar Curl'] : [] })), exercises: {
    lean_tri_ext: [three('Leaning Tricep Extension', 30, [10, 9, 8], 23), three('Leaning Tricep Extension', 30, [12, 11, 10], 16), three('Leaning Tricep Extension', 30, [13, 12, 12], 9, { notes: 'rope, step out one pace' })],
    high_rep_curl: [three('EZ Bar Curl', 55, [7, 6, 6], 23), three('EZ Bar Curl', 55, [8, 8, 7], 16), three('EZ Bar Curl', 55, [9, 8, 8], 9)],
    incline_db: [23, 16, 9].map((n, k) => entry('Incline Dumbbell Press (30°)', [set(30, 10, { warmup: true }), set(50, 7 + k), set(50, 7 + k), set(50, 6 + k)], n)),
    lateral_raise: [entry('Lateral Raise + Bent-Over Fly', [set(10, 8), set(10, 7)], 9, { effort: 'easy' })] } }
};
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.addInitScript((v) => { if (!localStorage.getItem('seeded')) { localStorage.setItem('workoutLog_4day', v); localStorage.setItem('seeded', '1'); } }, JSON.stringify(seed));
  const page = await ctx.newPage();
  page.on('dialog', d => d.accept());
  const shot = async (name) => { await page.waitForTimeout(150); await page.screenshot({ path: path.join(out, name + '.png') }); console.log('wrote', name + '.png'); };
  const tap = (text) => page.click(`text=${text}`);
  await page.goto('file://' + file); await page.waitForSelector('text=Choose Your Program');
  await shot('program_select');
  await tap('Strongman Hypertrophy'); await shot('home');
  await tap('Upper Power'); await shot('day_overview');
  await page.click('.info-btn'); await shot('day_overview_info_sheet'); await tap('Close');
  await tap('Back'); await tap('Upper Size');
  await tap('Leaning Tricep Extension'); await page.waitForSelector('.set-row');
  await page.click('.set-row button'); await page.click('.effort-chips button');
  await shot('exercise_superset_pair');
  await page.click('button.p-1'); await tap('Back');
  await tap('Lower Power'); await shot('day_overview_lower_power');
  await tap('Begin Workout'); await page.waitForSelector('text=LOG YOUR SETS');
  for (const b of (await page.$$('.set-row')).slice(0, 3)) await (await b.$('button')).click();
  await shot('exercise_deadlift_with_history');
  for (let i = 0; i < 6 && await page.$('.set-row'); i++) await page.click('button:has-text("›")');
  await shot('summary_6_exercises');
  await tap('Complete workout'); await shot('complete');
  await tap('Done'); await tap('History'); await shot('history');
  await page.click('.history-row >> nth=1'); await shot('history_session');
  await browser.close();
})();
