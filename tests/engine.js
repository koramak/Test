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
    nums: () => [...root.querySelectorAll('div.text-lg.font-bold')].map(d => d.textContent).join(','),
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
    ok('partial session: only the checked set counts (6 reps -> drop, not "maintain" on a phantom average)', a.txt().includes('Below 8 reps → Drop 5 lbs'));
    ok('partial session: lower weight pre-fills at the bottom of the range', a.nums() === '115,8,115,8,115,8');
  }
  // 2. Suggestion reaches the set rows + 3. "every set" means every set
  {
    const a = await boot(log4({
      day3: { exercises: { incline_machine: [entry([set(120, 12), set(120, 12), set(120, 12)], 3)] }, sessions: [{ date: day(3) }] },
      day1: { exercises: { seated_row: [entry([set(135, 12), set(135, 10), set(135, 8)], 2)] }, sessions: [{ date: day(2) }] }
    }));
    await a.click('Upper Size'); await a.openExercise('Incline Machine Press');
    ok('hit the top on every set: banner says add 5', a.txt().includes('Hit 12+ on every set → Add 5 lbs'));
    ok('hit the top on every set: rows pre-fill 125 x 8', a.nums() === '125,8,125,8,125,8');
    a.root.querySelector('button.p-1').click(); await wait(150); await a.click('Back');
    await a.click('Upper Power'); await a.openExercise('Seated Row Machine');
    ok('12/10/8 on a 6-10 range averages 10 but does NOT add weight', !a.txt().includes('Add 5 lbs') && a.nums() === '135,10,135,10,135,10');
    a.root.querySelector('button.p-1').click(); await wait(150);
    a.rows().find(r => r.textContent.includes('Seated Row Machine')).querySelector('.info-btn').click(); await wait(150);
    ok('info sheet uses the day\'s own rep range (6-10, not the base 5-8)', a.root.querySelector('.info-sheet').textContent.includes('6-10 reps'));
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
    ok('stall reset pre-fills the working rows at 205', a.txt().includes('Stalled 3 sessions') && a.nums().split(',').slice(4, 6).join() === '205,6');
    const b = await boot(log4({ day2: { exercises: { deadlift: [flat(225, 30), flat(225, 20), flat(225, 12), flat(205, 4)] }, sessions: [{ date: day(4) }] } }));
    await b.click('Lower Power'); await b.openExercise('Conventional Deadlift');
    ok('the session after a reset is not treated as another stall', !b.txt().includes('Stalled') && b.nums().split(',')[4] === '205');
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
    for (let i = 0; i < 8 && a.btn('›'); i++) await a.click('›');
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
    await a.click('›'); await a.click('Complete workout');
    ok('farther at the same load is not reported as a PR', !a.txt().includes('PERSONAL RECORDS'));
  }
  // 10. Dumbbell ladder: laterals move 10 -> 12 -> 15, never 11.25
  {
    const a = await boot(log4({ day3: { exercises: { lateral_raise: [entry([set(10, 12), set(10, 12)], 0)] }, sessions: [{ date: day(0) }] } }));
    await a.click('Upper Size'); await a.openExercise('Lateral Raise + Bent-Over Fly');
    ok('laterals: 12 on both sets moves to the next dumbbell (12 lb x 7)', a.txt().includes('Add 2 lbs') && a.nums() === '12,7,12,7');
    const plus = [...a.root.querySelectorAll('button')].filter(b => b.textContent.trim() === '+');
    const minus = [...a.root.querySelectorAll('button')].filter(b => b.textContent.trim() === '−');
    plus[0].click(); await wait(50);
    const upOne = a.nums().split(',')[0];
    minus[0].click(); await wait(50); minus[0].click(); await wait(50);
    ok('laterals: + and - step along the rack (12 -> 15 -> 12 -> 10)', upOne === '15' && a.nums().split(',')[0] === '10');
  }
  console.log(`${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
