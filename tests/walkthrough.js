// Functional walkthrough for workout-tracker.html (original UI).
// Usage: node walkthrough.js [path-to-html]
// Exits non-zero on any failure. Exercises every mandatory function:
// per-set toggle on/off, steppers, prev/next/skip, jump-to-exercise,
// alt toggle, notes, abs adherence, summary -> complete -> home, utilities.
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');
const file = process.argv[2] || path.join(__dirname, '..', 'workout-tracker.html');
const html = fs.readFileSync(file, 'utf8');
// Parse check first: fail fast on JSX errors
{
  const Babel = require('@babel/standalone/babel.min.js');
  const m = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>\s*<\/body>/);
  try { Babel.transform(m[1], { presets: ['react'] }); console.log('PASS JSX parses'); }
  catch (e) { console.log('FAIL JSX parse: ' + e.message.slice(0, 200)); process.exit(1); }
}
const vc = new VirtualConsole(); vc.on('jsdomError', () => {});
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://example.com/', virtualConsole: vc });
const wait = (ms) => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (name, cond) => { console.log((cond ? 'PASS' : 'FAIL') + ' ' + name); cond ? pass++ : fail++; };
(async () => {
  await wait(5000);
  const root = dom.window.document.getElementById('root');
  const btn = (t) => [...root.querySelectorAll('button')].find(b => b.textContent.replace(/\s+/g, ' ').trim().includes(t));
  const txt = () => root.textContent;

  ok('program select renders', txt().includes('Choose Your Program') || txt().includes('Choose program'));
  btn('Strongman').click(); await wait(600);
  ok('home: day list', txt().includes('Day 1') || txt().includes('Upper Power'));
  ok('home: utilities', !!btn('Backup') && !!btn('CSV') && !!btn('Reset'));
  btn('Upper Power').click(); await wait(600);
  ok('overview: abs checkbox', txt().includes('Pre-workout ab routine'));
  const absBtn = btn('Pre-workout ab routine'); const absBefore = absBtn.innerHTML; absBtn.click(); await wait(300);
  ok('overview: abs toggles', absBtn.innerHTML !== absBefore);
  const rows = [...root.querySelectorAll('.exercise-row')];
  ok('overview: tappable exercise rows', rows.length >= 5);
  // "?" info sheet opens with description + video link, closes, and does NOT navigate
  rows[1].querySelector('.info-btn').click(); await wait(300);
  const sheet = root.querySelector('.info-sheet');
  ok('overview: ? opens info sheet with video link', !!sheet && !!sheet.querySelector('a[href*="youtube"]'));
  btn('Close').click(); await wait(300);
  ok('overview: info sheet closes, still on overview', !root.querySelector('.info-sheet') && txt().includes('Pre-workout ab routine'));
  rows[2].click(); await wait(600);
  ok('exercise: jumped to #3', txt().includes('3/'));
  ok('exercise: set rows', txt().includes('LOG YOUR SETS'));
  ok('exercise: notes row collapsed by default', !!root.querySelector('.notes-row') && !root.querySelector('textarea'));
  root.querySelector('.notes-row').click(); await wait(300);
  ok('exercise: notes row expands to textarea', !!root.querySelector('textarea'));
  ok('exercise: suggestion banner', /rep range|suggested weight|Log your sets|adding weight/.test(txt()));
  const toggles = [...root.querySelectorAll('button')].filter(b => b.className.includes('w-9 h-11') || (b.className.includes('rounded-full') && b.style.width === '38px'));
  const t0 = toggles[0]; const h0 = t0.innerHTML; t0.click(); await wait(300);
  const h1 = t0.innerHTML; t0.click(); await wait(300);
  ok('exercise: set toggles on AND off (never locks)', h1 !== h0 && t0.innerHTML === h0);
  const plus = [...root.querySelectorAll('button')].filter(b => b.textContent.trim() === '+');
  const before = txt(); plus[0].click(); await wait(200);
  ok('exercise: weight stepper', txt() !== before);
  ok('exercise: prev/next/skip present', !!btn('‹') && !!btn('›') && !!btn('Skip'));
  btn('‹').click(); await wait(400); ok('exercise: prev works', txt().includes('2/'));
  btn('Skip').click(); await wait(400); ok('exercise: skip advances', txt().includes('3/'));
  const alt = root.querySelector('.alt-toggle'); ok('exercise: alt toggle', !!alt); if (alt) { alt.click(); await wait(300); }
  if (!root.querySelector('textarea')) { root.querySelector('.notes-row').click(); await wait(300); }
  const ta = root.querySelector('textarea');
  const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype, 'value').set;
  setter.call(ta, 'felt great'); ta.dispatchEvent(new dom.window.Event('input', { bubbles: true })); await wait(200);
  ok('exercise: notes persist in state', root.querySelector('textarea').value === 'felt great');
  btn('Done').click(); await wait(200);
  ok('exercise: collapsed row previews today\'s note', (root.querySelector('.notes-row') || {}).textContent?.includes('felt great'));
  for (let i = 0; i < 14; i++) { const n = btn('›'); if (!n) break; n.click(); await wait(120); }
  await wait(500);
  ok('summary renders', /Workout Summary|Summary/.test(txt()));
  btn('Complete workout').click(); await wait(800);
  ok('complete renders', /Workout Complete|Total volume/.test(txt()));
  btn('Done').click(); await wait(500);
  ok('home again + consistency widget', txt().includes('LAST 8 WEEKS'));
  // Re-enter: last session note must surface for the exercise it was left on
  btn('Upper Power').click(); await wait(500);
  const rows2 = [...root.querySelectorAll('.exercise-row')];
  rows2[2].click(); await wait(600);
  ok('exercise: previous note previewed as "Last time:"', (root.querySelector('.notes-row') || {}).textContent?.includes('Last time: felt great'));
  console.log(`${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
