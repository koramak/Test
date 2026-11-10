# Workout Tracker visual refresh: build handoff

**For:** Claude Code, working in `koramak/Test`
**From:** the design round of 2026-11-10, based on `main` at `b3fac63` (PR #27)
**Reference images:** `screens/01`–`09` next to this file. They were rendered in headless Chromium at 393 × 852, 2×, with the safe-area lines drawn (59 top, 34 bottom). Font is a generic sans, as in `design/current-screens/`.

Build this in `src/workout-tracker.jsx` and `src/shell.html`. All rules in `DESIGN_BRIEF.md` §3 still apply: inline styles only for anything new, never edit `workout-tracker.html`, run `cd tests && npm install && npm run build && npm test && npm run measure` before handing back, then `node screens.js`.

---

## 1. Read first: three approved departures from the brief

Zane (the lifter) decided these on 2026-11-10. They override `DESIGN_BRIEF.md` §2. Update the brief and the tests to match; do not treat them as regressions.

| # | Brief | Decision | Zane's reason |
|---|---|---|---|
| A | §2.4, §2.10a: coaching cue and target line on the logging screens | **Remove both**, on the single-exercise screen and in both superset panels | "I don't ever read those coaching notes" |
| B | §2.7: suggestion banner with one line of why | **One bold verdict only**, no second line | "It's either hold or raise reps or raise weight (or lower), we don't need that much text" |
| C | §2.3: Prev / Next 64 × 64, Skip pill | **87 px bar**: Prev 64 × 87, Skip 64 × 87, Next fills the rest and names the next exercise | Picked from options; "keep!" on the next-exercise preview |

Same three controls, same order, same behaviour for C. Nothing else in §2 moves or disappears.

Also decided:

- **One accent.** The six per-day colours, emerald for done and amber for warm-up are all replaced. Blue is the only accent; coral is the second colour for warnings and "lower".
- **Six-set exercise gets its own tighter spacing** (Sled Push on Day 6 is the only one). Controls stay the same size; only gaps shrink. This is a narrow exception to the "one layout" rule in §1.

### Tests that will need changing because of A–C

- `tests/walkthrough.js` "exercise: suggestion banner" matches `/rep range|suggested weight|Log your sets|adding weight/`. The verdict is now one of four labels and the header reads `Sets`.
- `tests/walkthrough.js` "prev works" / "skip advances" look for `2/` and `3/` in the page text. The counter is now dots (§4.1). Either keep the `n/total` string as visually hidden text (inline style, no new Tailwind class) or change the checks.
- `tests/measure.js` finds Prev and Next by exact text `‹` and `›`, min 64 × 64. Next now contains a label. Update the selectors; the sizes still pass (64 × 87 and wider).
- `tests/measure.js` computes the limit from the fixed bar's height. The bar is now 87 px, so the logging limit drops by 23 px. Removing the cue and target lines more than pays for it.

---

## 2. Tokens

### Colour

| Token | Value | Use |
|---|---|---|
| bg | `#111318` | Screen background |
| surface | `#1a1d24` | Cards, list rows, dial housings, secondary buttons |
| line | `#2a2f39` | Card and row borders, dividers, empty chart bars, "?" button fill |
| line-strong | `#3a4150` | Working-set dial border, outlined chips, dashed note row, secondary button border |
| ink | `#e3e6ec` | Primary text, numerals |
| ink-2 | `#b6bcc8` | Note text, mobility lines, unselected effort chip text |
| ink-3 | `#8b93a3` | Labels, meta lines, warm-up numerals, icons |
| ink-4 | `#5e6676` | Chevrons, disabled Prev, warm-up ring only. Never body text (fails contrast). |
| accent | `#6fb3ff` | Done, selected, day and date labels, chart, verdict ring, Next badge, PR |
| accent-tint | `rgba(111,179,255,0.08)` row · `0.10` chip and checked ab row · `0.55` checked ab border | |
| warn | `#ef7d5a` | Backup nudge, unfinished fraction, Lower weight, Delete |
| warn-tint | `rgba(239,125,90,0.14)` fill · `0.4` border (nudge) · `0.55` border (Delete) | |
| primary-bg / primary-ink | `#e3e6ec` / `#111318` | Next block, Begin / Continue, Complete workout |
| primary-ink-2 | `#4a5160` | Secondary lines inside the Next block |

### Type

System font only (`-apple-system, 'SF Pro Text', system-ui, sans-serif`; titles and numerals use `'SF Pro Display'`). **No monospace anywhere.**

| Role | Weight size/line | Extras |
|---|---|---|
| Screen title (program, day, History, Summary) | 700 20/28 | letter-spacing −0.3 |
| Exercise title | 600 19/28 (17/28 in superset panels) | −0.2, one line, ellipsis |
| Set numerals | 700 18/44 | tabular-nums |
| Row title | 600 14/18 (14/20 on Day overview, Summary) | |
| Verdict | 600 13/18 (12/18 in superset) | |
| Label (small caps) | 600 10/14, uppercase | letter-spacing 0.6, ink-3; accent for day and date labels (10/12) |
| Subtitle | 400 12/16 | ink-3 |
| Note / body small | 400 11/16 | |
| Meta | 400 10/14 | ink-3 |
| Summary count | 800 28/32 | accent; "/6" in ink-3 600 |

### Radius

6 logging-screen cards and set rows · 8 list rows, list cards, dials, "?" button, utility buttons · 12 primary buttons and the three bottom-bar controls · fully round for toggles (24 px circle), effort chips (13), swap pill (15), last-session chips (9), Next badge (9).

### Spacing

Side padding 12 on logging screens, 16 elsewhere. Content starts 12 below the top safe area on logging screens, 16 elsewhere.

---

## 3. Shared components

Restyling these restyles every screen that uses them, which is intended.

### SetRow (`screens/01`, `02`, `08`)

- Row: height **52**, padding 3 6, radius 6, gap 8, `align-items: center`.
- Toggle: hit zone **36 × 44** (unchanged). Inside it a 24 px circle:
  - warm-up: 1.5 px dashed ink-4, letter `W` 600 10 ink-3
  - working: 2 px solid ink-3, set number 600 11 ink
  - done: filled accent, 14 px check in `#111318`, stroke 3.5
- Done row: background accent-tint 0.08, both dial borders accent.
- Weight and reps are each one **joined dial**: a single housing, height 44, radius 8, surface fill, 1 px border (line for warm-up, line-strong for working, accent for done), `overflow: hidden`. Inside: `−` button 44 × 44, value centred, `+` button 44 × 44. The buttons have no fill or radius of their own, only a 1 px line divider on their inner edge. Glyphs 20 px weight 500. Warm-up rows use ink-3 for glyphs and numerals.
- Weight dial: `width: 128px; min-width: max-content; flex: 0 1 auto` so `137.5` never clips. Reps dial: `flex: 1 1 auto; min-width: 0`. A 1 px spacer sits between them.
- Copy button: 32 × 44, 14 px icon in ink-3. Row 1 keeps an empty 32 px slot. History session rows have no slot at all.

`StepBtn` therefore becomes the 44 × 44 cell inside the housing. Hit sizes are unchanged.

### EffortChips (`screens/01`, `02`, `08`)

`last set` in 500 10/14 ink-3, then two chips. Chip: height **26**, `min-width: 40px`, padding 0 10, radius 13, 600 11. Unselected: 1 px line-strong border, transparent, ink-2 text. Selected: accent border and text, accent-tint 0.10 fill. Gap 6.

### ProgressSpark (`screens/01`)

Card: height 54, padding 6 12, radius 6, surface. Header row 14 px high: small-caps label (`Est. 1RM · 4 sessions · 258 → 274 lb`, or `Best reps` / `Load`) with ellipsis, and the delta right-aligned in 700 11 accent with a `▲`. Below: 24 px sparkline, 2 px accent stroke, one dashed line-colour midline, end point a 4 px-radius ring filled with bg.

### Last-session chips

Height 18, padding 0 7, radius 9, 600 10, tabular-nums, gap 5. Working set: line-colour fill, ink text, 5 px accent dot. Warm-up: 1 px line-strong outline, ink-3 text, 5 px hollow dot. No `W` prefix and no check mark; the dot tells them apart.

### Verdict (`screens/09`)

Replaces the suggestion banner. Card: min-height **44**, padding 4 12, radius 6, surface, gap 10. A 28 px ring (2 px border) with a 14 px glyph, then the label. Always one line.

| Label | Glyph | Colour | Proposed engine mapping |
|---|---|---|---|
| Hold | dash | accent | `maintain` |
| Raise reps | plus | accent | `maintain` with the "felt easy, push for the top of the range" reason; `progress` |
| Raise weight | up arrow | accent | `increase` |
| Lower weight | down arrow | warn | `decrease`, `regress`, the stalled reset |

The mapping is a proposal. Zane said the wording gets settled with you. Cases the four labels do not cover cleanly, to ask him about: assisted lifts (where `decrease` is progress), the derived light day ("78% of your squat"), "Skipped last time", and `start` with no history.

### Bottom bar (`screens/01`–`03`)

Fixed, left and right 16, bottom edge on the bottom safe area, height **87**, gap 10.

- **Prev**: 64 wide, radius 12, 1 px line-strong border, surface fill, ink. 24 px chevron above `Prev` in 600 10. Disabled on the first exercise: line border, transparent, ink-4.
- **Skip**: 64 wide, same style. 14 px double chevron above `Skip` in 600 11.
- **Next**: fills the rest. primary-bg, radius 12, padding 0 16 0 18. Left: `Next · 2 of 6` in 700 10/12 uppercase, letter-spacing 0.6, primary-ink-2; exercise name 700 16/19, up to two lines (`-webkit-line-clamp: 2`); `3 × 3–5 · last 120 lb` in 11/14 primary-ink-2. Right: 30 px chevron, stroke 2.5.
- Superset: all three treat the pair as one step, as today.
- Last exercise: not drawn. Suggested: label `Next`, name `Summary`, no third line.

---

## 4. Screens

### 4.1 Exercise, up to five set rows (`screens/01`)

Top to bottom, with the gap after each:

| Element | Height | Gap after |
|---|---|---|
| Nav row: back chevron (28 × 28), step dots, note icon (28 × 28) | 28 | 2 |
| Spacer | 2 | 12 |
| Title + swap pill (pill: h 30, radius 15, surface, 1 px line, 13 px accent ⇄, alt name 600 10) | 30 | 16 |
| Last card: `Last · Sat Oct 31` label, chips | 50 | 10 |
| ProgressSpark | 54 | 10 |
| Verdict | 44 | 10 |
| Note row: 1 px dashed line-strong, radius 6, 14 px icon, `Last time` small caps + first line, or `Add a note…` in ink-3 | 36 | 16 |
| Sets header: `Sets` small caps + `lbs · reps` (500, not uppercased); EffortChips on the right | 26 | 6 |
| Set rows | 52 each | 8 between |

Step dots: 6 px circles, gap 4, current accent, others line colour. They replace the `1/6` text.

Measured in the mock: content ends 14 px above the bar.

### 4.2 Superset (`screens/02`)

Nav centre reads `4–5 of 6 · Superset, alternate sets` in label style; no note icon. Spacer gap 6. Then two panels separated by a 1 px line-colour divider with 8 px above and below.

Each panel: title row 30 (title 17/28), gap 6 · inline verdict 18 high (16 px ring, 1.5 px border, 9 px glyph, label 600 12), gap 6 · one row 26 high with `Last` + chips on the left and EffortChips on the right, gap 6 · note row **30** high, gap 8 · three set rows, 4 px apart.

No chart, no Sets header, no cue, no target line. Measured: 17 px above the bar.

### 4.3 Exercise, six set rows (`screens/03`)

Only when `sets === 6`. Same parts as 4.1 with these gaps: spacer 6, title 8, cards 6, above Sets header 8, below it 4, set rows 4 apart. Last-session chips use padding 0 5 so six fit on one line. Measured: 10 px above the bar, so about 2 px inside the `measure.js` limit. If it fails there, drop the card gaps to 4.

### 4.4 Home (`screens/04`)

- Header: `Switch program` link 12/16 ink-3, 40 px icon tile (radius 8, accent fill, `#111318` glyph), program name, subtitle.
- Day rows: padding 11 16, radius 8, 1 px line, surface, 8 apart. First line: `DAY 1` label in accent, then ` · 5 exercises · 11d ago` in 500 ink-3, not uppercased. Second line: day name 600 14/18. Chevron 16 px ink-4.
- **Next badge**: before the chevron, gap 10. Height 18, padding 0 7, radius 9, 1 px accent border, accent text, 600 10 uppercase.
- 8-week card: padding 12, radius 8. Bars radius 4, accent; partial weeks at opacity 0.55; empty weeks a 10 % stub in line colour.
- Backup nudge: warn text 600 10/14, warn-tint fill and border, radius 8, one line with ellipsis.
- Utility rows, all 600 10/14 ink-3, padding 8 0, radius 8: **Backup, Restore / Import, History** filled (surface + 1 px line); **Export CSV** outlined only; **Reset** text only.

**Height warning.** The mock adds 8 px under the subtitle (12 → 20) and 4 px above the chart (12 → 16). The real Home has 10 pt spare, so use 16 and 16 (+8 total) and run measure. If it fails, leave Home's spacing as it is today.

### 4.5 Day overview (`screens/05`)

- Back 600 14/20 ink-3. Day label in accent small caps, title, focus line.
- Mobility card: padding 8 12, radius 8; header small caps with the right-hand note in 10/14 ink-3; five lines 10/14 ink-2.
- Ab row: 24 px checkbox, radius 4, line fill, line-strong border. Checked (Summary): accent fill, dark check, row gets accent-tint 0.10 and a 0.55 border.
- Exercise rows: padding 8 12, radius 8, 6 apart. Number in a 28 px ring (2 px ink-3, 600 12), matching a working set. Worked this session: filled accent circle with check, plus `worked today` in accent on the meta line. Name 600 14/20. Meta 10/14 ink-3 with the last weight in ink 600. `?` button **36 × 36**, radius 8, line fill, ink-3.
- Superset pair: ⇄ marker kept; the two rows share flattened inner corners (8 8 3 3 and 3 3 8 8) and a 2 px accent tick bridges the gap.
- Begin / Continue: height 48, radius 12, primary colours, 700 15, in the existing fixed bar.

Spacing added in the mock: Back gap 16 → 20, header block 16 → 20, ab row 12 → 16. The Peach Protocol eight-exercise day was not rendered; if measure fails there, revert these three first.

### 4.6 Summary (`screens/06`)

Title, day name, count card (height 47), ab row, one row per exercise (padding 8 12, radius 8, **10 apart**). Finished: 24 px accent circle with check. Unfinished: the fraction in warn 700 12. Primary button 54 high, secondary 50 high with 1 px line-strong border on surface; both radius 12. Gaps: under the day name 24, under the count card 16, under the ab row 12.

### 4.7 History list (`screens/07`)

Back, `History` title, count line 12/16 ink-3, then rows 8 apart in the Home day-row style (padding 10 16): date in accent small caps, day name 600 14/18, meta 10/14 ink-3. A PR count is accent 600. This screen scrolls.

### 4.8 History session (`screens/08`)

Back, date in accent small caps, day name title, one-line explanation 12/16 ink-3. One card per exercise, 10 apart: padding 10, radius 8, 1 px line border, **no fill** (the dials need the contrast). Card header 26 high: name 600 14/20 with EffortChips on the right. Note, if any: 11/16 italic ink-2. Set rows 4 apart, no copy slot. `Delete this workout`: height 44, radius 12, warn text 600 13, warn-tint 0.55 border, transparent, 16 below the last card.

---

## 5. Not drawn in this round

Apply the tokens and component styles; do not change layout or content.

- Program select, Complete (trophy tile and Done button take the primary colours; PR list uses accent)
- The `?` bottom sheet and the expanded note textarea
- The red save-failed warning on Home (use warn)
- Peach Protocol days with 5–8 exercises
- Next block on the last exercise (see §3)

---

## 6. Open items for Zane

1. Verdict wording and the edge cases listed under Verdict in §3.
2. Whether the Next block's third line (`3 × 3–5 · last 120 lb`) should show last weight, today's suggested weight, or both.
3. Sign-off on the screens in §5 once built.

## 7. Suggested order

1. Tokens and the shared components (SetRow, EffortChips, ProgressSpark, chips). Run measure; nothing should move yet.
2. Bottom bar (C) and the test selector updates.
3. Remove cue and target lines (A), swap the banner for the verdict (B), update the brief and walkthrough.
4. Exercise spacing from §4.1, then the six-set variant.
5. Superset, Home, Day overview, Summary, History.
6. `npm test`, `npm run measure`, `node screens.js`, then compare the new `design/current-screens/` against `screens/01`–`08`.
