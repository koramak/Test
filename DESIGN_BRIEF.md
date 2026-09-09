# Design Brief — Workout Tracker visual refresh

**For:** Claude Design (or any designer)
**Product:** `workout-tracker.html` — a single-file, offline, iPhone home-screen web app used mid-set in a gym
**Ask:** a **visual** refresh. Not a redesign of how it works.

---

## 1. Read this first — what went wrong last time

A previous redesign was rejected and reverted. It looked good in mockups and broke the app in use:

- It replaced free per-set logging with a "one active set at a time" flow. The lifter couldn't jump between exercises, couldn't fix a set after tapping it, and completed exercises locked. **Unusable in a gym.**
- It removed information the lifter relies on mid-set (last session's numbers, the suggestion, notes, the chart).
- It assumed a fixed 390×800 frame that "never scrolls" and then couldn't hold real data.
- It was "too radical a change" — the lifter had muscle memory for where things were.

A second lesson from a later round: **reactive sizing was tried and rejected.** Making buttons and numerals bigger on exercises with fewer sets "to use the vertical space" grew the rows *horizontally* until controls fell off the right edge. The lifter's instruction: design one fixed layout for the longest workout (5 set rows), let shorter workouts leave room, and spend any spare vertical space on **information**, never on inflating controls.

The lifter's own words on what to keep: *"It works well and the buttons are easy to hit."* Optimize for that.

**Rule of thumb:** if a change alters *what* is on a screen, *where* a control is, or *how* an interaction works, it's out of scope. Color, type, spacing, radius, iconography, and surface treatment are in scope.

---

## 2. Non-negotiables (functional contract)

Every one of these must exist, unchanged in behavior, on the same screen it is on today.

### Logging screen (the one that matters most)
1. **Every set is its own row**, all visible at once (up to 5). Each row: a complete toggle, weight − / value / +, reps − / value / +, and (rows 2+) a copy-previous-set button.
2. Any set can be **toggled complete and back**, and edited **at any time**, in any order. Nothing ever locks.
3. **Prev / Skip / Next** fixed at the bottom. Skip is a real action (it marks the exercise skipped for progression).
4. Exercise name with an inline **alternate-exercise toggle** ("Trap Bar Deadlift" ⇄), the program's one-line coaching cue under it, and a **target line** in the accent color: sets × reps, rest, the progression rule ("+5 lb when every set hits 12", "78% of your heavy day"), reps in reserve.
5. **Last-workout row**: date + a chip per set (`W 118×5 ✓` for warm-ups, `235×4 ✓`).
6. **Progress chart** (sparkline across all sessions, with the delta). The lifter explicitly asked to keep this.
7. **Suggestion banner**: what the app recommends today and one line of why (increase / hold / decrease / reset / "78% of your squat").
8. **Notes row**, collapsed by default, showing today's note or *"Last time: <first line of last session's note>"*; tap to expand a textarea. This preview is deliberate — a note the lifter can't see isn't a note.
9. Warm-up sets are marked (`W`) and visibly distinct from working sets.
10. Abs-slot days show a dropdown to pick the ab exercise (Peach Protocol only).

### Day overview
11. Back, day name and focus line, the **5-minute mobility block** (5 short lines), the **ab-routine checkbox** with adherence text, one tappable row per exercise (name, sets × reps, last weight, "⇄" marker on superset pairs, checkmark once worked this session), a **"?" button per row** that opens a bottom sheet (description, video link, rep range, increment), and a fixed **Start / Continue workout** button.
12. Tapping any exercise row jumps straight into that exercise (equipment-taken use case).

### Home
13. Switch-program link, program name/subtitle, one row per day (6 for Strongman Hypertrophy, 3 for Peach Protocol), the **8-week consistency bars**, the backup nudge (conditional), and two utility rows: **Backup · Restore / Import** (one button that accepts a JSON backup or a CSV export) and **Export CSV · Reset**.

### Summary → Complete
14. Summary: count of exercises completed, the ab checkbox again, one row per exercise with sets done, **"Complete workout, progress weight"** primary and **"Review exercises"** secondary.
15. Complete: confirmation, date + duration, **personal records** list when any, Done.

### Everywhere
16. Two programs share every screen. Peach Protocol must look right with 5–8 exercises per day.
17. Offline single file. No web fonts that block rendering; no external images. Anything from a CDN must fail silently.
18. All existing data formats stay as they are (this is a UI brief; storage is untouched).

---

## 3. Hard constraints

### No vertical scrolling on iPhone 16 Pro, home-screen mode
- Viewport **393 × 852 pt**, safe-area insets **59 pt top / 34 pt bottom**. Usable ≈ 759 pt; screens with a fixed bottom bar have ~640–700 pt of flow content above it.
- Measured worst cases today (all must still fit after the refresh):

| Screen | Worst case | Content height today | Room |
|---|---|---|---|
| Exercise | 5 set rows + history + chart + 2-line cue + target line | 720 pt of 730 | **10 pt** |
| Day overview | 6 exercises + mobility block | 719 of 738 | 19 pt |
| Summary | 6 exercises | 610 of 694 | 84 pt |
| Home | 6 days + consistency bars + backup nudge + both utility rows | 788 of 818 | 30 pt |

These come from `tests/measure.js --seed`, which renders each screen in Chromium at 393×852 with seeded history and the standalone insets applied. Re-run it on any layout proposal.

- The exercise screen has essentially **zero vertical slack**. Any added padding, larger type, or taller cards there must be paid for elsewhere on the same screen. A design that adds 10 pt per set row is 50 pt over.
- **One layout for all exercises.** Sizes do not change with the number of sets (see §1). A 3-set exercise shows the same 44 px steppers and 18 px numerals as a 5-set one and leaves the bottom of the screen empty.
- The compiled stylesheet contains only the Tailwind classes the app already uses. A new utility class is silently ignored at runtime — one such class once collapsed every set row in Safari while passing the DOM tests. Anything new must be an inline style, and `tests/measure.js` is the check.
- Content must never sit under the Dynamic Island or the home indicator.

### Touch targets
- Keep every current hit size: set toggle 36 × 44, stepper buttons 44 × 44, prev/next 64 × 64, Skip ≥ 40 tall, "?" 36 × 36, rows ≥ 44 tall. These are used with chalked hands between heavy sets. Do not shrink; may enlarge only if the height budget allows.
- No hover-only affordances. No gestures (swipe-to-delete, long-press) as the only way to do anything.

### Implementation reality
- React 18 + Tailwind (compiled, fixed class set) + inline styles, one HTML file. Deliver **tokens and measurements**, not a component library. New Tailwind classes don't exist at runtime; anything novel is inline style.
- Dark theme only. The gym is bright; the phone is at arm's length; contrast matters more than subtlety.

---

## 4. What you may change (the actual brief)

- **Palette.** Today: near-black `#0a0a0f` background, `#12121a` cards, zinc grays, and per-day accent colors (blue / green / purple / orange / pink / yellow) used for the day label, buttons, steppers, and chart line. Emerald = done, amber = warm-up / warning. You may replace all of this. Keep *some* color semantics: done, warm-up, warning/backup-nudge, and "this is the primary action" should each be distinguishable at a glance.
- **Typography.** System font today (SF Pro on iPhone). You may propose a font, but it must be bundled or fall back cleanly. Big numerals (set weight/reps, the completed count) should read from arm's length; captions can be small (≥ 10 pt).
- **Shape and surface.** Radius, borders vs. fills, card grouping, dividers, elevation (there is none today).
- **Icons.** Chevrons, check, sticky-note, copy, swap, skip, download, restore, trophy. A consistent set is welcome; the power ⚡ / size ≡ classification idea from the previous design was liked and can return as *decoration* on rows.
- **Hierarchy and rhythm** inside the fixed inventory: what's loud, what's quiet, spacing scale, how superset pairs read as a pair, how warm-up rows read as lighter.
- **Micro-interactions**: press states, the set-complete transition, the notes row expanding. Keep them fast (< 200 ms).

Explicitly **not** wanted: pill buttons for primary actions (rejected last time), a redesigned logging flow, removing anything from §2, a light theme, decorative illustration that costs height.

---

## 4b. Reference screenshots (attach these to the design session)

`design/current-screens/` holds the app as it is today, rendered at iPhone 16 Pro size (2×) with representative history so the last-workout row, chart, and consistency bars are visible:

| File | Screen | What to notice |
|---|---|---|
| `program_select.png` | Program picker | Two programs share every screen |
| `home.png` | Home | 6 day rows, consistency bars, backup nudge, both utility rows |
| `day_overview.png` | Day overview, 5 exercises | Mobility block, ab checkbox, "?" per row, superset ⇄ marker |
| `day_overview_lower_power.png` | Day overview, 6 exercises | The tight case — 19 pt spare |
| `exercise_deadlift_with_history.png` | Logging, worst case | 5 set rows + last-workout chips + chart + suggestion + target line — 10 pt spare |
| `summary_6_exercises.png` | Summary | — |
| `complete.png` | Complete | — |

Design *from* these, not from memory of other fitness apps. Every element visible in them must be visible in your screens.

Two rendering caveats: the screenshots come from headless Chromium on Linux, so the font is a generic sans rather than SF Pro, and the 59 pt status-bar inset is not drawn (on the phone, everything sits 59 pt lower under the Dynamic Island). Layout, spacing, and hit sizes are exact.

## 5. Deliverables

1. **Tokens**: color, type scale (size/weight/line-height), spacing scale, radius scale — as a table.
2. **Four annotated screens at 393 × 852 with safe areas drawn**: Home, Day overview (6 exercises, mobility block visible), Exercise (5 set rows, history + chart + suggestion + collapsed notes — the worst case), Summary (6 rows). Each must show its content ending above the fixed bar. Include the "?" bottom sheet and the expanded notes state as insets.
3. A **component sheet** for the set row: default, warm-up, completed, and the copy button; with exact pixel heights.
4. A short **change log** in plain language: for every screen, what changed visually and confirmation that nothing in §2 moved or disappeared.

---

## 6. Acceptance checklist (the implementer will test these)

- [ ] `tests/walkthrough.js` passes unchanged (25 functional checks — it clicks every control listed in §2).
- [ ] `tests/measure.js --seed` reports FITS for every screen on iPhone 16 Pro.
- [ ] All hit sizes in §3 preserved (measured, not eyeballed).
- [ ] A lifter who used the app last week can find every control without hunting.
- [ ] Reads at arm's length in a bright room: weight/rep numerals, the suggestion, which sets are done.
- [ ] Nothing loads from the network in a way that changes layout when offline.
