// Engine and data-safety rules for workout-tracker.html. Each case boots a fresh app
// with its own seeded history, so the cases cannot leak into each other.
// Usage: node engine.js [path-to-html]
process.env.TZ = 'America/Los_Angeles'; // evening workouts cross the UTC date line here
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');
const html = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', 'workout-tracker.html'), 'utf8');
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const day = (n) => new Date(Date.now() - n * 864e5).toISOString();
const set = (weight, reps, completed = true, extra = {}) => ({ weight, reps, completed, ...extra });
const entry = (sets, daysAgo, extra = {}) => ({ exerciseName: 'x', usedAlt: false, weight: (sets.find(s => !s.warmup) || sets[0]).weight, sets, date: day(daysAgo), skipped: false, ...extra });
let pass = 0, fail = 0;
const ok = (name, cond) => { console.log((cond ? 'PASS' : 'FAIL') + ' ' + name); cond ? pass++ : fail++; };

// storage: { key: value } written to localStorage before the app starts
const boot = async (storage = {}) => {
  const vc = new VirtualConsole(); vc.on('jsdomError', () => {});
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://example.com/', virtualConsole: vc,
    beforeParse(window) { Object.entries(storage).forEach(([k, v]) => window.localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v))); }
  });
  await wait(400);
  const w = dom.window;
  const root = w.document.getElementById('root');
  const app = {
    w, root,
    txt: () => root.textContent,
    btn: (t) => [...root.querySelectorAll('button')].find(b => b.textContent.replace(/\s+/g, ' ').trim().includes(t)),
    click: async (t) => { app.btn(t).click(); await wait(150); },
    rows: () => [...root.querySelectorAll('.exercise-row')],
    openExercise: async (name) => { app.rows().find(r => r.textContent.includes(name)).click(); await wait(200); },
    nums: () => [...root.querySelectorAll('.set-value')].map(d => d.textContent).join(','),
    verdict: () => (root.querySelector('.verdict') || {}).textContent,
    verdicts: () => [...root.querySelectorAll('.verdict')].map(v => v.textContent).join('|'),
    reason: () => [...root.querySelectorAll('.verdict')].map(v => v.getAttribute('data-reason')).join('|'),
    next: async () => { root.querySelector('.nav-next').click(); await wait(150); },
    prev: async () => { root.querySelector('.nav-prev').click(); await wait(150); },
    stored: (k) => JSON.parse(w.localStorage.getItem(k)),
    importFile: async (text, name) => {
      const input = root.querySelector('input.csv-import');
      Object.defineProperty(input, 'files', { value: [new w.File([text], name)], configurable: true });
      input.dispatchEvent(new w.Event('change', { bubbles: true }));
      await wait(400);
    }
  };
  w.alert = () => {};
  w.confirm = () => true;
  return app;
};
const log4 = (days) => ({ lastProgram: '4day', workoutLog_4day: days });

