// Data-preservation test: seeds OLD-format history (4-day layout, keyed by the old day
// numbers) and verifies the 6-day rotation still finds it, that derived light lifts
// follow the heavy lift, and that the stall reset + double-jump rules fire.
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');
const html = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', 'workout-tracker.html'), 'utf8');
const day = (n) => new Date(Date.now() - n * 864e5).toISOString();
const entry = (weight, reps, daysAgo, extra = {}) => ({
  exerciseName: 'x', usedAlt: false, weight,
  sets: [{ weight: Math.round(weight * 0.5), reps: 5, completed: true, warmup: true }, { weight, reps, completed: true }, { weight, reps, completed: true }, { weight, reps, completed: true }],
  date: day(daysAgo), skipped: false, ...extra
});
const seed = {
  '4day': {
    // Old day2 held leg_curl history; old day4 held squat + leg_curl history.
    day2: { exercises: { leg_curl: [entry(90, 8, 20, { notes: 'hamstring cramp on set 3' })], deadlift: [entry(225, 5, 30), entry(225, 5, 20), entry(225, 5, 12), entry(225, 5, 4)] }, sessions: [{ date: day(20), absDone: true }, { date: day(4), absDone: true }] },
    day4: { exercises: { squat: [entry(155, 8, 9)], leg_curl: [entry(95, 10, 9)] }, sessions: [{ date: day(9), absDone: false }] }
  }
};
const vc = new VirtualConsole(); vc.on('jsdomError', () => {});
const dom = new JSDOM(html, {
  runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://example.com/', virtualConsole: vc,
  beforeParse(window) { window.localStorage.setItem('workoutLog_4day', JSON.stringify(seed['4day'])); }
});
const wait = (ms) => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (name, cond) => { console.log((cond ? 'PASS' : 'FAIL') + ' ' + name); cond ? pass++ : fail++; };
(async () => {
  await wait(5000);
  const root = dom.window.document.getElementById('root');
  const btn = (t) => [...root.querySelectorAll('button')].find(b => b.textContent.replace(/\s+/g, ' ').trim().includes(t));
  const txt = () => root.textContent;
  if (txt().includes('Choose Your Program')) { btn('Strongman').click(); await wait(500); }
  ok('home lists 6 days', txt().includes('Day 6'));
  ok('consistency widget sees seeded sessions', txt().includes('LAST 8 WEEKS') && txt().includes('3 total'));

  // Lower Size (new day4): squat history from old day4 must show; light deadlift derived from deadlift (225 -> 175)
  btn('Lower Size').click(); await wait(500);
  const rowText = [...root.querySelectorAll('.exercise-row')].map(r => r.textContent).join(' | ');
  ok('squat row shows old history (155 lbs)', /Barbell Squat[^|]*155 lbs/.test(rowText));
  const rows = [...root.querySelectorAll('.exercise-row')];
  rows[1].click(); await wait(500);
  ok('light deadlift is derived: 78% of 225 = 175', txt().includes('78% of your Conventional Deadlift (225 lb)') && [...root.querySelectorAll('button')].some(b => b.className.includes('w-9 h-11')) && txt().includes('175'));
  // header back (chevron icon) -> day overview -> home
  root.querySelector('button.p-1').click(); await wait(300);
  btn('Back').click(); await wait(300);
  btn('Lower Power').click(); await wait(500);
  const rowText2 = [...root.querySelectorAll('.exercise-row')].map(r => r.textContent).join(' | ');
  ok('leg curl history follows the exercise across days (latest = 95 lbs)', /Leg Curl[^|]*95 lbs/.test(rowText2));
  const rows2 = [...root.querySelectorAll('.exercise-row')];
  rows2[0].click(); await wait(500);
  ok('deadlift stall reset fires after 4 flat sessions (225 -> 205)', txt().includes('Stalled 3 sessions') && txt().includes('205'));
  const nextBtn = btn('›'); nextBtn.click(); await wait(400);
  ok('light squat derived: 78% of 155 = 120', txt().includes('78% of your Barbell Squat (155 lb)') && txt().includes('120'));
  // "?" info sheet for a derived exercise borrows the parent's description
  root.querySelector('button.p-1').click(); await wait(300);
  [...root.querySelectorAll('.exercise-row')][1].querySelector('.info-btn').click(); await wait(300);
  ok('info sheet for light squat shows squat description', !!root.querySelector('.info-sheet') && root.querySelector('.info-sheet').textContent.length > 80);
  btn('Close').click(); await wait(200);

  // CSV import: an export from the OLD 4-day program (old names, old day keys) rebuilds history
  dom.window.confirm = () => true; dom.window.alert = () => {};
  btn('Back').click(); await wait(300);
  const csv = [
    'Date,Day,Exercise,Variant,Set,Warmup,Weight,Reps,Completed,Skipped,Notes',
    '8/1/2026,day1,Log Press,Main,1,Yes,55,5,Yes,No,""',
    '8/1/2026,day1,Log Press,Main,2,No,105,5,Yes,No,"felt strong, add 5"',
    '8/1/2026,day1,Log Press,Main,3,No,105,5,Yes,No,"felt strong, add 5"',
    '8/1/2026,day1,Log Press,Main,4,No,105,4,Yes,No,"felt strong, add 5"',
    '8/1/2026,day1,Incline Dumbbell Press (30°),Main,1,Yes,30,10,Yes,No,""',
    '8/1/2026,day1,Incline Dumbbell Press (30°),Main,2,No,60,10,Yes,No,""',
    '8/1/2026,day1,Incline Dumbbell Press (30°),Main,3,No,60,9,Yes,No,""',
    '8/1/2026,day1,Incline Dumbbell Press (30°),Main,4,No,60,8,Yes,No,""',
    '8/1/2026,day1,Preacher Curl,Main,1,No,50,10,Yes,No,""',
    '8/1/2026,day1,Ab Routine (pre-workout),Main,1,No,0,0,Yes,No,""',
    '8/3/2026,day3,Rope Pushdown,Main,1,No,40,15,Yes,No,""',
    '8/3/2026,day3,Some Exercise Nobody Knows,Main,1,No,1,1,Yes,No,""'
  ].join('\n');
  const input = root.querySelector('input.csv-import');
  const file = new dom.window.File([csv], 'export.csv', { type: 'text/csv' });
  Object.defineProperty(input, 'files', { value: [file] });
  input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  await wait(800);
  const stored = JSON.parse(dom.window.localStorage.getItem('workoutLog_4day'));
  const lp = stored?.day1?.exercises?.log_press?.[0];
  ok('csv: log press entry rebuilt with 1 warm-up + 3 working sets', !!lp && lp.sets.length === 4 && lp.sets[0].warmup === true && lp.weight === 105 && lp.notes === 'felt strong, add 5');
  ok('csv: incline DB (old day1) rebuilt', stored?.day1?.exercises?.incline_db?.[0]?.weight === 60);
  ok('csv: retired name (Preacher Curl) kept under old id', !!stored?.day1?.exercises?.preacher_curl);
  ok('csv: ab routine row became a session with absDone', stored?.day1?.sessions?.some(s => s.absDone === true));
  ok('csv: unknown exercise skipped, nothing crashed', !JSON.stringify(stored).includes('Nobody Knows'));
  btn('Upper Power').click(); await wait(500);
  const rowsCsv = [...root.querySelectorAll('.exercise-row')].map(r => r.textContent).join(' | ');
  ok('csv: imported log press history shows on the new Upper Power day (105 lbs)', /Log Strict Press[^|]*105 lbs/.test(rowsCsv));
  console.log(`${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
