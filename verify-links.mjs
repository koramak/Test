#!/usr/bin/env node
// Checks that every YouTube exercise-demo link in workout-tracker.html is
// actually playable, by asking YouTube's oEmbed endpoint the same way a
// browser would. Deleted, private, or region-blocked videos come back as
// errors here even though the watch page itself returns HTTP 200.
//
// Run on your own machine (needs internet access to youtube.com):
//   node verify-links.mjs
//
// Exit code is non-zero if any link is dead.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, 'workout-tracker.html'), 'utf8');

// Matches: exerciseId: { description: '...', source: '...', youtube: 'https://...' }
const re = /(\w+): \{ description: '[^']*', source: '([^']*)', youtube: '([^']*)'/g;
const entries = [];
for (const m of html.matchAll(re)) { if (m[3]) entries.push({ id: m[1], source: m[2], url: m[3] }); else console.log(`SKIP  ${m[1]} — no video yet`); }

if (entries.length === 0) {
  console.error('No links found — has the exercise description format changed?');
  process.exit(2);
}

const byUrl = new Map();
for (const e of entries) {
  if (!byUrl.has(e.url)) byUrl.set(e.url, []);
  byUrl.get(e.url).push(e.id);
}

console.log(`Checking ${byUrl.size} unique videos used by ${entries.length} exercises...\n`);

let dead = 0;
for (const [url, ids] of byUrl) {
  const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  let status = 'ERR', title = '';
  try {
    const res = await fetch(oembed, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    status = res.status;
    if (res.ok) title = (await res.json()).title || '';
  } catch (err) {
    title = err.message;
  }
  const playable = status === 200;
  if (!playable) dead++;
  const tag = playable ? 'OK  ' : 'DEAD';
  console.log(`${tag}  ${url}`);
  console.log(`      ${ids.join(', ')}`);
  console.log(`      ${playable ? title : `HTTP ${status} ${title}`}\n`);
  await new Promise(r => setTimeout(r, 250)); // be polite
}

console.log(dead === 0 ? `All ${byUrl.size} videos playable.` : `${dead} dead video(s) — see DEAD lines above.`);
process.exit(dead === 0 ? 0 : 1);