(async () => {
  // 1. Unchecked rows keep their pre-filled reps; they must not count as performed
  {
    const a = await boot(log4({ day3: { exercises: { cable_row: [entry([set(120, 6), set(120, 12, false), set(120, 12, false)], 3)] }, sessions: [{ date: day(3) }] } }));
    await a.click('Upper Size'); await a.openExercise('Cable Row');
    ok('partial session: only the checked set counts (6 reps -> drop, not "maintain" on a phantom average)', a.reason().includes('Below 8 reps → Drop 5 lbs') && a.verdict() === 'Lower weight');
    ok('partial session: lower weight pre-fills at the bottom of the range', a.nums() === '115,8,115,8,115,8');
  }
  // 2. Suggestion reaches the set rows + 3. "every set" means every set
  {
    const a = await boot(log4({
      day3: { exercises: { incline_machine: [entry([set(120, 12), set(120, 12), set(120, 12)], 3)] }, sessions: [{ date: day(3) }] },
      day5: { exercises: { cable_row: [entry([set(120, 14), set(120, 12), set(120, 10)], 2)] }, sessions: [{ date: day(2) }] }
    }));
    await a.click('Upper Size'); await a.openExercise('Incline Machine Press');
    ok('hit the top on every set: banner says add 5', a.reason().includes('Hit 12+ on every set → Add 5 lbs') && a.verdict() === 'Raise weight');
    ok('hit the top on every set: rows pre-fill 125 x 8', a.nums() === '125,8,125,8,125,8');
    a.root.querySelector('.nav-back').click(); await wait(150);
    await a.openExercise('Cable Row');
    ok('14/12/10 on an 8-12 range averages 12 but does NOT add weight', a.verdict() === 'Hold' && a.nums() === '120,12,120,12,120,12');
    a.root.querySelector('.nav-back').click(); await wait(150);
    a.rows().find(r => r.textContent.includes('Cable Row')).querySelector('.info-btn').click(); await wait(150);
    ok('info sheet uses the day\'s own rep range (8-12, not the base 10-12)', a.root.querySelector('.info-sheet').textContent.includes('8-12 reps'));
  }
  // 4. Light lifts follow the heavy lift every session, not just the first
  {
    const a = await boot(log4({
      day4: { exercises: { squat: [entry([set(155, 5), set(155, 5), set(155, 5)], 5)] }, sessions: [{ date: day(5) }] },
      day2: { exercises: { squat_light: [entry([set(60, 5, true, { warmup: true }), set(100, 5), set(100, 5)], 9)] }, sessions: [{ date: day(9) }] }
    }));
    await a.click('Lower Power'); await a.openExercise('Light Squat');
    ok('light squat with its own history still pre-fills 78% of the squat (120, not last time\'s 100)', a.nums().split(',')[2] === '120');
  }
  // 5. Stall reset fires once, pre-fills, and does not fire again on the reset session
  {
    const flat = (w, n) => entry([set(w, 5), set(w, 5), set(w, 5)], n);
    const a = await boot(log4({ day2: { exercises: { deadlift: [flat(225, 30), flat(225, 20), flat(225, 12), flat(225, 4)] }, sessions: [{ date: day(4) }] } }));
    await a.click('Lower Power'); await a.openExercise('Conventional Deadlift');
    ok('stall reset pre-fills the working rows at 205', a.reason().includes('Stalled 3 sessions') && a.nums().split(',').slice(4, 6).join() === '205,6');
    const b = await boot(log4({ day2: { exercises: { deadlift: [flat(225, 30), flat(225, 20), flat(225, 12), flat(205, 4)] }, sessions: [{ date: day(4) }] } }));
    await b.click('Lower Power'); await b.openExercise('Conventional Deadlift');
    ok('the session after a reset is not treated as another stall', !b.reason().includes('Stalled') && b.verdict() === 'Hold' && b.nums().split(',')[4] === '205');
  }
  // 6. CSV: quotes in notes survive, dates are locale-proof, re-import adds nothing
  {
    const evening = '2026-10-05T03:30:00.000Z'; // Oct 4, 8:30 pm in Los Angeles
    const seed = { day3: { exercises: { cable_row: [{ ...entry([set(120, 10), set(120, 9)], 0), date: evening, exerciseName: 'Cable Row', notes: 'felt "snappy", add 5' }] }, sessions: [{ date: evening, absDone: true }] } };
    const a = await boot(log4(seed));
    let blob = null;
    a.w.URL.createObjectURL = (b) => { blob = b; return 'blob:x'; };
    await a.click('Export CSV');
    const csv = await new Promise(res => { const fr = new a.w.FileReader(); fr.onload = () => res(fr.result); fr.readAsText(blob); });
    ok('csv export: date is the local calendar day, YYYY-MM-DD', csv.includes('\n2026-10-04,day3,Cable Row,'));
    ok('csv export: quotes inside a note are escaped', csv.includes('"felt ""snappy"", add 5"'));
    let msg = '';
    a.w.confirm = (m) => { msg = m; return true; };
    await a.importFile(csv, 'export.csv');
    ok('csv re-import into the same log adds nothing (evening workout is not duplicated)', msg.includes('Import 0 exercise entries') && a.stored('workoutLog_4day').day3.exercises.cable_row.length === 1);
    const fresh = await boot({ lastProgram: '4day' });
    await fresh.importFile(csv, 'export.csv');
    const back = fresh.stored('workoutLog_4day')?.day3?.exercises?.cable_row?.[0];
    ok('csv import into an empty log restores sets and the note verbatim', !!back && back.sets.length === 2 && back.notes === 'felt "snappy", add 5');
  }
  // 7. Reload mid-workout reopens the day with a Resume button; otherwise the last program opens
  {
    const ids = ['incline_db', 'cable_row', 'incline_machine', 'lean_tri_ext', 'high_rep_curl', 'lateral_raise'];
    const session = { program: '4day', day: 'day3', sessionData: { 0: { sets: [set(55, 9), set(55, 8, false)], notes: '' } }, useAltExercise: {}, absDone: true, startedAt: day(0), savedAt: new Date().toISOString(), exerciseIds: ids };
    const a = await boot({ activeWorkoutSession: session });
    ok('reload mid-workout lands on that day with a Resume button', a.txt().includes('Upper Size') && !!a.btn('Resume Workout'));
    await a.click('Resume Workout');
    ok('resume restores the logged set', a.nums().startsWith('55,9,55,8'));
    const stale = await boot({ activeWorkoutSession: { ...session, exerciseIds: ['something_else'] } });
    ok('a checkpoint from a different exercise list is ignored', stale.txt().includes('Choose Your Program'));
    const home = await boot({ lastProgram: '4day' });
    ok('last-used program opens straight to its home screen', home.txt().includes('Strongman Hypertrophy') && !home.txt().includes('Choose Your Program'));
  }
  // 8. A failed save is visible, and the backup still contains the workout
  {
    const a = await boot({ lastProgram: '4day' });
    a.w.Storage.prototype.setItem = () => { throw new Error('QuotaExceededError'); };
    await a.click('Upper Power'); await a.click('Begin Workout');
    a.root.querySelector('button.w-9.h-11').click(); await wait(100);
    for (let i = 0; i < 8 && a.root.querySelector('.nav-next'); i++) await a.next();
    ok('summary shows the working weight, not the warm-up weight', a.txt().includes('1/4 sets · 95 lbs'));
    await a.click('Complete workout');
    ok('failed save shows a warning on the complete screen', !!a.root.querySelector('.storage-warning'));
    let blob = null;
    a.w.URL.createObjectURL = (b) => { blob = b; return 'blob:x'; };
    a.root.querySelector('.storage-warning').click(); await wait(100);
    const json = await new Promise(res => { const fr = new a.w.FileReader(); fr.onload = () => res(fr.result); fr.readAsText(blob); });
    ok('backup taken after a failed save still contains the workout', !!JSON.parse(json).logs['4day']?.day1?.exercises?.log_press);
  }
  // 9. Carries and sleds: PR = heavier load, never an Epley estimate on feet
  {
    const a = await boot(log4({ day6: { exercises: { suitcase_carry: [entry([set(70, 60), set(70, 60), set(70, 60)], 6)] }, sessions: [{ date: day(6) }] } }));
    await a.click('Strongman Conditioning'); await a.openExercise('Suitcase Carry');
    const plus = [...a.root.querySelectorAll('button')].filter(b => b.textContent.trim() === '+');
    plus[1].click(); await wait(50); plus[1].click(); await wait(50); // more distance on set 1, same load
    a.root.querySelector('button.w-9.h-11').click(); await wait(50);
    await a.next(); await a.click('Complete workout');
    ok('farther at the same load is not reported as a PR', !a.txt().includes('PERSONAL RECORDS'));
  }
  // 10. Dumbbell ladder: laterals move 10 -> 12 -> 15, never 11.25
  {
    const a = await boot(log4({ day3: { exercises: { lateral_raise: [entry([set(10, 12), set(10, 12)], 0)] }, sessions: [{ date: day(0) }] } }));
    await a.click('Upper Size'); await a.openExercise('Lateral Raise + Bent-Over Fly');
    ok('laterals: 12 on both sets moves to the next dumbbell (12 lb x 7)', a.reason().includes('Add 2 lbs') && a.verdict() === 'Raise weight' && a.nums() === '12,7,12,7');
    const plus = [...a.root.querySelectorAll('button')].filter(b => b.textContent.trim() === '+');
    const minus = [...a.root.querySelectorAll('button')].filter(b => b.textContent.trim() === '−');
    plus[0].click(); await wait(50);
    const upOne = a.nums().split(',')[0];
    minus[0].click(); await wait(50); minus[0].click(); await wait(50);
    ok('laterals: + and - step along the rack (12 -> 15 -> 12 -> 10)', upOne === '15' && a.nums().split(',')[0] === '10');
  }
  // 11. Superset pair on one screen, effort rating, and what gets saved
  {
    const tri = (reps, n, extra) => entry([set(30, reps), set(30, reps), set(30, reps)], n, extra);
    const a = await boot(log4({ day3: { exercises: { lean_tri_ext: [tri(13, 9), tri(14, 6), tri(15, 2, { effort: 'easy' })] }, sessions: [{ date: day(9) }, { date: day(6) }, { date: day(2) }] } }));
    ok('home marks the next day in the rotation (Day 4 after Day 3)', [...a.root.querySelectorAll('button')].find(b => b.textContent.includes('Lower Size')).textContent.includes('Next') && a.root.querySelectorAll('.next-up').length === 1);
    await a.click('Upper Size'); await a.openExercise('EZ Bar Curl');
    ok('superset opens as one screen with both exercises', a.txt().includes('Leaning Tricep Extension') && a.txt().includes('EZ Bar Curl') && a.txt().includes('4–5 of 6') && a.root.querySelectorAll('.set-row').length === 6);
    ok('easy last set + top of range = double jump (30 -> 40)', a.reason().includes('felt easy → Add 10 lbs') && a.verdicts() === 'Raise weight|First session' && a.nums().startsWith('40,8'));
    const chips = [...a.root.querySelectorAll('.effort-chips button')]; // [tri Easy, tri Max, curl Easy, curl Max]
    chips[1].click(); await wait(50);
    [...a.root.querySelectorAll('.set-row')].forEach(r => r.querySelector('button').click()); await wait(100);
    ok('next block names what follows the pair', a.root.querySelector('.nav-next').textContent.includes('Next · 6 of 6') && a.root.querySelector('.nav-next').textContent.includes('Lateral Raise + Bent-Over Fly'));
    await a.next();
    ok('next from a superset skips past both halves', a.txt().includes('6/6') && a.txt().includes('Lateral Raise') && a.root.querySelector('.nav-next').textContent.includes('Summary'));
    await a.prev();
    ok('back from the following exercise returns to the pair', a.txt().includes('4–5 of 6'));
    await a.next(); await a.next(); await a.click('Complete workout');
    const saved = a.stored('workoutLog_4day').day3.exercises;
    ok('effort is saved only where it was tapped', saved.lean_tri_ext[3].effort === 'max' && saved.high_rep_curl[0].effort === undefined && saved.high_rep_curl[0].sets.every(s => s.completed));
    // 12. History: review and fix a logged workout
    await a.click('Done'); await a.click('History');
    ok('history lists every logged workout, newest first', a.root.querySelectorAll('.history-row').length === 4);
    a.root.querySelector('.history-row').click(); await wait(150);
    ok('history session shows the logged exercises', a.txt().includes('Leaning Tricep Extension') && a.txt().includes('EZ Bar Curl'));
    const curlCard = [...a.root.querySelectorAll('.set-row')].find(r => r.textContent.includes('55'));
    [...curlCard.querySelectorAll('button')].find(b => b.textContent.trim() === '+').click(); await wait(100);
    ok('editing a set in history rewrites the log (55 -> 60)', a.stored('workoutLog_4day').day3.exercises.high_rep_curl[0].weight === 60);
    a.w.confirm = () => true;
    await a.click('Delete this workout');
    ok('deleting a workout removes its entries and session', a.root.querySelectorAll('.history-row').length === 3 && a.stored('workoutLog_4day').day3.exercises.high_rep_curl === undefined && a.stored('workoutLog_4day').day3.sessions.length === 3);
  }
  // 13. Chart is rep-aware; the pull-up is logged as assistance
  {
    const row = (reps, n) => entry([set(120, reps), set(120, reps), set(120, reps)], n);
    const a = await boot(log4({ day3: { exercises: { incline_machine: [row(8, 9), row(9, 6), row(10, 2)] }, sessions: [{ date: day(2) }] } }));
    await a.click('Upper Size'); await a.openExercise('Incline Machine Press');
    ok('same weight, more reps shows as progress (est. 1RM 152 -> 160)', a.txt().includes('Est. 1RM · 3 sessions · 152 → 160 lb') && a.txt().includes('▲ 8 lb'));
    a.root.querySelector('.nav-back').click(); await wait(150); await a.click('Back');
    await a.click('Upper Power'); await a.openExercise('Assisted Pull-up');
    ok('assisted pull-up: 3 x 4-6, weight is assistance', a.txt().includes('lbs assist') && a.verdict() === 'First session' && a.nums() === '60,6,60,6,60,6');
  }
  // 14. Verdict wording agreed with the lifter
  {
    const three = (w, reps, n, extra) => entry(reps.map(r => set(w, r)), n, extra);
    const a = await boot(log4({ day5: { exercises: {
      dips: [three(60, [10, 10, 10], 3)],
      lat_pulldown: [three(100, [8, 7, 7], 3, { effort: 'easy' })],
      hammer_curl: [{ ...three(25, [12, 12, 12], 3), skipped: true, sets: [set(25, 12, false), set(25, 12, false), set(25, 12, false)] }]
    }, sessions: [{ date: day(3) }] }, day1: { exercises: { pullup: [three(60, [3, 3, 2], 2)] }, sessions: [{ date: day(2) }] } }));
    await a.click('Arms + Shoulders'); await a.openExercise('Assisted Dips');
    ok('assisted lift that hit the range says "Less assist"; Easy inside the range says "Raise reps"', a.verdicts() === 'Less assist|Raise reps' && a.nums().startsWith('55,6'));
    await a.next();
    ok('no checked set last time says "Skipped last time"; no history says "First session"', a.verdicts() === 'First session|Skipped last time');
    a.root.querySelector('.nav-back').click(); await wait(150); await a.click('Back');
    await a.click('Upper Power'); await a.openExercise('Assisted Pull-up');
    ok('assisted lift below the range says "More assist"', a.verdict() === 'More assist' && a.nums().startsWith('65,4'));
    ok('next block shows sets x reps and the last weight', a.root.querySelector('.nav-next').textContent.includes('Next · 3 of 5') && a.root.querySelector('.nav-next').textContent.includes('Incline Barbell Press'));
  }
  console.log(`${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
