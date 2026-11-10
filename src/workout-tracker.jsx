const { useState, useEffect } = React;

// Icons
const ChevronLeft = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const ChevronRight = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const Check = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const Dumbbell = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h2v10H4zM18 7h2v10h-2zM6 9h2v6H6zM16 9h2v6h-2zM8 11h8v2H8z" /></svg>;
const Trophy = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15l-2 5h4l-2-5zM8 15H5a2 2 0 01-2-2V6a2 2 0 012-2h3M16 15h3a2 2 0 002-2V6a2 2 0 00-2-2h-3M8 4h8v7a4 4 0 01-8 0V4z" /></svg>;
const RotateCcw = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
const Download = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const Sparkles = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l.5 2M3 5l2 .5M5 7l-.5 2M7 5l-2-.5M12 3l1 4 4 1-4 1-1 4-1-4-4-1 4-1 1-4zM19 13l.5 2m-2.5.5l2 .5m-.5 2l-.5-2m-2-.5l2-.5" /></svg>;
const TrendingUp = ({ className, style }) => <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const TrendingDown = ({ className, style }) => <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" /></svg>;
const Minus = ({ className, style }) => <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>;
const StickyNote = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const Play = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const Swap = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
const Copy = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const SkipForward = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>;

// Exercise descriptions and demo links; the source is noted per entry
const exerciseMedia = {
  incline_machine: { description: 'Set the machine or Smith to about 30°. Elbows tucked ~45°, press through the upper chest and let the handles sink to a full stretch at the bottom. Third upper-chest exposure in the loop, so it is safe to push to 0-1 reps in reserve.', source: 'YouTube (exercise demonstration)', youtube: 'https://www.youtube.com/watch?v=7_scLkTCwTU' },
  sled_push: { description: 'Load the sled so a 50-65 ft trip takes 20-30 seconds at a driving pace. Arms locked, hips low, short powerful steps. Concentric-only, so almost no soreness - fine the day before or after a heavy leg day.', source: 'YouTube (technique tutorial)', youtube: 'https://www.youtube.com/watch?v=3KWK7SIdPz4' },
  sled_drag: { description: 'Face the sled and walk backwards with short steps, knees tracking over the toes. Moderate load, continuous movement. Quad work capacity that is friendly to the knees.', source: 'YouTube (technique tutorial)', youtube: 'https://www.youtube.com/watch?v=hbCeJFBFyYk' },
  // Compound lifts
  deadlift: { description: 'Hip hinge with barbell from floor. Drive through heels, keep back flat, extend hips and knees together.', source: 'Men\'s Health', youtube: 'https://www.youtube.com/watch?v=r4MzxtBKyNE' },
  squat: { description: 'Barbell on upper back, descend by bending hips and knees until thighs parallel. Drive up through heels.', source: 'CrossFit', youtube: 'https://www.youtube.com/watch?v=ultWZbUMPL8' },
  pause_squat: { description: 'Barbell squat with a 2-3 second dead stop at the bottom, no bounce. Builds positional strength and squat skill at lighter loads - use roughly 70-80% of your normal squat weight.', source: 'NSCA' },
  hip_thrust: { description: 'Upper back on bench, barbell on hips. Drive hips up squeezing glutes at top, lower with control.', source: 'Jeff Nippard', youtube: 'https://www.youtube.com/watch?v=xDmFkJxPzeM' },
  log_press: { description: 'Clean log to shoulders, dip knees slightly, then drive overhead. Lock out with biceps by ears.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=IjEgI_q6fy8' },
  // Chest
  incline_db: { description: 'Bench at 30 degrees, press dumbbells from chest level to full extension. Control the negative.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=8iPEnn-ltC8' },
  incline_bb: { description: 'Bench at 30 degrees, lower bar to upper chest, press to lockout. Emphasizes upper pecs.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=SrqOu55lrYU' },
  db_bench: { description: 'Flat bench, press dumbbells from chest to full extension. Allows greater ROM than barbell.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=VmB1G1K7v94' },
  low_high_fly: { description: 'Cables set low, arms sweep up and together. Targets upper chest fibers.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=taI4XduLpTk' },
  machine_chest: { description: 'Seated press machine. Push handles forward to full extension, control the return.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=xUm0BiZCWlQ' },
  push_ups: { description: 'Hands shoulder-width, lower chest to floor, push back up. Core tight throughout.', source: 'Calisthenics Movement', youtube: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
  dips: { description: 'Assisted dip machine: knees on the pad, slight forward lean, lower until shoulders dip just below elbows, press up. Log the ASSISTANCE weight - lower numbers are harder. Work toward 0 = full bodyweight.', source: 'ACE' },
  // Back
  barbell_row: { description: 'Hinged at hips, pull bar to lower chest. Squeeze shoulder blades, lower with control.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ' },
  lat_pulldown: { description: 'Wide grip, pull bar to upper chest. Lean back slightly, squeeze lats at bottom.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=CAwf7n6Luuc' },
  cable_row: { description: 'Seated, pull handle to torso. Keep chest up, squeeze shoulder blades together.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=GZbfZ033f74' },
  pullup: { description: 'Assisted pull-up machine: knees on the pad, hands just outside shoulder width. Start from a dead hang with the shoulders pulled down, drive the elbows to your ribs until the chin clears the bar, lower under control to straight arms. Log the ASSISTANCE weight - lower numbers are harder. Work toward 0 = full bodyweight.' },
  seated_row: { description: 'Seated, pull handle to torso. Keep chest up, squeeze shoulder blades together.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=GZbfZ033f74' },
  // Shoulders
  lateral_raise: { description: 'Arms at sides, raise dumbbells to shoulder height, leading with the elbows. Then hinge forward and raise them out to the sides for the rear delts. One side raise + one bent-over fly, back to back, counts as one set.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=3VcKaXpzqRo' },
  face_pull: { description: 'Cable at face height, pull rope to face with elbows high. External rotate at end.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=rep-qVOkqgk' },
  bent_lateral: { description: 'Hinged forward, raise dumbbells out to sides. Targets rear delts.', source: 'BPI Sports', youtube: 'https://www.youtube.com/watch?v=EA7u4Q_8HQ0' },
  // Biceps
  incline_curl: { description: 'Seated on incline bench, arms hang back. Curl up, maximizing bicep stretch at bottom.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=soxrZlIl35U' },
  hammer_curl: { description: 'Neutral grip (palms facing), curl to shoulders. Targets brachialis and forearms.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=zC3nLlEvin4' },
  bayesian_curl: { description: 'Face away from cable, arm behind body. Curl forward for constant tension.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=aeS38n_Ht6A' },
  preacher_curl: { description: 'Arms on preacher pad, curl bar up. Eliminates momentum, isolates biceps.', source: 'Kris Gethin (Kaged Muscle)', youtube: 'https://www.youtube.com/watch?v=fIWP-FRFNU0' },
  spider_curl: { description: 'Chest on incline bench, arms hang straight down. Curl up for peak contraction.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=CITtSuda0Fg' },
  seated_curl: { description: 'Seated, dumbbells at sides. Curl both arms simultaneously with control.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=soxrZlIl35U' },
  preacher_fri: { description: 'Arms on preacher pad, curl bar up. Eliminates momentum, isolates biceps.', source: 'Kris Gethin (Kaged Muscle)', youtube: 'https://www.youtube.com/watch?v=fIWP-FRFNU0' },
  high_rep_curl: { description: 'Standing, underhand grip on the angled part of the EZ bar. Elbows stay at your sides: curl to the shoulders, then lower under control to full extension. No hip swing.' },
  // Triceps
  overhead_tri: { description: 'Weight overhead, lower behind head by bending elbows. Extend back up. Stretches long head.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=YbX7Wd8jQ-Q' },
  lean_tri_ext: { description: 'Rope on a high cable, facing away from the stack. Step out into a split stance and lean the torso forward so the upper arms point ahead of you, not up. Elbows stay fixed beside the head; extend the forearms forward to lockout, then let the rope pull back to a full stretch. Alternate: pushdown, elbows pinned at the sides.' },
  pushdown: { description: 'Cable attachment at top, push down until arms straight. Keep elbows pinned to sides.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=2-LAMcpzODU' },
  // Legs
  hack_squat: { description: 'Machine squat, feet forward on platform. Descend deep, drive through heels.', source: 'Bodybuilding.com', youtube: 'https://www.youtube.com/watch?v=0tn5K9NlCfo' },
  leg_press: { description: 'Feet shoulder-width on sled, lower until 90 degree knee bend, press back up.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ' },
  leg_curl: { description: 'Lying or seated, curl heels toward glutes. Squeeze hamstrings at top.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs' },
  leg_ext: { description: 'Seated, extend legs until straight. Control the negative, avoid locking knees hard.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=YyvSfVjQeL0' },
  rdl: { description: 'Barbell or DBs, hinge at hips with soft knees. Lower until hamstring stretch, drive hips forward.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=jEy_czb3RKA' },
  back_extension: { description: 'Hips on 45° pad, hinge down with flat back, raise torso by squeezing glutes and hamstrings. Stop at neutral - no hyperextension. Hold a plate at chest to load.', source: 'ACE' },
  bulgarian_split: { description: 'Rear foot elevated, lunge down until back knee near floor. Drive through front heel.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=2C-uNgKwPLE' },
  walking_lunge: { description: 'Step forward into lunge, drive up and step through to next lunge. Keep torso upright.', source: 'CrossFit', youtube: 'https://www.youtube.com/watch?v=L8fvypPrzzs' },
  step_up: { description: 'Step onto box/bench, drive through heel to stand. Lower with control. Unilateral leg work.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=WCFCdxzFBa4' },
  single_leg_rdl: { description: 'Balance on one leg, hinge forward as other leg extends back. Hamstring stretch and balance.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=Zfr6wizR8rs' },
  calf_raise: { description: 'Rise onto balls of feet, squeeze calves at top, lower below platform for full stretch.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=gwLzBJYoWlI' },
  // Glutes
  cable_kickback: { description: 'Ankle strap attached, kick leg straight back. Squeeze glute at top, control return.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=5jJNfIlKTmg' },
  side_plank_abduction: { description: 'Side plank position, lift top leg up and down. Targets glute medius.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=ifYBvRihSEo' },
  // Strongman
  farmers_walk: { description: 'Heavy weight in each hand, walk with short quick steps. Grip, traps, and core work.', source: 'Buff Dudes', youtube: 'https://www.youtube.com/watch?v=Fkzk_RqlYig' },
  suitcase_carry: { description: 'Single weight in one hand, walk maintaining upright posture. Core anti-lateral flexion.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=y-hn_Ha1-RE' },
  seated_row_machine: { description: 'Chest against pad, pull handles to torso. Squeeze shoulder blades, control return.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=GZbfZ033f74' },
  // Abs
  cable_crunch: { description: 'Kneel at cable, rope behind head. Crunch down bringing elbows to knees.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=AV5PmZJIrrw' },
  hanging_leg_raise: { description: 'Hang from bar, raise legs to parallel or higher. Control the swing.', source: 'Athlean-X', youtube: 'https://www.youtube.com/watch?v=Pr1ieGZ5atk' },
  ab_wheel: { description: 'Kneel, roll wheel forward extending body, pull back using abs. Keep core braced.', source: 'Mind Pump TV', youtube: 'https://www.youtube.com/watch?v=rqiTPdK1c_I' },
  pallof_press: { description: 'Cable at chest height, press out and resist rotation. Anti-rotation core work.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=AH_QZLm_0-s' },
  reverse_crunch: { description: 'Lying down, curl hips up off floor bringing knees toward chest. Lower with control.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=hyv14e2QDq0' },
  plank: { description: 'Forearms and toes on floor, body straight line. Hold position, brace core.', source: 'Scott Herman Fitness', youtube: 'https://www.youtube.com/watch?v=pSHjTRCQxIw' },
  dead_bug: { description: 'On back, extend opposite arm and leg while keeping lower back pressed to floor.', source: 'Kristy Lee Wilson', youtube: 'https://www.youtube.com/watch?v=I5xbsA71v1A' },
  battle_rope: { description: 'Alternating waves with heavy ropes. Full body conditioning and grip work.', source: 'YouTube (channel unconfirmed)', youtube: 'https://www.youtube.com/watch?v=nzlmTiKqno0' },
};

// Progression configs - data only. Shared logic lives in runProgression below.
// progressionType: load-first (add weight, reset reps to bottom) vs rep-first (build reps, small weight bumps)
const progressionConfig = {
  deadlift: { progressionType: "load-first", weightIncrement: 5, repRange: [4, 6], rirTarget: 2, restTime: 180, cue: 'Building strength within range' },
  squat: { progressionType: "load-first", weightIncrement: 5, repRange: [4, 6], rirTarget: 2, restTime: 180, cue: 'Building within range' },
  // Light second exposures: load is derived from the heavy lift each session and never progresses on its own
  squat_light: { progressionType: "load-first", weightIncrement: 5, repRange: [3, 5], rirTarget: 3, restTime: 120, derivedFrom: "squat", pct: 0.78, cue: 'Light exposure - every rep crisp' },
  deadlift_light: { progressionType: "load-first", weightIncrement: 5, repRange: [3, 3], rirTarget: 3, restTime: 120, derivedFrom: "deadlift", pct: 0.78, cue: 'Light exposure - reset every rep' },
  incline_machine: { progressionType: "rep-first", weightIncrement: 5, repRange: [8, 12], rirTarget: 1, restTime: 90, cue: 'Third upper-chest exposure - push close to failure' },
  sled_push: { progressionType: "distance-first", weightIncrement: 10, repRange: [50, 65], rirTarget: 2, restTime: 90, cue: 'Heavy trips, 20-30 s each' },
  sled_drag: { progressionType: "distance-first", weightIncrement: 10, repRange: [80, 100], rirTarget: 2, restTime: 60, cue: 'Short steps, knees over toes' },
  suitcase_carry: { progressionType: "distance-first", weightIncrement: 5, repRange: [60, 80], rirTarget: 2, restTime: 60, cue: 'Hips level, no lean' },
  pause_squat: { progressionType: "load-first", weightIncrement: 5, repRange: [3, 6], rirTarget: 3, restTime: 180, cue: 'Skill work - crisp reps, never grind' },
  hack_squat: { progressionType: "load-first", weightIncrement: 10, repRange: [6, 10], rirTarget: 2, restTime: 150, cue: 'Building reps within range' },
  leg_press: { progressionType: "load-first", weightIncrement: 10, repRange: [8, 12], rirTarget: 2, restTime: 150, cue: 'Building within rep range' },
  hip_thrust: { progressionType: "load-first", weightIncrement: 10, repRange: [5, 8], rirTarget: 2, restTime: 120, cue: 'Focus on glute squeeze at top' },
  rdl: { progressionType: "load-first", weightIncrement: 5, repRange: [8, 12], rirTarget: 2, restTime: 120, cue: 'Focus on hamstring stretch' },
  back_extension: { progressionType: "rep-first", weightIncrement: 5, repRange: [8, 15], rirTarget: 2, restTime: 90, cue: 'Squeeze glutes at top, no lumbar hyperextension' },
  bulgarian_split: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [8, 12], rirTarget: 2, restTime: 90, cue: 'Focus on depth and control' },
  walking_lunge: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [24, 30], rirTarget: 2, restTime: 90, cue: 'Building metabolic capacity' },
  step_up: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [10, 12], rirTarget: 2, restTime: 90, cue: 'Building unilateral strength' },
  single_leg_rdl: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [10, 12], rirTarget: 3, restTime: 90, cue: 'Focus on stability' },
  leg_curl: { progressionType: "load-first", weightIncrement: 5, repRange: [8, 12], rirTarget: 2, restTime: 90, cue: 'Control the negative' },
  leg_ext: { progressionType: "load-first", weightIncrement: 5, repRange: [10, 12], rirTarget: 2, restTime: 90, cue: 'Building within rep range' },
  cable_kickback: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [12, 15], rirTarget: 2, restTime: 60, cue: 'Prioritize glute squeeze' },
  calf_raise: { progressionType: "rep-first", weightIncrement: 5, repRange: [12, 20], rirTarget: 1, restTime: 60, cue: 'Focus on stretch and squeeze' },
  log_press: { progressionType: "load-first", weightIncrement: 2.5, repRange: [3, 5], rirTarget: 2, restTime: 180, cue: 'OHP patience - small jumps win' },
  incline_bb: { progressionType: "load-first", weightIncrement: 2.5, repRange: [8, 10], rirTarget: 2, restTime: 120, cue: 'Building pressing strength' },
  incline_db: { progressionType: "rep-first", weightIncrement: 5, repRange: [8, 12], rirTarget: 2, restTime: 90, cue: 'Building within rep range' },
  db_bench: { progressionType: "rep-first", weightIncrement: 5, repRange: [8, 12], rirTarget: 2, restTime: 90, cue: 'Progressing well' },
  barbell_row: { progressionType: "load-first", weightIncrement: 5, repRange: [6, 10], rirTarget: 2, restTime: 120, cue: 'Prioritize muscle engagement' },
  machine_chest: { progressionType: "rep-first", weightIncrement: 5, repRange: [10, 15], rirTarget: 1, restTime: 60, cue: 'Building within range' },
  dips: { progressionType: "rep-first", weightIncrement: 5, repRange: [8, 12], rirTarget: 2, restTime: 90, assisted: true, cue: 'Less assistance over time → bodyweight' },
  cable_row: { progressionType: "rep-first", weightIncrement: 5, repRange: [10, 12], rirTarget: 2, restTime: 90, cue: 'Good progress' },
  pullup: { progressionType: "load-first", weightIncrement: 5, repRange: [4, 6], rirTarget: 1, restTime: 150, assisted: true, cue: 'Less assistance over time → bodyweight, then weighted' },
  seated_row: { progressionType: "load-first", weightIncrement: 5, repRange: [5, 8], rirTarget: 2, restTime: 120, cue: 'Building back strength' },
  lat_pulldown: { progressionType: "rep-first", weightIncrement: 5, repRange: [10, 12], rirTarget: 2, restTime: 90, cue: 'Good progress' },
  face_pull: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [15, 20], rirTarget: 3, restTime: 60, cue: 'Shoulder health > ego' },
  low_high_fly: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [12, 15], rirTarget: 2, restTime: 60, cue: 'Focus on chest squeeze' },
  // startReps/restartFrom: new prescription (2 x 7 at 10 lb, build to 12). Sessions logged before
  // restartFrom stay in the history and chart but no longer seed the weight, reps or suggestion.
  // weightSteps: the dumbbells on the rack. Suggestions and the +/- buttons move along this list.
  lateral_raise: { progressionType: "rep-first", weightIncrement: 2.5, weightSteps: [5, 7, 10, 12, 15, 17, 20, 22, 25, 27, 30], repRange: [7, 12], startReps: 7, restartFrom: '2026-11-10T00:00', rirTarget: 2, restTime: 60, cue: 'Build to 12 on both sets, then add weight' },
  incline_curl: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [10, 12], rirTarget: 2, restTime: 60, cue: 'Focus on stretch at bottom' },
  hammer_curl: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [10, 15], rirTarget: 2, restTime: 60, cue: 'Building brachialis' },
  bayesian_curl: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [10, 15], rirTarget: 2, restTime: 60, cue: 'Constant tension advantage' },
  preacher_curl: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [10, 12], rirTarget: 2, restTime: 60, cue: 'Focus on full stretch' },
  preacher_fri: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [8, 10], rirTarget: 2, restTime: 60, cue: 'Building curl strength' },
  spider_curl: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [12, 15], rirTarget: 2, restTime: 60, cue: 'Focus on contraction' },
  seated_curl: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [8, 12], rirTarget: 2, restTime: 60, cue: 'Controlled curls' },
  high_rep_curl: { progressionType: "load-first", weightIncrement: 5, repRange: [6, 10], rirTarget: 2, restTime: 75, cue: 'Heavy and strict' },
  overhead_tri: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [10, 15], rirTarget: 2, restTime: 60, cue: 'Focus on stretch' },
  lean_tri_ext: { progressionType: "rep-first", weightIncrement: 5, repRange: [8, 15], rirTarget: 2, restTime: 75, cue: 'Lean forward, press forward, full stretch' },
  pushdown: { progressionType: "rep-first", weightIncrement: 5, repRange: [12, 20], rirTarget: 2, restTime: 60, cue: 'Building pump' },
  bent_lateral: { progressionType: "rep-first", weightIncrement: 1.25, repRange: [12, 20], rirTarget: 2, restTime: 60, cue: 'Focus on rear delt squeeze' },
  cable_crunch: { progressionType: "load-first", weightIncrement: 5, repRange: [12, 15], rirTarget: 2, restTime: 60, cue: 'Building core strength' },
  hanging_leg_raise: { progressionType: "rom-first", weightIncrement: 0, repRange: [10, 15], rirTarget: 2, restTime: 60, cue: 'Control the swing' },
  ab_wheel: { progressionType: "rom-first", weightIncrement: 0, repRange: [8, 15], rirTarget: 2, restTime: 60, cue: 'Focus on brace' },
  reverse_crunch: { progressionType: "rep-first", weightIncrement: 0, repRange: [12, 20], rirTarget: 2, restTime: 60, cue: 'Lower with control' },
  pallof_press: { progressionType: "rep-first", weightIncrement: 2.5, repRange: [10, 15], rirTarget: 3, restTime: 60, cue: 'Resist the rotation' },
  side_plank_abduction: { progressionType: "time-first", weightIncrement: 0, repRange: [8, 12], rirTarget: 2, restTime: 60, cue: 'Hips stacked, lift with heel' },
  farmers_walk: { progressionType: "distance-first", weightIncrement: 5, repRange: [50, 70], rirTarget: 2, restTime: 90, cue: 'Building grip and core' },
  battle_rope: { progressionType: "time-first", weightIncrement: 0, repRange: [40, 60], rirTarget: 1, restTime: 60, cue: 'Building conditioning' },
  push_ups: { progressionType: "rep-first", weightIncrement: 0, repRange: [12, 20], rirTarget: 2, restTime: 60, cue: 'Building pushing endurance' }
};
const defaultProgressionConfig = { progressionType: "rep-first", weightIncrement: 5, repRange: [8, 12], rirTarget: 2, restTime: 90, cue: 'Progressing within range' };

// Warm-up sets are excluded from all progression math. Old sessions have no
// warmup flags, so they pass through unchanged.
const getWorkingSets = (session) => {
  const sets = session?.sets || [];
  const working = sets.filter(s => !s.warmup);
  return working.length > 0 ? working : sets;
};

// Sets that were actually performed. Rows left unchecked still hold their
// pre-filled numbers, so they must not count toward rep averages. Entries with
// nothing checked (skipped) fall back to all working sets.
const getPerformedSets = (session) => {
  const working = getWorkingSets(session);
  const done = working.filter(s => s.completed);
  return done.length > 0 ? done : working;
};
// One step up or down in load: along config.weightSteps when the exercise has a fixed
// ladder (dumbbells), otherwise by a flat increment.
const stepWeight = (config, weight, dir, inc = config.weightIncrement || 5) => {
  const steps = config.weightSteps;
  if (!steps) return Math.max(0, weight + dir * inc);
  const next = dir > 0 ? steps.find(w => w > weight) : [...steps].reverse().find(w => w < weight);
  return next ?? weight;
};
const avgRepsOf = (sets) => sets.reduce((a, s) => a + s.reps, 0) / Math.max(1, sets.length);

// Single progression engine: hit the top of the rep range on every working
// set -> add weight; average below the bottom -> reduce; otherwise build reps.
// Assisted exercises (config.assisted) invert: logged weight is machine
// assistance, so progress = LESS weight, and 0 = full bodyweight.
const runProgression = (config, lastSession) => {
  const working = getWorkingSets(lastSession);
  const sets = getPerformedSets(lastSession);
  if (sets.length === 0) return { action: 'maintain', reason: config.cue || 'Building within rep range' };
  const avgReps = avgRepsOf(sets);
  const [low, high] = config.repRange;
  const minReps = Math.min(...sets.map(s => s.reps));
  // "Every set hits the top": all working sets checked off, none short of it
  const hitTop = working.every(s => s.completed) && minReps >= high;
  // Optional one-tap rating of the last set: 'easy' = 3+ reps left
  const easy = lastSession.effort === 'easy';
  // Number-agnostic increments for the big lifts: ~2% of the load rounded to 5, never below 5
  const load = sets[0]?.weight || 0;
  const flatInc = config.incrementPct ? Math.max(5, Math.round((load * config.incrementPct) / 5) * 5) : config.weightIncrement;
  const up = stepWeight(config, load, 1, flatInc), down = stepWeight(config, load, -1, flatInc);
  // On a ladder the step size depends on where you are, so derive it from the neighbours
  const inc = config.weightSteps ? (up - load || load - down) : flatInc;
  if (config.assisted) {
    const assist = sets[0]?.weight ?? 0;
    if (hitTop) {
      return assist <= 0
        ? { action: 'maintain', reason: `Bodyweight × ${high}+! Time to switch to weighted` }
        : { action: 'decrease', amount: inc, isProgress: true, reason: `Hit ${high}+ on every set → Reduce assistance ${inc} lbs` };
    }
    if (avgReps < low) return { action: 'increase', amount: inc, isRegress: true, reason: `Below ${low} reps → Add ${inc} lbs assistance` };
    return { action: 'maintain', reason: config.cue || 'Building within rep range' };
  }
  if (hitTop) {
    // Every set blew through the range -> double jump so a range can't strand you
    const bigJump = inc > 0 && (minReps >= high + 2 || easy);
    const amount = config.weightSteps ? stepWeight(config, bigJump ? up : load, 1) - load : bigJump ? inc * 2 : inc;
    return inc > 0
      ? { action: 'increase', amount, reason: bigJump ? `${minReps >= high + 2 ? `Every set ${high + 2}+` : `Hit ${high}+ and it felt easy`} → Add ${amount} lbs (double jump)` : `Hit ${high}+ on every set → Add ${amount} lbs` }
      : { action: 'progress', reason: `Hit ${high}+ → Progress difficulty (ROM, pause, or add weight)` };
  }
  if (avgReps < low) {
    return inc > 0
      ? { action: 'decrease', amount: load - down, reason: `Below ${low} reps → Drop ${load - down} lbs` }
      : { action: 'regress', reason: `Below ${low} reps → Use an easier variation` };
  }
  if (easy && avgReps >= low) return { action: 'maintain', reason: `Felt easy last time → push for ${high} on every set` };
  return { action: 'maintain', reason: config.cue || 'Building within rep range' };
};

// Per-exercise overrides in workout data (exercise.progression) win over the
// shared config, so the same movement can be strength-biased in one program
// and hypertrophy-biased in another without forking its logged history.
const getExerciseConfig = (exercise) => ({
  ...(progressionConfig[exercise.id] || defaultProgressionConfig),
  ...(exercise.progression || {})
});

const muscleColors = { shoulders: '#f97316', triceps: '#ef4444', chest: '#ec4899', upperChest: '#f472b6', lats: '#8b5cf6', traps: '#a855f7', biceps: '#3b82f6', rearDelts: '#f59e0b', sideDelts: '#fb923c', forearms: '#6366f1', abs: '#10b981', hamstrings: '#14b8a6', glutes: '#06b6d4', quads: '#22d3d1', calves: '#84cc16' };

// Epley estimate of a one-rep max from one set
const e1rm = (s) => s.weight * (1 + s.reps / 30);

// What one session is worth on the progress chart. Rep-based lifts use the best set's
// estimated 1RM, so more reps at the same weight shows as progress. Bodyweight lifts
// use best reps. Carries, sleds and assisted lifts use the load itself.
const sessionMetric = (entry, config) => {
  const sets = getPerformedSets(entry);
  if (sets.length === 0) return null;
  if (config.assisted || config.progressionType === 'distance-first' || config.progressionType === 'time-first') return { v: sets[0].weight, label: 'LOAD', unit: ' lb' };
  if (Math.max(...sets.map(s => s.weight)) <= 0) return { v: Math.max(...sets.map(s => s.reps)), label: 'BEST REPS', unit: '' };
  const best = Math.max(...sets.map(e1rm));
  return { v: best < 50 ? Math.round(best * 10) / 10 : Math.round(best), label: 'EST. 1RM', unit: ' lb' };
};

// Trend across all logged sessions. For assisted exercises the load going DOWN is progress.
const ProgressSpark = ({ entries, accent, config }) => {
  const all = entries.filter(e => !e.skipped).map(e => ({ d: new Date(e.date), m: sessionMetric(e, config) })).filter(p => p.m);
  const kind = all.length ? all[all.length - 1].m.label : null;
  const pts = all.filter(p => p.m.label === kind);
  if (pts.length < 3) return null;
  const unit = pts[0].m.unit;
  const ws = pts.map(p => p.m.v);
  const min = Math.min(...ws), max = Math.max(...ws);
  const span = Math.max(max - min, 1);
  const W = 280, H = 24, P = 4;
  const x = (i) => P + (i / (pts.length - 1)) * (W - 2 * P);
  const y = (w) => H - P - ((w - min) / span) * (H - 2 * P);
  const line = pts.map((p, i) => `${x(i).toFixed(1)},${y(p.m.v).toFixed(1)}`).join(' ');
  const delta = Math.round((ws[ws.length - 1] - ws[0]) * 10) / 10;
  const improved = config.assisted ? delta < 0 : delta > 0;
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return (
    <div className="mb-2 px-3 py-1.5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-[10px] text-zinc-500 font-medium">{kind} · {pts.length} SESSIONS{config.assisted ? ' · LOWER = BETTER' : ''} <span className="text-zinc-600" style={{ fontWeight: 400 }}>· {fmt(pts[0].d)} {ws[0]} → {fmt(pts[pts.length - 1].d)} {ws[ws.length - 1]}{unit}</span></span>
        <span className={`text-[10px] font-semibold ${improved ? 'text-emerald-400' : delta === 0 ? 'text-zinc-500' : 'text-amber-400'}`}>{delta > 0 ? '+' : ''}{delta}{unit}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} preserveAspectRatio="none">
        <polyline points={line} fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(pts.length - 1)} cy={y(ws[ws.length - 1])} r="3" fill={accent} />
      </svg>
    </div>
  );
};

// One loggable set: check button, weight stepper, reps stepper. Shared by the workout
// screen and the history editor.
const SetRow = ({ set, label, accent, config, onToggle, onChange, onCopy }) => (
  <div className={`set-row rounded-lg border ${set.completed ? 'border-emerald-500/50 bg-emerald-500/10' : set.warmup ? 'border-amber-500/30 bg-amber-500/5' : 'border-zinc-800/50 bg-zinc-900/30'}`} style={{ padding: '3px 6px' }}>
    <div className="flex items-center gap-2">
      <button onClick={onToggle} className={`w-9 h-11 rounded-lg flex items-center justify-center transition-all active:scale-90 flex-shrink-0 text-xs font-bold ${set.completed ? 'bg-emerald-500 text-white' : set.warmup ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800 text-zinc-500'}`}>
        {set.completed ? <Check className="w-4 h-4" /> : label}
      </button>
      <div className="flex items-center gap-1 flex-1">
        <StepBtn accent={accent} onClick={() => onChange('weight', stepWeight(config, set.weight, -1))}>−</StepBtn>
        <div className="flex-1 text-center text-lg font-bold text-zinc-100">{set.weight}</div>
        <StepBtn accent={accent} onClick={() => onChange('weight', stepWeight(config, set.weight, 1))}>+</StepBtn>
      </div>
      <div className="w-px h-6 bg-zinc-800" />
      <div className="flex items-center gap-1 flex-1">
        <StepBtn accent={accent} onClick={() => onChange('reps', Math.max(1, set.reps - 1))}>−</StepBtn>
        <div className="flex-1 text-center text-lg font-bold text-zinc-100">{set.reps}</div>
        <StepBtn accent={accent} onClick={() => onChange('reps', set.reps + 1)}>+</StepBtn>
      </div>
      {onCopy ? (
        <button onClick={onCopy} className="w-8 h-11 rounded flex items-center justify-center text-zinc-600 hover:text-zinc-400 active:scale-90" title="Copy previous set">
          <Copy className="w-3.5 h-3.5" />
        </button>
      ) : (
        <div className="w-8 h-11 flex-shrink-0" />
      )}
    </div>
  </div>
);
// Row label: W for warm-ups, otherwise the working-set number
const setLabel = (sets, i) => sets[i].warmup ? 'W' : i + 1 - sets.slice(0, i).filter(s => s.warmup).length;

// How the last set felt. Optional: untouched means "about right". Easy = 3 or more
// reps left, Max = nothing left. One tap to set, same tap to clear.
const EffortChips = ({ value, onChange, accent }) => (
  <div className="effort-chips flex items-center gap-1 flex-shrink-0">
    <span className="text-[9px] text-zinc-600">last set</span>
    {[['easy', 'Easy'], ['max', 'Max']].map(([k, label]) => (
      <button key={k} onClick={() => onChange(value === k ? null : k)} className="rounded-lg text-[10px] font-medium transition-all active:scale-90" style={{ height: 26, padding: '0 10px', border: `1px solid ${value === k ? accent : '#27272a'}`, background: value === k ? `${accent}25` : 'transparent', color: value === k ? accent : '#71717a' }}>{label}</button>
    ))}
  </div>
);

// A superset pair (adjacent exercises sharing a superset number) is logged on one
// screen. Returns the exercise positions that belong on the screen for position i.
const unitOf = (exercises, i) => {
  const g = exercises[i]?.superset;
  if (!g) return [i];
  if (exercises[i + 1]?.superset === g) return [i, i + 1];
  if (exercises[i - 1]?.superset === g) return [i - 1, i];
  return [i];
};

// History: every logged workout of a program, newest first. A workout is all entries
// of one day key on one local calendar day.
const listSessions = (programLog) => {
  const map = {};
  const slot = (day, date) => {
    const key = localDay(date);
    const id = day + '|' + key;
    if (!map[id]) map[id] = { day, key, date, meta: null, entries: [] };
    if (new Date(date) > new Date(map[id].date)) map[id].date = date;
    return map[id];
  };
  Object.entries(programLog || {}).forEach(([day, d]) => {
    (d?.sessions || []).forEach(sess => { if (sess?.date) slot(day, sess.date).meta = sess; });
    Object.entries(d?.exercises || {}).forEach(([id, list]) => (list || []).forEach(entry => { if (entry?.date) slot(day, entry.date).entries.push({ id, entry }); }));
  });
  return Object.values(map).sort((a, b) => new Date(b.date) - new Date(a.date));
};
// Keep an edited entry's summary fields in step with its sets
const normalizeEntry = (e) => {
  const work = e.sets.filter(s => !s.warmup);
  const ref = work.length > 0 ? work : e.sets;
  return { ...e, weight: ref[0]?.weight || 0, skipped: !ref.some(s => s.completed) };
};

// Shown when a write to localStorage failed (storage full or blocked). Inline styles:
// the static Tailwind build has no red utilities.
const StorageWarning = ({ onBackup }) => (
  <button onClick={onBackup} className="storage-warning mt-2 w-full text-left px-3 py-2 rounded-lg text-[11px]" style={{ border: '1px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.12)', color: '#fca5a5' }}>
    Saving to this phone failed, so your latest workout is not stored. Tap here to download a backup now.
  </button>
);

// +/- stepper button on the set rows
const StepBtn = ({ onClick, accent, children }) => (
  <button onClick={onClick} className="w-11 h-11 rounded-lg flex items-center justify-center text-lg font-bold transition-all active:scale-90 flex-shrink-0" style={{ background: `${accent}20`, color: accent }}>{children}</button>
);

// Workout data
const workoutData4Day = {
  day1: { name: "Upper Power", focus: "Log strength · heavy incline · pull-up", mobility: [
    "Foam-roller T-spine extensions · 3×5 breaths",
    "Band pull-aparts ×15 + band dislocates ×8",
    "Overhead lat stretch, elbows on bench · 2×20 s",
    "Half-kneeling band overhead reach · 5/side",
    "Empty log press ×8 with a 2 s pause → first ramp set"
  ], exercises: [
    { id: "log_press", name: "Log Strict Press / Standing DB Press", sets: 4, warmupSets: 1, reps: "3-5", defaultWeight: 95, muscles: ["shoulders", "triceps", "chest"], notes: "1 ramp, then 3 heavy · 3 min rest. Every other loop add 1 AMRAP set at ~75-80% (clean once, press for reps)" },
    { id: "pullup", name: "Assisted Pull-up / Assisted Chin-up", sets: 3, reps: "4-6", defaultWeight: 60, muscles: ["lats", "biceps", "rearDelts"], notes: "Back strength lift, between the two presses · weight = assistance, less is harder · goal: 0 = bodyweight, then add weight" },
    { id: "incline_bb", name: "Incline Barbell Press (30°) / Smith Incline", sets: 4, warmupSets: 1, reps: "6-10", defaultWeight: 115, muscles: ["upperChest", "shoulders", "triceps"], notes: "1 feeder, then 3 heavy · 2 min rest", progression: { repRange: [6, 10], restTime: 120 } },
    { id: "bayesian_curl", name: "Bayesian Cable Curl / Incline DB Curl", sets: 3, reps: "8-12", defaultWeight: 25, muscles: ["biceps"], notes: "⇄ Superset with face pulls · arm behind torso, full stretch, last set to failure", superset: 1, progression: { repRange: [8, 12], restTime: 75 } },
    { id: "face_pull", name: "Face Pull / Rear Delt Fly", sets: 3, reps: "15-20", defaultWeight: 40, muscles: ["rearDelts", "traps"], notes: "⇄ Superset with curls · shoulder health > load", superset: 1 }
  ]},
  day2: { name: "Lower Power · Deadlift", focus: "Deadlift strength · light squat · quads · carry", mobility: [
    "Cat-cow, slow segmental · 8 reps",
    "90/90 hip switches, no hands · 5/side",
    "Hip airplanes with a hand on the rack · 5/side",
    "Weighted knee-to-wall (KB on knee) · 10/side",
    "Empty-bar RDL ×8, 3 s eccentric → first ramp set"
  ], exercises: [
    { id: "deadlift", name: "Conventional Deadlift / Trap Bar Deadlift", sets: 5, warmupSets: 2, reps: "4-6", defaultWeight: 225, muscles: ["hamstrings", "glutes", "lats", "traps", "forearms"], notes: "2 ramp, then 3 heavy · 3 min · heavy day? add an ~85% single first", progression: { incrementPct: 0.02, stallReset: true } },
    { id: "squat_light", name: "Light Squat / Paused Squat", sets: 3, warmupSets: 1, reps: "3-5", defaultWeight: 120, muscles: ["quads", "glutes", "hamstrings"], notes: "Weight is set for you at ~78% of squat day · 2 min · every rep crisp. Skip only if the deadlift was a grind" },
    { id: "hack_squat", name: "Hack Squat / Leg Press", sets: 4, warmupSets: 1, reps: "6-10", defaultWeight: 180, muscles: ["quads", "glutes"], notes: "1 feeder, then 3 at weight · 90 s · push hard", progression: { restTime: 90 } },
    { id: "leg_curl", name: "Leg Curl / Nordic Curl", sets: 3, reps: "8-12", defaultWeight: 90, muscles: ["hamstrings"], notes: "⇄ Superset with leg extension · control the negative", superset: 1, progression: { progressionType: "load-first", repRange: [8, 12], restTime: 75 } },
    { id: "leg_ext", name: "Leg Extension / Sissy Squat", sets: 3, reps: "10-15", defaultWeight: 100, muscles: ["quads"], notes: "⇄ Superset with leg curl · 1-2 reps in reserve", superset: 1, progression: { progressionType: "load-first", repRange: [10, 15], restTime: 60 } },
    { id: "farmers_walk", name: "Farmer's Walk / Suitcase Carry", sets: 3, reps: "50-70 ft", defaultWeight: 70, muscles: ["traps", "forearms", "abs"], notes: "Per hand, heavy · 90 s · distance before load · last, so grip fatigue can't hurt anything" }
  ]},
  day3: { name: "Upper Size", focus: "Upper chest volume · arms · delts", mobility: [
    "Foam-roller T-spine extensions · 2×5 breaths",
    "Doorway / rack pec stretch, elbow at 90° · 30 s/side",
    "Wall slides · 10",
    "Band face pulls · 15",
    "Light incline DB press ×12, 2 s pause at bottom → first ramp set"
  ], exercises: [
    { id: "incline_db", name: "Incline Dumbbell Press (30°) / Machine Incline", sets: 4, warmupSets: 1, reps: "6-10", defaultWeight: 50, muscles: ["upperChest", "shoulders", "triceps"], notes: "1 feeder, then 3 working · deep stretch · 2 min", progression: { repRange: [6, 10], restTime: 120 } },
    { id: "cable_row", name: "Cable Row / Machine Row", sets: 3, reps: "8-12", defaultWeight: 120, muscles: ["lats", "traps", "biceps"], notes: "Between the two presses · squeeze, don't heave · 90 s", progression: { repRange: [8, 12], restTime: 75 } },
    { id: "incline_machine", name: "Incline Machine Press (30°) / Incline Smith", sets: 3, reps: "8-12", defaultWeight: 120, muscles: ["upperChest", "shoulders", "triceps"], notes: "Second chest exposure, after the row · 0-1 reps in reserve · 90 s" },
    { id: "lean_tri_ext", name: "Leaning Tricep Extension / Tricep Pushdown", sets: 3, reps: "8-15", defaultWeight: 30, muscles: ["triceps"], notes: "⇄ Superset with EZ curl · face away, lean forward, press forward · last set to failure", superset: 1 },
    { id: "high_rep_curl", name: "EZ Bar Curl / Cable Curl", sets: 3, reps: "6-10", defaultWeight: 55, muscles: ["biceps"], notes: "⇄ Superset with tricep extension · heavy, strict, full range", superset: 1, progression: { progressionType: "load-first", repRange: [6, 10], restTime: 75 } },
    { id: "lateral_raise", name: "Lateral Raise + Bent-Over Fly / Cable Lateral", sets: 2, reps: "7-12", defaultWeight: 10, muscles: ["sideDelts", "rearDelts"], notes: "Side raise + bent-over fly back to back = 1 set · start 7 reps, build to 12 · 60 s" }
  ]},
  day4: { name: "Lower Size · Squat", focus: "Squat strength · light deadlift · posterior chain · sled", mobility: [
    "Weighted knee-to-wall (KB or plate on knee) · 10/side",
    "Adductor rock-backs · 8/side",
    "Goblet deep-squat pry with a 10-25 lb plate · 3×5 breaths",
    "90/90 hip switches · 5/side",
    "Empty-bar squat ×8 with a 3 s pause at depth → first ramp set"
  ], exercises: [
    { id: "squat", name: "Barbell Squat / Front Squat", sets: 5, warmupSets: 2, reps: "4-6", defaultWeight: 155, muscles: ["quads", "glutes", "hamstrings"], notes: "2 ramp (~50%/70%), then 3 heavy · 3 min", progression: { repRange: [4, 6], incrementPct: 0.02, stallReset: true } },
    { id: "deadlift_light", name: "Light Deadlift / Trap Bar Deadlift", sets: 3, warmupSets: 1, reps: "3", defaultWeight: 175, muscles: ["hamstrings", "glutes", "lats"], notes: "Weight is set for you at ~78% of deadlift day · 2 min · reset every rep. Trap bar when the back is beat" },
    { id: "leg_press", name: "Leg Press / Bulgarian Split Squat", sets: 4, warmupSets: 1, reps: "8-12", defaultWeight: 270, muscles: ["quads", "glutes"], notes: "1 feeder, then 3 at weight · 90 s", progression: { restTime: 90 } },
    { id: "back_extension", name: "45° Back Extension / Reverse Hyper", sets: 3, reps: "10-15", defaultWeight: 0, muscles: ["hamstrings", "glutes"], notes: "⇄ Superset with calves · hold a plate, full hip flexion at the bottom", superset: 1, progression: { repRange: [10, 15], restTime: 60 } },
    { id: "calf_raise", name: "Calf Raises / Seated Calf", sets: 3, reps: "12-20", defaultWeight: 150, muscles: ["calves"], notes: "⇄ Superset with back extension · full range, pause at the stretch", superset: 1 },
    { id: "sled_push", name: "Sled Push / Prowler Push", sets: 4, reps: "50-65 ft", defaultWeight: 90, muscles: ["quads", "glutes", "calves"], notes: "Heavy · each trip 20-30 s · 90 s rest · concentric only, so no soreness. Drop if over 50 min" }
  ]},
  day5: { name: "Arms + Shoulders", focus: "Dips toward bodyweight · triceps · biceps · delts · pull", mobility: [
    "Shoulder CARs, slow full circles · 3/side",
    "Band external rotation ×15 + pull-aparts ×15",
    "Wrist flexor / extensor stretch on the floor · 20 s each",
    "Overhead lat stretch · 2×20 s",
    "Light lateral raises ×15 + hammer curls ×15 → first working set"
  ], exercises: [
    { id: "dips", name: "Assisted Dips / Machine Dip", sets: 3, reps: "6-10", defaultWeight: 60, muscles: ["triceps", "chest"], notes: "⇄ Superset with pulldown · weight = assistance, less is harder · goal: 0 = bodyweight", superset: 1, progression: { repRange: [6, 10], restTime: 90 } },
    { id: "lat_pulldown", name: "Lat Pulldown / Pull-ups", sets: 3, reps: "6-10", defaultWeight: 100, muscles: ["lats", "biceps"], notes: "⇄ Superset with dips · counts as biceps work too", superset: 1, progression: { progressionType: "load-first", repRange: [6, 10], restTime: 90 } },
    { id: "lean_tri_ext", name: "Leaning Tricep Extension / Tricep Pushdown", sets: 3, reps: "8-15", defaultWeight: 30, muscles: ["triceps"], notes: "⇄ Superset with hammer curls · face away, lean forward, press forward", superset: 2 },
    { id: "hammer_curl", name: "Hammer Curl / Cross-Body Curl", sets: 3, reps: "10-15", defaultWeight: 25, muscles: ["biceps", "forearms"], notes: "⇄ Superset with tricep extension · brachialis + grip for the log and carries", superset: 2, progression: { restTime: 75 } },
    { id: "lateral_raise", name: "Lateral Raise + Bent-Over Fly / Cable Lateral", sets: 2, reps: "7-12", defaultWeight: 10, muscles: ["sideDelts", "rearDelts"], notes: "Side raise + bent-over fly back to back = 1 set · start 7 reps, build to 12 · 60 s" }
  ]},
  day6: { name: "Strongman Conditioning", focus: "Sled · carries · back extension · no pressing", mobility: [
    "Ankle rocks / bodyweight knee-to-wall · 10/side",
    "Walking lunge with overhead reach · 10 steps",
    "Spiderman lunge with T-spine rotation · 5/side",
    "Cossack squats · 6/side",
    "Light farmer's carry 60 ft out and back → first sled trip"
  ], exercises: [
    { id: "sled_push", name: "Sled Push / Prowler Push", sets: 6, reps: "50-65 ft", defaultWeight: 90, muscles: ["quads", "glutes", "calves"], notes: "Heavy · 90 s rest · ~12 min total" },
    { id: "sled_drag", name: "Backward Sled Drag / Sled Pull", sets: 4, reps: "80-100 ft", defaultWeight: 70, muscles: ["quads", "calves"], notes: "Moderate · short steps, knees over toes · 60 s" },
    { id: "back_extension", name: "45° Back Extension / Reverse Hyper", sets: 3, reps: "12-15", defaultWeight: 0, muscles: ["hamstrings", "glutes"], notes: "Hold a plate · 60 s", progression: { repRange: [12, 15], restTime: 60 } },
    { id: "farmers_walk", name: "Farmer's Walk / Suitcase Carry", sets: 4, reps: "50-70 ft", defaultWeight: 55, muscles: ["traps", "forearms", "abs"], notes: "~80% of your deadlift-day carry · grip endurance, not max · 90 s" },
    { id: "suitcase_carry", name: "Suitcase Carry / One-Arm Farmer's", sets: 3, reps: "60-80 ft", defaultWeight: 70, muscles: ["abs", "forearms", "traps"], notes: "Per side · hips level, no lean · 60 s" }
  ]}
};

const workoutData3Day = {
  day1: { name: "Lower Power + Upper Maintenance", focus: "Heavy glute loading, hip hinge strength", exercises: [
    { id: "deadlift", name: "Sumo Deadlift / Conventional Deadlift", sets: 4, reps: "4-6", defaultWeight: 185, muscles: ["glutes", "hamstrings", "lats", "traps"], notes: "Heavy, 2-3 min rest" },
    { id: "hip_thrust", name: "Barbell Hip Thrust / Machine Hip Thrust", sets: 4, reps: "5-8", defaultWeight: 135, muscles: ["glutes", "hamstrings"], notes: "Progress fast - squeeze at top" },
    { id: "db_bench", name: "DB Bench Press / Machine Chest Press", sets: 3, reps: "8-12", defaultWeight: 35, muscles: ["chest", "triceps"], notes: "Upper maintenance" },
    { id: "cable_row", name: "Cable Row / Machine Row", sets: 3, reps: "10-12", defaultWeight: 100, muscles: ["lats", "traps", "biceps"], notes: "Upper maintenance" },
    { id: "bulgarian_split", name: "Bulgarian Split Squat / Reverse Lunge", sets: 3, reps: "8-12", defaultWeight: 30, muscles: ["glutes", "quads"], notes: "Balance before load" }
  ]},
  day2: { name: "Full Body Hypertrophy", focus: "Glute volume, unilateral work", exercises: [
    { id: "rdl", name: "Romanian Deadlift / Stiff-Leg Deadlift", sets: 4, reps: "8-12", defaultWeight: 95, muscles: ["hamstrings", "glutes"], notes: "Form > load, feel stretch" },
    { id: "walking_lunge", name: "Walking Lunges / Stationary Lunges", sets: 3, reps: "24-30 steps", defaultWeight: 25, muscles: ["glutes", "quads"], notes: "Per DB, metabolic stress" },
    { id: "step_up", name: "Diagonal Step-Up / Box Step-Up", sets: 3, reps: "10-12", defaultWeight: 20, muscles: ["glutes", "quads"], notes: "Highest glute EMG activation" },
    { id: "log_press", name: "Log Press / Standing DB Press", sets: 3, reps: "3-5", defaultWeight: 70, muscles: ["shoulders", "triceps"], notes: "Primary press - microplates!" },
    { id: "lat_pulldown", name: "Lat Pulldown / Assisted Pull-ups", sets: 3, reps: "10-12", defaultWeight: 100, muscles: ["lats", "biceps"], notes: "Upper maintenance" },
    { id: "cable_kickback", name: "Cable Kickback / Donkey Kick", sets: 3, reps: "12-15", defaultWeight: 25, muscles: ["glutes"], notes: "Mind-muscle connection" }
  ]},
  day3: { name: "Lower Volume + Finisher", focus: "Glute pump, quad balance", exercises: [
    { id: "hip_thrust", name: "Hip Thrust / Glute Bridge", sets: 3, reps: "12-15", defaultWeight: 115, muscles: ["glutes"], notes: "Focus on squeeze/contraction", progression: { repRange: [12, 15] } },
    { id: "leg_press", name: "Leg Press / Hack Squat", sets: 3, reps: "8-12", defaultWeight: 200, muscles: ["glutes", "quads"], notes: "Glute-biased foot position" },
    { id: "leg_curl", name: "Leg Curl / Nordic Curl", sets: 3, reps: "8-12", defaultWeight: 70, muscles: ["hamstrings"], notes: "Control negative" },
    { id: "leg_ext", name: "Leg Extension / Sissy Squat", sets: 3, reps: "10-12", defaultWeight: 80, muscles: ["quads"], notes: "Controlled reps for knee health" },
    { id: "single_leg_rdl", name: "Single-Leg RDL / Kickstand RDL", sets: 3, reps: "10-12", defaultWeight: 25, muscles: ["glutes", "hamstrings"], notes: "Balance first, then load" },
    { id: "push_ups", name: "Push-ups / Knee Push-ups", sets: 3, reps: "12-20", defaultWeight: 0, muscles: ["chest", "triceps"], notes: "Upper maintenance" },
    { id: "face_pull", name: "Face Pulls / Band Pull-Aparts", sets: 3, reps: "15-20", defaultWeight: 35, muscles: ["rearDelts", "traps"], notes: "Shoulder health > ego" },
    { id: "calf_raise", name: "Calf Raises / Seated Calf Raise", sets: 3, reps: "12-20", defaultWeight: 120, muscles: ["calves"], notes: "Full ROM, patient progression" }
  ]}
};

// CSV dates are local calendar days written as YYYY-MM-DD, so they read the same in
// every locale and time zone. Older exports used the phone's locale format.
const localDay = (d) => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
const parseCSVDate = (str) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(str).trim()); return m ? new Date(+m[1], +m[2] - 1, +m[3], 12) : new Date(str); };
const csvCell = (v) => { const t = String(v ?? ''); return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };

// Minimal CSV parser: quoted fields, doubled quotes, newlines inside quotes.
const parseCSV = (text) => {
  const rows = []; let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(x => x !== ''));
};

// Exercise names from earlier versions of the program, so a CSV export made
// back then still imports. History stays under the old ID.
const retiredExerciseNames = {
  'pause squat': { id: 'pause_squat', alt: false }, 'front squat': { id: 'pause_squat', alt: true },
  'preacher curl': { id: 'preacher_curl', alt: false }, 'concentration curl': { id: 'preacher_curl', alt: true },
  'machine chest press': { id: 'machine_chest', alt: false }, 'cable crossover': { id: 'machine_chest', alt: true },
  'rope pushdown': { id: 'pushdown', alt: false }, 'v-bar pushdown': { id: 'pushdown', alt: true },
  'incline dumbbell curl': { id: 'incline_curl', alt: false }, 'bayesian curl': { id: 'incline_curl', alt: true },
  'bent + side lateral': { id: 'bent_lateral', alt: false }, 'rear delt machine': { id: 'bent_lateral', alt: true },
  'low-to-high cable fly': { id: 'low_high_fly', alt: false }, 'incline db fly': { id: 'low_high_fly', alt: true },
  'seated cable row': { id: 'seated_row', alt: false }, 't-bar row': { id: 'seated_row', alt: true },
  'log press': { id: 'log_press', alt: false },
  'incline dumbbell press (30°)': { id: 'incline_db', alt: false }, 'machine incline': { id: 'incline_db', alt: true },
  'incline barbell press (30°)': { id: 'incline_bb', alt: false }, 'smith incline': { id: 'incline_bb', alt: true },
  'overhead tricep extension': { id: 'overhead_tri', alt: false }, 'skull crushers': { id: 'overhead_tri', alt: true },
  'ez bar curl': { id: 'high_rep_curl', alt: false }, 'cable curl': { id: 'high_rep_curl', alt: true },
  'lateral raise': { id: 'lateral_raise', alt: false },
  'seated row machine': { id: 'seated_row', alt: false },
  'lat pulldown': { id: 'lat_pulldown', alt: false }, 'pull-ups': { id: 'lat_pulldown', alt: true }, 'assisted pull-ups': { id: 'lat_pulldown', alt: true }
};

const programConfigs = {
  '4day': { name: "Strongman Hypertrophy", subtitle: "6-Day Rotation · Power + Size + Strongman", data: workoutData4Day, dayCount: 6, icon: Dumbbell, gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', bgGradient: 'linear-gradient(180deg, #0a0a0f 0%, #0f0f18 100%)', dayAccents: { day1: '#3b82f6', day2: '#10b981', day3: '#8b5cf6', day4: '#f97316', day5: '#ec4899', day6: '#eab308' } },
  '3day': { name: "Peach Protocol", subtitle: "3-Day Glute & Core Sculpt", data: workoutData3Day, dayCount: 3, icon: Sparkles, gradient: 'linear-gradient(135deg, #f472b6 0%, #fb923c 100%)', bgGradient: 'linear-gradient(180deg, #0f0a0d 0%, #1a0f14 100%)', dayAccents: { day1: '#f472b6', day2: '#fb7185', day3: '#fb923c' } }
};

// In-progress workouts are checkpointed to localStorage so a phone refresh or
// accidental close at the gym doesn't lose logged sets. A checkpoint is only
// usable for 12 hours and only while the day still has the same exercises in the
// same order (set data is keyed by position).
const ACTIVE_SESSION_KEY = 'activeWorkoutSession';
const loadActiveSession = () => {
  try {
    const s = JSON.parse(localStorage.getItem(ACTIVE_SESSION_KEY));
    const exercises = programConfigs[s?.program]?.data[s?.day]?.exercises;
    if (!exercises || !s.sessionData || Object.keys(s.sessionData).length === 0) return null;
    if ((Date.now() - new Date(s.savedAt).getTime()) / 36e5 >= 12) return null;
    if (Array.isArray(s.exerciseIds) && s.exerciseIds.join('|') !== exercises.map(e => e.id).join('|')) return null;
    return s;
  } catch { return null; }
};
const loadLastProgram = () => {
  try { const p = localStorage.getItem('lastProgram'); return programConfigs[p] ? p : null; } catch { return null; }
};

// Main App
function WorkoutApp() {
  // After a reload: an unfinished workout reopens on its day (Resume button), otherwise
  // the last-used program opens on its home screen
  const [boot] = useState(() => { const active = loadActiveSession(); return { active, program: active?.program || loadLastProgram() }; });
  const [view, setView] = useState(boot.active ? 'dayOverview' : boot.program ? 'home' : 'programSelect');
  const [selectedProgram, setSelectedProgram] = useState(boot.program);
  const [selectedDay, setSelectedDay] = useState(boot.active ? boot.active.day : null);
  // Set when a write to localStorage fails, so a lost save is never silent
  const [storageError, setStorageError] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // Separate localStorage for each program (different users)
  const getStorageKey = (program) => `workoutLog_${program}`;
  const [workoutLog, setWorkoutLog] = useState(() => {
    // Load data for all programs
    const logs = {};
    ['4day', '3day'].forEach(prog => {
      try {
        const data = localStorage.getItem(getStorageKey(prog));
        if (data) logs[prog] = JSON.parse(data);
      } catch {}
    });
    return logs;
  });

  // Session state - only saved at workout completion
  const [sessionData, setSessionData] = useState({});
  // Position of the exercise whose notes box is open, or null
  const [notesOpen, setNotesOpen] = useState(null);
  // History screen: which logged workout is open ({ day, key })
  const [historySel, setHistorySel] = useState(null);
  const [infoExerciseId, setInfoExerciseId] = useState(null);
  const [useAltExercise, setUseAltExercise] = useState({});
  // Pre-workout ab routine: tracked as a simple done/not-done per session,
  // no sets or reps - the routine itself lives outside the app
  const [absDone, setAbsDone] = useState(false);
  // Which day the in-memory session belongs to: jumping between exercises
  // keeps the session, but opening a different day must not inherit it
  const [sessionDay, setSessionDay] = useState(null);
  const [workoutStartedAt, setWorkoutStartedAt] = useState(null);
  const [lastDurationMin, setLastDurationMin] = useState(null);
  const [completedPRs, setCompletedPRs] = useState([]);
  const [lastBackupAt, setLastBackupAt] = useState(() => {
    try { return localStorage.getItem('lastBackupAt'); } catch { return null; }
  });

  // Save each program's data separately
  useEffect(() => {
    if (selectedProgram && workoutLog[selectedProgram]) {
      try {
        localStorage.setItem(getStorageKey(selectedProgram), JSON.stringify(workoutLog[selectedProgram]));
      } catch { setStorageError(true); }
    }
  }, [workoutLog, selectedProgram]);

  // Checkpoint in-progress workout (sets + notes) so nothing is lost if
  // the browser reloads mid-session
  useEffect(() => {
    if ((view === 'exercise' || view === 'summary') && Object.keys(sessionData).length > 0) {
      try {
        localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({
          program: selectedProgram, day: selectedDay, sessionData, useAltExercise, absDone,
          exerciseIds: programConfigs[selectedProgram].data[selectedDay].exercises.map(e => e.id),
          startedAt: workoutStartedAt,
          savedAt: new Date().toISOString()
        }));
      } catch {}
    }
  }, [sessionData, useAltExercise, absDone, view]);

  // Shared progression: the same exercise done on any day of this program
  // pulls from one history, so leg curls on Day 2 and Day 4 progress together.
  // Programs stay separate (they are separate users' logs).
  const getLastSession = (exerciseId) => {
    if (!selectedProgram) return null;
    const programLog = workoutLog[selectedProgram] || {};
    let latest = null;
    Object.values(programLog).forEach(dayLog => {
      (dayLog?.exercises?.[exerciseId] || []).forEach(entry => {
        if (!latest || new Date(entry.date) > new Date(latest.date)) latest = entry;
      });
    });
    return latest;
  };
  // Full history for one exercise across all days, oldest first - feeds
  // the progress chart and PR detection
  const getAllSessions = (exerciseId) => {
    if (!selectedProgram) return [];
    const programLog = workoutLog[selectedProgram] || {};
    const all = [];
    Object.values(programLog).forEach(dayLog => {
      (dayLog?.exercises?.[exerciseId] || []).forEach(entry => all.push(entry));
    });
    return all.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Ab routine adherence across the whole program (the routine precedes
  // every workout regardless of day). Sessions logged before the feature
  // existed have no absDone field and are excluded rather than counted
  // as skips.
  const getAbsAdherence = () => {
    if (!selectedProgram) return null;
    const programLog = workoutLog[selectedProgram] || {};
    const tracked = [];
    Object.values(programLog).forEach(d => (d?.sessions || []).forEach(s => {
      if (s.absDone !== undefined) tracked.push(s);
    }));
    tracked.sort((a, b) => new Date(a.date) - new Date(b.date));
    const recent = tracked.slice(-10);
    if (recent.length === 0) return null;
    return { done: recent.filter(s => s.absDone).length, total: recent.length };
  };

  const calculateProgression = (exercise) => {
    const config = getExerciseConfig(exercise);
    const [low, high] = config.repRange;
    let lastData = getLastSession(exercise.id);
    // New prescription: older sessions stay logged but stop seeding weight/reps
    if (config.restartFrom && lastData && new Date(lastData.date) < new Date(config.restartFrom)) lastData = null;
    const performed = lastData ? getPerformedSets(lastData) : [];
    const lastWeight = lastData ? (performed[0]?.weight ?? lastData.weight) : null;
    const lastAvgReps = lastData ? Math.round(avgRepsOf(performed)) : null;

    // Light second exposure: load follows the heavy lift's current working weight
    if (config.derivedFrom) {
      const parentLast = getLastSession(config.derivedFrom);
      const prog = programConfigs[selectedProgram];
      const parentEx = prog ? Object.values(prog.data).flatMap(d => d.exercises).find(e => e.id === config.derivedFrom) : null;
      const parentBase = parentLast ? (getPerformedSets(parentLast)[0]?.weight ?? parentLast.weight) : (parentEx?.defaultWeight ?? exercise.defaultWeight);
      const derived = Math.max(5, Math.round((parentBase * config.pct) / 5) * 5);
      const parentName = (parentEx?.name || config.derivedFrom).split(' / ')[0];
      return { weight: derived, reps: lastAvgReps ?? high, suggestion: `${Math.round(config.pct * 100)}% of your ${parentName} (${parentBase} lb) — no need to push this`, action: 'maintain', icon: Minus, config, lastWeight: derived, lastSession: lastData };
    }

    if (!lastData) return { weight: exercise.defaultWeight, reps: config.startReps ?? high, suggestion: null, action: 'start', icon: null, config };

    // If last session was skipped, don't progress - keep same weight/reps
    if (lastData.skipped) {
      return { weight: lastWeight, reps: lastAvgReps, suggestion: 'Skipped last time', action: 'maintain', icon: Minus, config, lastWeight, lastSession: lastData };
    }

    const result = runProgression(config, lastData);

    // Reactive reset for the big lifts: three straight sessions at the same load with
    // no rep gain -> drop 10% and rebuild. No calendar deloads. A session at a lower
    // load (e.g. right after a reset) is not a stall.
    if (config.stallReset && result.action === 'maintain') {
      const hist = getAllSessions(exercise.id).filter(e => !e.skipped).slice(-4);
      if (hist.length >= 4) {
        const w = hist.map(e => getPerformedSets(e)[0]?.weight ?? e.weight);
        const r = hist.map(e => avgRepsOf(getPerformedSets(e)));
        const stalled = [1, 2, 3].every(i => w[i] === w[i - 1] && r[i] <= r[i - 1]);
        if (stalled) {
          const reset = Math.max(5, Math.round((lastWeight * 0.9) / 5) * 5);
          return { weight: reset, reps: high, suggestion: `Stalled 3 sessions → reset to ${reset} lb and rebuild to ${high} reps`, action: 'decrease', icon: TrendingDown, config, lastWeight, lastSession: lastData };
        }
      }
    }

    // These numbers pre-fill today's set rows. Same weight -> same reps as last time
    // (the banner says to beat them). Weight changed -> restart at the bottom of the
    // range and build back up, so an untouched row can never re-trigger a change.
    let newWeight = lastWeight, newReps = lastAvgReps, icon = Minus;
    if (result.action === 'increase') {
      newWeight = lastWeight + (result.amount || config.weightIncrement);
      newReps = low;
      icon = result.isRegress ? TrendingDown : TrendingUp;
    } else if (result.action === 'decrease') {
      newWeight = Math.max(0, lastWeight - (result.amount || config.weightIncrement));
      newReps = low;
      icon = result.isProgress ? TrendingUp : TrendingDown;
    } else if (result.action === 'progress') {
      icon = TrendingUp;
    } else if (result.action === 'regress') {
      icon = TrendingDown;
    }
    return { weight: newWeight, reps: newReps, suggestion: result.reason, action: result.action, icon, config, lastWeight, lastSession: lastData };
  };

  const selectProgram = (program) => {
    setSelectedProgram(program);
    try { localStorage.setItem('lastProgram', program); } catch {}
    setView('home');
  };
  const startDay = (day) => { setSelectedDay(day); setAbsDone(false); setView('dayOverview'); };

  const beginWorkout = (startIndex = 0) => {
    // Already mid-workout on this day: jump straight to the tapped exercise
    if (Object.keys(sessionData).length > 0 && sessionDay === selectedDay) {
      startExercise(startIndex);
      return;
    }
    let resumed = false;
    const saved = loadActiveSession();
    if (saved && saved.program === selectedProgram && saved.day === selectedDay &&
        confirm('You have an unfinished workout for this day. Resume it? (Cancel starts fresh)')) {
      setSessionData(saved.sessionData);
      setUseAltExercise(saved.useAltExercise || {});
      setAbsDone(!!saved.absDone);
      setWorkoutStartedAt(saved.startedAt || saved.savedAt);
      resumed = true;
    }
    if (!resumed) {
      setSessionData({});
      setUseAltExercise({});
      setWorkoutStartedAt(new Date().toISOString());
    }
    setSessionDay(selectedDay);
    startExercise(startIndex);
  };

  // Fresh set rows for one exercise, pre-filled with what the engine suggests for today
  // (new weight after hitting the range, reset weight after a stall, derived weight for
  // the light lifts)
  const initialExerciseData = (exercise) => {
    const progression = calculateProgression(exercise);
    const numSets = typeof exercise.sets === 'number' ? exercise.sets : 3;
    const numWarmups = Math.min(exercise.warmupSets || 0, numSets - 1);
    const startWeight = progression.weight;
    const startReps = progression.reps;
    // Warm-up ramp: ~50%/75% of working weight for 2 warm-ups, ~60% for 1
    const inc = progression.config.weightIncrement || 5;
    const warmupPcts = numWarmups >= 2 ? [0.5, 0.75] : [0.6];
    const warmupWeight = (i) => Math.max(inc, Math.round((startWeight * warmupPcts[Math.min(i, warmupPcts.length - 1)]) / inc) * inc);
    return {
      sets: Array(numSets).fill(null).map((_, i) => i < numWarmups
        ? { weight: warmupWeight(i), reps: startReps, completed: false, warmup: true }
        : { weight: startWeight, reps: startReps, completed: false }),
      notes: ''
    };
  };

  // Opens the screen for the exercise at this position; a superset opens as a pair
  const startExercise = (index) => {
    const exercises = programConfigs[selectedProgram].data[selectedDay].exercises;
    const unit = unitOf(exercises, index);
    setCurrentExerciseIndex(unit[0]);
    setNotesOpen(null);
    // Functional update so a just-restored session isn't clobbered by stale state
    setSessionData(prev => {
      const next = { ...prev };
      unit.forEach(i => { if (!next[i]) next[i] = initialExerciseData(exercises[i]); });
      return next;
    });
    setView('exercise');
  };

  const patchExercise = (exIndex, patch) => setSessionData(prev => ({ ...prev, [exIndex]: { ...prev[exIndex], ...(typeof patch === 'function' ? patch(prev[exIndex]) : patch) } }));
  const updateSet = (exIndex, setIndex, field, value) => patchExercise(exIndex, d => ({ sets: d.sets.map((s, i) => i === setIndex ? { ...s, [field]: value } : s) }));
  const toggleSetComplete = (exIndex, setIndex) => patchExercise(exIndex, d => ({ sets: d.sets.map((s, i) => i === setIndex ? { ...s, completed: !s.completed } : s) }));
  const copyPreviousSet = (exIndex, setIndex) => patchExercise(exIndex, d => setIndex === 0 ? {} : ({ sets: d.sets.map((s, i) => i === setIndex ? { ...s, weight: d.sets[setIndex - 1].weight, reps: d.sets[setIndex - 1].reps } : s) }));
  const toggleAltExercise = (exIndex) => setUseAltExercise(prev => ({ ...prev, [exIndex]: !prev[exIndex] }));

  const nextExercise = () => {
    const exercises = programConfigs[selectedProgram].data[selectedDay].exercises;
    const unit = unitOf(exercises, currentExerciseIndex);
    const last = unit[unit.length - 1];
    if (last < exercises.length - 1) startExercise(last + 1);
    else setView('summary');
  };

  const prevExercise = () => {
    if (currentExerciseIndex > 0) startExercise(currentExerciseIndex - 1);
  };

  // History editing: change one logged entry (found by day, exercise id and exact date)
  const editHistoryEntry = (day, exId, date, fn) => setWorkoutLog(prev => {
    const programLog = prev[selectedProgram] || {};
    const dayLog = programLog[day];
    if (!dayLog?.exercises?.[exId]) return prev;
    const list = dayLog.exercises[exId].map(e => e.date === date ? normalizeEntry(fn(e)) : e);
    return { ...prev, [selectedProgram]: { ...programLog, [day]: { ...dayLog, exercises: { ...dayLog.exercises, [exId]: list } } } };
  });
  const deleteHistorySession = (day, key) => setWorkoutLog(prev => {
    const programLog = prev[selectedProgram] || {};
    const dayLog = programLog[day];
    if (!dayLog) return prev;
    const exercises = {};
    Object.entries(dayLog.exercises || {}).forEach(([id, list]) => {
      const kept = list.filter(e => localDay(e.date) !== key);
      if (kept.length > 0) exercises[id] = kept;
    });
    const sessions = (dayLog.sessions || []).filter(x => localDay(x.date) !== key);
    return { ...prev, [selectedProgram]: { ...programLog, [day]: { ...dayLog, exercises, sessions } } };
  });
  // Config for a logged exercise id: the program's own entry if it still exists
  const configForId = (id) => {
    const ex = Object.values(programConfigs[selectedProgram]?.data || {}).flatMap(d => d.exercises).find(e => e.id === id);
    return ex ? getExerciseConfig(ex) : (progressionConfig[id] || defaultProgressionConfig);
  };

  const completeWorkout = () => {
    const config = programConfigs[selectedProgram];
    const exercises = config.data[selectedDay].exercises;
    const dayKey = selectedDay;

    // Build the workout session record
    const workoutSession = {
      date: new Date().toISOString(),
      exercises: {}
    };
    const durationMin = workoutStartedAt
      ? Math.max(1, Math.round((Date.now() - new Date(workoutStartedAt).getTime()) / 60000))
      : null;
    const prList = [];

    // Process each exercise
    exercises.forEach((exercise, index) => {
      const data = sessionData[index];
      if (!data) return;

      const exerciseId = exercise.id;
      const nameParts = exercise.name.split(' / ');
      const usedAlt = useAltExercise[index] && nameParts.length > 1;
      const exerciseName = usedAlt ? nameParts[1] : nameParts[0];

      if (!workoutSession.exercises[exerciseId]) {
        workoutSession.exercises[exerciseId] = [];
      }

      // Journal accuracy first: an exercise only freezes progression
      // (skipped) when zero working sets were completed. Partial sessions
      // still count as real data.
      const workSets = data.sets.filter(s => !s.warmup);
      const refSets = workSets.length > 0 ? workSets : data.sets;
      workoutSession.exercises[exerciseId].push({
        exerciseName,
        usedAlt,
        sets: data.sets,
        weight: refSets[0]?.weight || 0,
        notes: data.notes,
        ...(data.effort ? { effort: data.effort } : {}),
        skipped: !refSets.some(s => s.completed)
      });

      // PR detection against history from BEFORE this session. First-ever
      // sessions can't PR; assisted exercises invert (less assistance wins).
      const completedWork = workSets.filter(s => s.completed);
      if (completedWork.length === 0) return;
      const cfg = getExerciseConfig(exercise);
      const priorSets = getAllSessions(exerciseId)
        .filter(e => !e.skipped)
        .flatMap(e => (e.sets || []).filter(s => !s.warmup && s.completed));
      if (priorSets.length === 0) return;
      if (cfg.assisted) {
        const low = cfg.repRange[0];
        const priorValid = priorSets.filter(s => s.reps >= low);
        const currValid = completedWork.filter(s => s.reps >= low);
        if (priorValid.length === 0 || currValid.length === 0) return;
        const pMin = Math.min(...priorValid.map(s => s.weight));
        const cMin = Math.min(...currValid.map(s => s.weight));
        if (cMin < pMin) prList.push({ name: exerciseName, detail: cMin === 0 ? 'Bodyweight!' : `${cMin} lb assist`, prev: `${pMin} lb assist` });
      } else if (cfg.progressionType === 'distance-first' || cfg.progressionType === 'time-first') {
        // Reps here are feet or seconds, so a rep-max estimate is meaningless: PR = heaviest load
        const pMax = Math.max(...priorSets.map(s => s.weight));
        const cMax = Math.max(...completedWork.map(s => s.weight));
        if (cMax > pMax) prList.push({ name: exerciseName, detail: `${cMax} lb`, prev: `${pMax} lb` });
      } else {
        const pBest = priorSets.reduce((a, s) => e1rm(s) > e1rm(a) ? s : a);
        const cBest = completedWork.reduce((a, s) => e1rm(s) > e1rm(a) ? s : a);
        if (e1rm(cBest) > e1rm(pBest) + 0.01) prList.push({ name: exerciseName, detail: `${cBest.weight} lb × ${cBest.reps}`, prev: `${pBest.weight} × ${pBest.reps}` });
      }
    });

    // Update log - nested by program, then by day
    setWorkoutLog(prev => {
      const programLog = prev[selectedProgram] || {};
      const existing = programLog[dayKey] || { sessions: [], exercises: {} };

      // Add to sessions array (absDone = pre-workout ab routine checkbox)
      const sessions = [...(existing.sessions || []), { date: workoutSession.date, absDone, durationMin, prs: prList.map(p => p.name) }];

      // Merge exercise data
      const exercisesLog = { ...existing.exercises };
      Object.entries(workoutSession.exercises).forEach(([exId, entries]) => {
        if (!exercisesLog[exId]) exercisesLog[exId] = [];
        entries.forEach(entry => {
          exercisesLog[exId].push({
            date: workoutSession.date,
            ...entry
          });
        });
      });

      return {
        ...prev,
        [selectedProgram]: {
          ...programLog,
          [dayKey]: { sessions, exercises: exercisesLog }
        }
      };
    });

    try { localStorage.removeItem(ACTIVE_SESSION_KEY); } catch {}
    setLastDurationMin(durationMin);
    setCompletedPRs(prList);
    setView('complete');
  };

  const resetData = () => {
    if (!selectedProgram) return;
    const programName = programConfigs[selectedProgram]?.name || selectedProgram;
    if (confirm(`Clear all ${programName} workout history? (This only affects this program)`)) {
      setWorkoutLog(prev => {
        const newLog = { ...prev };
        delete newLog[selectedProgram];
        return newLog;
      });
      try {
        localStorage.removeItem(getStorageKey(selectedProgram));
        if (loadActiveSession()?.program === selectedProgram) localStorage.removeItem(ACTIVE_SESSION_KEY);
      } catch {}
      setSessionData({});
      setSessionDay(null);
    }
  };

  // Full-fidelity JSON backup of every program's log. Unlike the CSV
  // (analysis only), this round-trips through importBackup for recovery.
  const exportBackup = () => {
    // From memory, not from localStorage: still complete if a save to the phone failed
    const logs = {};
    Object.keys(programConfigs).forEach(prog => { if (workoutLog[prog]) logs[prog] = workoutLog[prog]; });
    const payload = { app: 'workout-tracker-backup', version: 1, exportedAt: new Date().toISOString(), logs };
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `workout_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    const now = new Date().toISOString();
    try { localStorage.setItem('lastBackupAt', now); } catch {}
    setLastBackupAt(now);
  };

  const importBackup = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.app !== 'workout-tracker-backup' || !data.logs) { alert('Not a valid backup file.'); return; }
        const counts = Object.entries(data.logs).map(([prog, log]) => {
          const n = Object.values(log || {}).reduce((a, d) => a + (d?.sessions?.length || 0), 0);
          return `${programConfigs[prog]?.name || prog}: ${n} workouts`;
        }).join(', ');
        if (!confirm(`Restore backup from ${new Date(data.exportedAt).toLocaleDateString()}?\n(${counts})\n\nThis REPLACES current history for those programs.`)) return;
        Object.entries(data.logs).forEach(([prog, log]) => {
          try { localStorage.setItem(getStorageKey(prog), JSON.stringify(log)); } catch { setStorageError(true); }
        });
        setWorkoutLog(prev => ({ ...prev, ...data.logs }));
        alert('Backup restored.');
      } catch { alert('Could not read backup file.'); }
    };
    reader.readAsText(file);
  };

  // Rebuild history from a CSV export. Recovery path for when the JSON backup is
  // gone (e.g. the home-screen app was deleted). Merges: never deletes, and skips
  // an exercise entry if one already exists for the same day and date.
  const importCSV = (file) => {
    if (!selectedProgram) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const rows = parseCSV(String(reader.result || ''));
        if (rows.length < 2) { alert('That CSV is empty.'); return; }
        const header = rows[0].map(h => h.trim().toLowerCase());
        const col = (name) => header.indexOf(name);
        const iDate = col('date'), iDay = col('day'), iEx = col('exercise'), iSet = col('set'), iWarm = col('warmup'),
              iW = col('weight'), iR = col('reps'), iDone = col('completed'), iSkip = col('skipped'), iNotes = col('notes'), iEff = col('effort');
        if (iDate < 0 || iEx < 0 || iW < 0 || iR < 0) { alert('This is not a workout CSV export (missing Date/Exercise/Weight/Reps columns).'); return; }
        const nameToId = {};
        Object.values(programConfigs).forEach(cfg => Object.values(cfg.data).forEach(d => d.exercises.forEach(ex => {
          const parts = ex.name.split(' / ');
          nameToId[parts[0].trim().toLowerCase()] = { id: ex.id, alt: false };
          if (parts[1]) nameToId[parts[1].trim().toLowerCase()] = { id: ex.id, alt: true };
          nameToId[ex.id.toLowerCase()] = { id: ex.id, alt: false };
        })));
        Object.entries(retiredExerciseNames).forEach(([name, v]) => { if (!nameToId[name]) nameToId[name] = v; });
        const log = JSON.parse(JSON.stringify(workoutLog[selectedProgram] || {}));
        const groups = {}, sessionsSeen = {}, unknown = new Set();
        let imported = 0;
        rows.slice(1).forEach(r => {
          if (!r[iDate] || !r[iEx]) return;
          const dateObj = parseCSVDate(r[iDate]);
          if (isNaN(dateObj)) return;
          const dateISO = dateObj.toISOString();
          const dayKey = (iDay >= 0 && r[iDay] && r[iDay].trim()) || 'day1';
          const exName = r[iEx].trim();
          const sessKey = dayKey + '|' + localDay(dateObj);
          if (exName.toLowerCase().startsWith('ab routine')) {
            sessionsSeen[sessKey] = { date: dateISO, absDone: iDone >= 0 ? /yes/i.test(r[iDone]) : undefined };
            return;
          }
          const m = nameToId[exName.toLowerCase()];
          if (!m) { unknown.add(exName); return; }
          if (!sessionsSeen[sessKey]) sessionsSeen[sessKey] = { date: dateISO };
          const key = sessKey + '|' + m.id;
          if (!groups[key]) groups[key] = { dayKey, id: m.id, entry: { exerciseName: exName, usedAlt: m.alt, sets: [], weight: 0, notes: '', skipped: false, date: dateISO } };
          const g = groups[key];
          const idx = iSet >= 0 && r[iSet] ? Math.max(0, parseInt(r[iSet], 10) - 1) : g.entry.sets.length;
          const set = { weight: parseFloat(r[iW]) || 0, reps: parseInt(r[iR], 10) || 0, completed: iDone >= 0 ? /yes/i.test(r[iDone]) : true };
          if (iWarm >= 0 && /yes/i.test(r[iWarm])) set.warmup = true;
          g.entry.sets[idx] = set;
          if (iSkip >= 0 && /yes/i.test(r[iSkip])) g.entry.skipped = true;
          if (iNotes >= 0 && r[iNotes]) g.entry.notes = r[iNotes];
          if (iEff >= 0 && /^(easy|max)$/i.test((r[iEff] || '').trim())) g.entry.effort = r[iEff].trim().toLowerCase();
        });
        Object.values(groups).forEach(({ dayKey, id, entry }) => {
          entry.sets = entry.sets.filter(Boolean);
          const work = entry.sets.filter(s => !s.warmup);
          entry.weight = (work[0] || entry.sets[0] || {}).weight || 0;
          if (!log[dayKey]) log[dayKey] = { exercises: {}, sessions: [] };
          if (!log[dayKey].exercises) log[dayKey].exercises = {};
          const list = log[dayKey].exercises[id] || [];
          if (!list.some(e => localDay(e.date) === localDay(entry.date))) { list.push(entry); imported++; }
          log[dayKey].exercises[id] = list;
        });
        Object.entries(sessionsSeen).forEach(([k, s]) => {
          const dayKey = k.split('|')[0];
          if (!log[dayKey]) log[dayKey] = { exercises: {}, sessions: [] };
          if (!log[dayKey].sessions) log[dayKey].sessions = [];
          if (!log[dayKey].sessions.some(x => localDay(x.date) === localDay(s.date))) log[dayKey].sessions.push(s);
        });
        const msg = `Import ${imported} exercise entries from this CSV into ${programConfigs[selectedProgram].name}?` +
          (unknown.size ? `\n\nSkipped (unknown exercise names): ${[...unknown].join(', ')}` : '') +
          '\n\nNothing is deleted; entries already logged on the same date are kept.';
        if (!confirm(msg)) return;
        try { localStorage.setItem(getStorageKey(selectedProgram), JSON.stringify(log)); } catch { setStorageError(true); }
        setWorkoutLog(prev => ({ ...prev, [selectedProgram]: log }));
        alert(`Imported ${imported} entries.`);
      } catch (e) { alert('Could not read the CSV: ' + (e && e.message ? e.message : e)); }
    };
    reader.readAsText(file);
  };

  // One import button for both formats: a JSON backup (Backup button) or a CSV
  // export. Detects by content, not by file extension, so a renamed file still works.
  const importAny = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '').replace(/^\uFEFF/, '');
      const head = text.trimStart();
      if (head.startsWith('{')) importBackup(new File([text], file.name || 'backup.json', { type: 'application/json' }));
      else if (/^date\s*,/i.test(head)) importCSV(new File([text], file.name || 'export.csv', { type: 'text/csv' }));
      else alert('This file is neither a workout backup (.json from the Backup button) nor a CSV export.');
    };
    reader.readAsText(file);
  };

  const exportCSV = () => {
    if (!selectedProgram) return;
    const programName = programConfigs[selectedProgram]?.name || selectedProgram;
    let csv = 'Date,Day,Exercise,Variant,Set,Warmup,Weight,Reps,Completed,Skipped,Notes,Effort\n';

    const programLog = workoutLog[selectedProgram] || {};
    Object.entries(programLog).forEach(([day, data]) => {
      Object.entries(data.exercises || {}).forEach(([exerciseId, entries]) => {
        entries.forEach(entry => {
          entry.sets.forEach((set, setIndex) => {
            csv += `${localDay(entry.date)},${day},${csvCell(entry.exerciseName || exerciseId)},${entry.usedAlt ? 'Alt' : 'Main'},${setIndex + 1},${set.warmup ? 'Yes' : 'No'},${set.weight},${set.reps},${set.completed ? 'Yes' : 'No'},${entry.skipped ? 'Yes' : 'No'},"${(entry.notes || '').replace(/"/g, '""')}",${entry.effort || ''}\n`;
          });
        });
      });
      // Ab routine done/skipped, one row per session that tracked it
      (data.sessions || []).forEach(sess => {
        if (sess.absDone !== undefined) {
          csv += `${localDay(sess.date)},${day},Ab Routine (pre-workout),Main,1,No,0,0,${sess.absDone ? 'Yes' : 'No'},${sess.absDone ? 'No' : 'Yes'},"",\n`;
        }
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${programName.replace(/\s+/g, '_')}_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // PROGRAM SELECT
  if (view === 'programSelect') {
    return (
      <div className="min-h-screen text-white p-4 flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0f18 100%)' }}>
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Choose Your Program</h1>
            <p className="text-zinc-500 text-sm">Select a workout plan to get started</p>
          </div>
          <div className="space-y-4">
            {Object.entries(programConfigs).map(([key, cfg]) => (
              <button key={key} onClick={() => selectProgram(key)} className="w-full rounded-2xl p-5 text-left transition-all active:scale-[0.98] border border-zinc-800/50" style={{ backgroundColor: '#12121a' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.gradient }}><cfg.icon className="w-6 h-6 text-white" /></div>
                  <div className="flex-1">
                    <div className="text-base font-semibold text-zinc-100">{cfg.name}</div>
                    <div className="text-xs text-zinc-500">{cfg.subtitle}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-600" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const config = programConfigs[selectedProgram];
  const workoutData = config?.data;

  // HOME
  if (view === 'home') {
    // Rotation pointer: the day after the one trained most recently is next
    const dayKeys = Object.keys(workoutData);
    const lastDone = {};
    dayKeys.forEach(d => { lastDone[d] = (workoutLog[selectedProgram]?.[d]?.sessions || []).reduce((m, x) => Math.max(m, new Date(x.date).getTime() || 0), 0); });
    const latestDay = dayKeys.reduce((best, d) => lastDone[d] > (best ? lastDone[best] : 0) ? d : best, null);
    const nextDay = latestDay ? dayKeys[(dayKeys.indexOf(latestDay) + 1) % dayKeys.length] : dayKeys[0];
    const ago = (t) => { if (!t) return ''; const n = Math.floor((Date.now() - t) / 864e5); return n <= 0 ? ' · today' : n === 1 ? ' · yesterday' : ` · ${n}d ago`; };
    return (
      <div className="min-h-screen text-white p-4" style={{ background: config.bgGradient }}>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-3" style={{ paddingTop: 2 }}>
            <button onClick={() => setView('programSelect')} className="text-zinc-600 text-xs mb-2 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto"><ChevronLeft className="w-3 h-3" /> Switch</button>
            <div className="mx-auto mb-2 rounded-xl flex items-center justify-center" style={{ width: 40, height: 40, background: config.gradient }}><config.icon className="w-5 h-5 text-white" /></div>
            <h1 className="text-xl font-bold tracking-tight">{config.name}</h1>
            <p className="text-zinc-500 text-xs mt-0.5">{config.subtitle}</p>
          </div>
          <div className="space-y-2">
            {Object.entries(workoutData).map(([day, data]) => {
              const accent = config.dayAccents[day];
              return (
                <button key={day} onClick={() => startDay(day)} className="w-full rounded-xl px-4 text-left transition-all active:scale-[0.98] border border-zinc-800/50" style={{ backgroundColor: '#12121a', paddingTop: 11, paddingBottom: 11 }}>
                  <div className="flex justify-between items-center">
                    <div className="min-w-0">
                      <div className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: accent }}>Day {day.replace('day','')} <span className="text-zinc-600" style={{ textTransform: 'none', letterSpacing: 0 }}>· {data.exercises.length} exercises{ago(lastDone[day])}</span></div>
                      <div className="text-sm font-semibold text-zinc-100 truncate">{data.name}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {day === nextDay && <span className="next-up text-[9px] font-semibold uppercase tracking-widest" style={{ color: accent, border: `1px solid ${accent}60`, borderRadius: 6, padding: '2px 6px' }}>Next</span>}
                      <ChevronRight className="w-4 h-4" style={{ color: accent }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {(() => {
            // Consistency: workouts per week over the last 8 weeks
            const dates = [];
            Object.values(workoutLog[selectedProgram] || {}).forEach(d => (d?.sessions || []).forEach(s => dates.push(new Date(s.date))));
            if (dates.length === 0) return null;
            const now = new Date();
            const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
            const start = new Date(monday);
            start.setDate(start.getDate() - 49);
            const weeks = Array(8).fill(0);
            dates.forEach(dt => {
              const idx = Math.floor((dt - start) / (7 * 864e5));
              if (idx >= 0 && idx < 8) weeks[idx]++;
            });
            const maxW = Math.max(...weeks, 1);
            return (
              <div className="mt-3 p-3 rounded-xl border border-zinc-800/50" style={{ backgroundColor: '#12121a' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-zinc-500 font-medium">LAST 8 WEEKS</span>
                  <span className="text-[10px] text-zinc-400">{weeks[7]} this week · {dates.length} total</span>
                </div>
                <div className="flex items-end gap-1.5 h-8">
                  {weeks.map((c, i) => (
                    <div key={i} className="flex-1 rounded-sm" style={{ height: `${c === 0 ? 10 : 30 + (c / maxW) * 70}%`, background: c === 0 ? '#27272a' : config.gradient, opacity: c === 0 ? 1 : 0.45 + 0.55 * (c / maxW) }} />
                  ))}
                </div>
              </div>
            );
          })()}
          {storageError && <StorageWarning onBackup={exportBackup} />}
          {(() => {
            const totalSessions = Object.values(workoutLog[selectedProgram] || {}).reduce((a, d) => a + (d?.sessions?.length || 0), 0);
            const ageDays = lastBackupAt ? Math.floor((Date.now() - new Date(lastBackupAt).getTime()) / 864e5) : null;
            if (totalSessions < 3 || (ageDays !== null && ageDays <= 21)) return null;
            return (
              <button onClick={exportBackup} className="mt-2 w-full text-left px-3 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-300/90 truncate">
                {ageDays === null ? 'Never backed up' : `Last backup ${ageDays} days ago`} — your log lives only on this phone. Tap to save a backup.
              </button>
            );
          })()}
          <div className="mt-3 flex gap-2 text-[10px]">
            <button onClick={exportBackup} className="flex-1 text-zinc-500 flex items-center justify-center gap-1 py-2 border border-zinc-800 rounded-lg"><Download className="w-3 h-3" /> Backup</button>
            <label className="flex-1 text-zinc-500 flex items-center justify-center gap-1 py-2 border border-zinc-800 rounded-lg cursor-pointer">
              <input type="file" accept=".json,.csv,.txt,application/json,text/csv,text/plain" className="hidden csv-import" onChange={(e) => { const f = e.target.files[0]; if (f) importAny(f); e.target.value = ''; }} />
              <RotateCcw className="w-3 h-3" /> Restore / Import
            </label>
          </div>
          <div className="mt-2 flex gap-2 text-[10px]">
            <button onClick={() => setView('history')} className="flex-1 text-zinc-500 flex items-center justify-center gap-1 py-2 border border-zinc-800 rounded-lg">History</button>
            <button onClick={exportCSV} className="flex-1 text-zinc-600 flex items-center justify-center gap-1 py-2 border border-zinc-800 rounded-lg">Export CSV</button>
            <button onClick={resetData} className="flex-1 text-zinc-700 flex items-center justify-center gap-1 py-2">Reset</button>
          </div>
        </div>
      </div>
    );
  }

  // HISTORY: every logged workout, newest first
  if (view === 'history') {
    const sessions = listSessions(workoutLog[selectedProgram]);
    return (
      <div className="min-h-screen text-white p-4" style={{ background: config.bgGradient }}>
        <div className="max-w-md mx-auto">
          <button onClick={() => setView('home')} className="flex items-center text-zinc-500 mb-4 text-sm"><ChevronLeft className="w-4 h-4" /> Back</button>
          <h1 className="text-lg font-bold text-zinc-100">History</h1>
          <p className="text-zinc-500 text-xs mb-4">{sessions.length === 0 ? 'No workouts logged yet' : `${sessions.length} workouts · tap one to review or fix it`}</p>
          <div className="space-y-1.5">
            {sessions.map(sess => {
              const accent = config.dayAccents[sess.day] || '#6b7280';
              const done = sess.entries.filter(x => !x.entry.skipped).length;
              return (
                <button key={sess.day + sess.key} onClick={() => { setHistorySel({ day: sess.day, key: sess.key }); setView('historySession'); }} className="history-row w-full text-left rounded-lg px-3 py-2 flex items-center gap-2.5 border border-zinc-800/50 transition-all active:scale-[0.98]" style={{ backgroundColor: '#12121a' }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: accent }}>{new Date(sess.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="text-sm font-medium text-zinc-200 truncate">{workoutData[sess.day]?.name || sess.day}</div>
                    <div className="text-[10px] text-zinc-600">{done} exercises{sess.meta?.durationMin ? ` · ${sess.meta.durationMin} min` : ''}{sess.meta?.prs?.length ? ` · ${sess.meta.prs.length} PR` : ''}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-700 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // HISTORY SESSION: one logged workout, editable in place
  if (view === 'historySession') {
    const sess = historySel && listSessions(workoutLog[selectedProgram]).find(x => x.day === historySel.day && x.key === historySel.key);
    const accent = config.dayAccents[historySel?.day] || '#6b7280';
    return (
      <div className="min-h-screen text-white p-4" style={{ background: config.bgGradient }}>
        <div className="max-w-md mx-auto">
          <button onClick={() => setView('history')} className="flex items-center text-zinc-500 mb-4 text-sm"><ChevronLeft className="w-4 h-4" /> Back</button>
          {!sess ? <p className="text-zinc-500 text-sm">This workout is no longer in the log.</p> : (
            <>
              <div className="text-[9px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: accent }}>{new Date(sess.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
              <h1 className="text-lg font-bold text-zinc-100">{workoutData[sess.day]?.name || sess.day}</h1>
              <p className="text-zinc-500 text-xs mb-4">Changes save as you make them and feed the next suggestion.</p>
              <div className="space-y-2">
                {sess.entries.map(({ id, entry }) => {
                  const cfg = configForId(id);
                  const edit = (fn) => editHistoryEntry(sess.day, id, entry.date, fn);
                  const editSet = (i, patch) => edit(e => ({ ...e, sets: e.sets.map((x, k) => k === i ? { ...x, ...patch } : x) }));
                  return (
                    <div key={id + entry.date} className="rounded-lg px-3 py-2 border border-zinc-800/50" style={{ backgroundColor: '#12121a' }}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium text-zinc-200 truncate">{entry.exerciseName && entry.exerciseName !== 'x' ? entry.exerciseName : id}{entry.skipped ? <span className="text-[10px] text-amber-500"> · skipped</span> : null}</div>
                        <EffortChips value={entry.effort || null} onChange={(v) => edit(e => { const { effort, ...rest } = e; return v ? { ...rest, effort: v } : rest; })} accent={accent} />
                      </div>
                      {entry.notes ? <div className="text-[11px] text-amber-200/80 italic mb-1">{entry.notes}</div> : null}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {(entry.sets || []).map((set, i) => (
                          <SetRow
                            key={i}
                            set={set}
                            label={setLabel(entry.sets, i)}
                            accent={accent}
                            config={cfg}
                            onToggle={() => editSet(i, { completed: !set.completed })}
                            onChange={(field, value) => editSet(i, { [field]: value })}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => { if (confirm('Delete this workout from the log? This cannot be undone.')) { deleteHistorySession(sess.day, sess.key); setView('history'); } }} className="w-full text-zinc-600 font-medium py-2 text-sm mt-4">Delete this workout</button>
            </>
          )}
        </div>
      </div>
    );
  }

  // DAY OVERVIEW
  if (view === 'dayOverview') {
    const dayData = workoutData[selectedDay];
    const accent = config.dayAccents[selectedDay];
    return (
      <div className="min-h-screen text-white p-4 pb-24" style={{ background: config.bgGradient }}>
        <div className="max-w-md mx-auto">
          <button onClick={() => setView('home')} className="flex items-center text-zinc-500 mb-4 text-sm"><ChevronLeft className="w-4 h-4" /> Back</button>
          <div className="mb-4">
            <div className="text-[9px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: accent }}>Day {selectedDay.replace('day','')}</div>
            <h1 className="text-lg font-bold text-zinc-100">{dayData.name}</h1>
            <p className="text-zinc-500 text-xs">{dayData.focus}</p>
          </div>
          {dayData.mobility && (
            <div className="mb-3 px-3 py-2 rounded-lg border border-zinc-800/50" style={{ backgroundColor: '#12121a' }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-semibold tracking-widest text-zinc-500">MOBILITY WARM-UP</span>
                <span className="text-[9px] text-zinc-600">5 min · ends in your first ramp set</span>
              </div>
              {dayData.mobility.map((m, i) => <div key={i} className="text-[10px] text-zinc-400" style={{ lineHeight: 1.4 }}>{m}</div>)}
            </div>
          )}
          {(() => { const adherence = getAbsAdherence(); return (
            <button onClick={() => setAbsDone(!absDone)} className={`w-full rounded-lg px-3 py-2 mb-3 flex items-center gap-2.5 border transition-all active:scale-[0.98] ${absDone ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-zinc-800/50'}`} style={absDone ? {} : { backgroundColor: '#12121a' }}>
              <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${absDone ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-600'}`}>
                {absDone ? <Check className="w-4 h-4" /> : null}
              </div>
              <div className="flex-1 text-left">
                <div className={`text-sm font-medium ${absDone ? 'text-emerald-300' : 'text-zinc-200'}`}>Pre-workout ab routine</div>
                <div className="text-[10px] text-zinc-600">
                  {adherence ? `Done ${adherence.done} of last ${adherence.total} workouts` : 'Tap when done — tracked with each workout'}
                </div>
              </div>
            </button>
          ); })()}
          <div className="space-y-1.5 mb-4">
            {dayData.exercises.map((ex, i) => {
              const lastData = getLastSession(ex.id);
              const primaryColor = muscleColors[ex.muscles[0]] || '#6b7280';
              // Equipment taken? Tap any exercise to jump straight to it
              const inSession = Object.keys(sessionData).length > 0 && sessionDay === selectedDay;
              const doneThisSession = inSession && sessionData[i]?.sets?.some(s => s.completed && !s.warmup);
              return (
                <div key={`${ex.id}-${i}`} role="button" tabIndex={0} onClick={() => beginWorkout(i)} className="exercise-row w-full text-left rounded-lg px-3 py-2 flex items-center gap-2.5 border border-zinc-800/50 transition-all active:scale-[0.98] cursor-pointer" style={{ backgroundColor: '#12121a', paddingTop: dayData.exercises.length <= 5 ? 12 : 8, paddingBottom: dayData.exercises.length <= 5 ? 12 : 8 }}>
                  <div className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: `${primaryColor}20`, color: primaryColor }}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-200 truncate">{ex.superset ? <span className="text-zinc-500">⇄ </span> : null}{ex.name.split(' / ')[0]}</div>
                    <div className="text-[10px] text-zinc-600">{ex.sets} × {ex.reps}{lastData ? (lastData.skipped ? ' · Skipped' : ` · ${lastData.weight} lbs`) : ''}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setInfoExerciseId(ex.id); }} className="info-btn w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-zinc-500 border border-zinc-800 flex-shrink-0 active:scale-90" title="How to do it">?</button>
                  {doneThisSession ? <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-zinc-700 flex-shrink-0" />}
                </div>
              );
            })}
          </div>
          {infoExerciseId && (() => {
            const media = exerciseMedia[infoExerciseId] || exerciseMedia[progressionConfig[infoExerciseId]?.derivedFrom];
            const infoEx = dayData.exercises.find(e => e.id === infoExerciseId);
            const cfg = infoEx ? getExerciseConfig(infoEx) : (progressionConfig[infoExerciseId] || defaultProgressionConfig);
            return (
              <div className="fixed flex items-end" style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, background: 'rgba(0,0,0,0.7)' }} onClick={() => setInfoExerciseId(null)}>
                <div className="info-sheet w-full max-w-md mx-auto p-4 border-t border-zinc-800" style={{ background: '#12121a', borderRadius: '16px 16px 0 0', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }} onClick={(e) => e.stopPropagation()}>
                  <div className="text-[10px] text-zinc-500 font-medium mb-1">HOW TO DO IT</div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{media?.description || 'No description yet.'}</p>
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    {media?.youtube && (
                      <a href={media.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-lg" style={{ background: `${accent}20`, color: accent }}>
                        <Play className="w-3 h-3" /> Watch form video
                      </a>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium" style={{ background: `${accent}15`, color: accent }}>{cfg.repRange[0]}-{cfg.repRange[1]} reps</span>
                    {cfg.weightIncrement > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-medium" style={{ background: `${accent}15`, color: accent }}>{cfg.assisted ? `−${cfg.weightIncrement} lb assist` : cfg.weightSteps ? 'next dumbbell up' : `+${cfg.weightIncrement} lb`}</span>
                    )}
                    {media?.source && <span className="text-[9px] text-zinc-600">Source: {media.source}</span>}
                  </div>
                  <button onClick={() => setInfoExerciseId(null)} className="mt-3 w-full py-2 text-xs text-zinc-400">Close</button>
                </div>
              </div>
            );
          })()}
          <div className="fixed bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-zinc-950 to-transparent" style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
            <div className="max-w-md mx-auto">
              <button onClick={() => beginWorkout(0)} className="w-full text-white font-semibold py-3.5 rounded-xl text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2" style={{ background: accent }}>
                <Play className="w-4 h-4" /> {Object.keys(sessionData).length > 0 && sessionDay === selectedDay ? 'Continue Workout' : (() => { const s = loadActiveSession(); return s && s.program === selectedProgram && s.day === selectedDay; })() ? 'Resume Workout' : 'Begin Workout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EXERCISE: one exercise, or both halves of a superset on one screen
  if (view === 'exercise') {
    const dayData = workoutData[selectedDay];
    const accent = config.dayAccents[selectedDay];
    const unit = unitOf(dayData.exercises, currentExerciseIndex);
    const paired = unit.length > 1;
    const lastOfUnit = unit[unit.length - 1];

    // Single exercise: one fixed layout sized so the longest case (5 set rows with
    // history + chart) fits an iPhone 16 Pro without scrolling. Superset: two compact
    // panels (no plan note, no chart, one-line suggestion) so both fit together.
    const renderPanel = (index) => {
      const exercise = dayData.exercises[index];
      const progression = calculateProgression(exercise);
      const exerciseConfig = progression.config;
      const nameParts = exercise.name.split(' / ');
      const hasAlt = nameParts.length > 1;
      const isUsingAlt = useAltExercise[index];
      const displayName = isUsingAlt && hasAlt ? nameParts[1] : nameParts[0];
      const currentData = sessionData[index] || { sets: [], notes: '' };

      const lastWorkoutDate = progression.lastSession?.date
        ? new Date(progression.lastSession.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        : null;

      let suggestionColor = accent, suggestionBg = `${accent}15`;
      if (progression.action === 'increase' || progression.action === 'progress') { suggestionColor = '#10b981'; suggestionBg = '#10b98115'; }
      else if (progression.action === 'decrease' || progression.action === 'regress') { suggestionColor = '#f59e0b'; suggestionBg = '#f59e0b15'; }
      const suggestionText = progression.suggestion || (progression.lastSession ? 'Keep building within your rep range' : 'First time - start with suggested weight');

      // Target line: sets, reps, rest, progression rule
      const workingSets = currentData.sets.filter(s => !s.warmup).length || (typeof exercise.sets === 'number' ? exercise.sets : 3);
      const rrHigh = exerciseConfig.repRange[1];
      const targetBits = [`${workingSets} × ${exercise.reps}`];
      if (exerciseConfig.restTime) targetBits.push(`rest ${exerciseConfig.restTime >= 60 ? (exerciseConfig.restTime / 60).toFixed(exerciseConfig.restTime % 60 ? 1 : 0) + ' min' : exerciseConfig.restTime + ' s'}`);
      if (exerciseConfig.derivedFrom) targetBits.push(`${Math.round(exerciseConfig.pct * 100)}% of your heavy day`);
      else if (exerciseConfig.assisted) targetBits.push(`−${exerciseConfig.weightIncrement} lb assist when every set hits ${rrHigh}`);
      else if (exerciseConfig.weightSteps) targetBits.push(`next dumbbell up when every set hits ${rrHigh}`);
      else if (exerciseConfig.weightIncrement > 0) targetBits.push(`+${exerciseConfig.incrementPct ? '~2%' : exerciseConfig.weightIncrement + ' lb'} when every set hits ${rrHigh}`);
      if (!paired && typeof exerciseConfig.rirTarget === 'number') targetBits.push(`${exerciseConfig.rirTarget} in reserve`);

      const prevNote = (progression.lastSession?.notes || '').trim();
      const prevFirst = prevNote.split('\n')[0];
      const todayFirst = (currentData.notes || '').trim().split('\n')[0];

      return (
        <div key={index} className="exercise-panel">
          {/* Exercise name + inline alternate toggle */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <h1 className={`${paired ? 'text-sm font-semibold' : 'text-lg font-bold'} text-zinc-100 truncate`}>{displayName}</h1>
            {hasAlt && (
              <button
                onClick={() => toggleAltExercise(index)}
                className="alt-toggle flex items-center gap-1 text-[10px] px-2 rounded-lg border flex-shrink-0 transition-all active:scale-[0.98]"
                style={{ height: paired ? 26 : 30, maxWidth: 160, borderColor: `${accent}50`, background: `${accent}10`, color: accent }}
                title={`Switch to ${isUsingAlt ? nameParts[0] : nameParts[1]}`}
              >
                <Swap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} />
                <span className="truncate">{isUsingAlt ? nameParts[0] : nameParts[1]}</span>
              </button>
            )}
          </div>

          {/* Plan note (coaching cue from the program) */}
          {!paired && exercise.notes && (
            <p className="text-[11px] text-zinc-500 mb-1">{exercise.notes}</p>
          )}
          {/* Target: sets, reps, rest, progression rule */}
          <p className={`text-[11px] ${paired ? 'truncate' : ''}`} style={{ color: accent, marginBottom: paired ? 2 : 6 }}>{targetBits.join(' · ')}</p>

          {paired ? (
            <>
              {/* Superset: suggestion and last session, one line each */}
              <p className="text-[11px] truncate" style={{ color: suggestionColor, marginBottom: 4 }}>{suggestionText}</p>
              {progression.lastSession && (
                <div className="flex gap-1.5 items-center mb-1" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  <span className="text-[10px] text-zinc-500 flex-shrink-0">Last</span>
                  {progression.lastSession.sets.map((s, i) => (
                    <span key={i} className={`px-1.5 py-0.5 rounded text-[10px] flex-shrink-0 ${s.warmup ? 'bg-amber-500/10 text-amber-400/80' : 'bg-zinc-800/50 text-zinc-300'}`}>
                      {s.warmup ? 'W ' : ''}{s.weight}×{s.reps}{s.completed ? ' ✓' : ''}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Last workout: compact set chips */}
              {progression.lastSession && (
                <div className="mb-2 px-3 py-1.5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-500">Last <span className="text-zinc-300 font-medium">{lastWorkoutDate}</span>{progression.lastSession.effort ? ` · felt ${progression.lastSession.effort}` : ''}</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    {progression.lastSession.sets.map((s, i) => (
                      <span key={i} className={`px-1.5 py-0.5 rounded text-[10px] ${s.warmup ? 'bg-amber-500/10 text-amber-400/80' : 'bg-zinc-800/50 text-zinc-300'}`}>
                        {s.warmup ? 'W ' : ''}{s.weight}×{s.reps}{s.completed ? ' ✓' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Trend chart across all logged sessions */}
              <ProgressSpark entries={getAllSessions(exercise.id)} accent={accent} config={exerciseConfig} />

              {/* Progression suggestion with explanation */}
              <div className="mb-2 px-3 py-1 rounded-xl border" style={{ background: suggestionBg, borderColor: `${suggestionColor}30` }}>
                <div className="flex items-start gap-2">
                  {progression.icon && <progression.icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: suggestionColor }} />}
                  <div>
                    <div className="text-xs font-medium" style={{ color: suggestionColor }}>{suggestionText}</div>
                    <div className="text-[10px] text-zinc-500 mt-1">
                      {progression.action === 'increase' || progression.action === 'progress'
                        ? (progression.weight !== progression.lastWeight ? 'You hit your rep target last time - the new weight is filled in below.' : 'You hit your rep target last time - make it harder today.')
                        : progression.action === 'decrease' || progression.action === 'regress'
                        ? (progression.weight !== progression.lastWeight ? 'The lower weight is filled in below. Quality reps beat ego weight.' : 'Focus on form and control. Quality reps beat ego weight.')
                        : progression.lastSession
                        ? 'Aim for more reps at the same weight, or same reps with slightly more weight.'
                        : 'Log your sets below. The app will suggest progression next time.'}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notes: collapsed row shows last session's note (first line) so it can't be missed */}
          {notesOpen !== index ? (
            <button onClick={() => setNotesOpen(index)} className="notes-row w-full text-left rounded-lg px-3 border border-zinc-800/50 bg-zinc-900/30 flex items-center gap-2" style={{ minHeight: paired ? 30 : 36 }}>
              <StickyNote className="w-3.5 h-3.5 flex-shrink-0 text-amber-400/70" />
              <span className="text-[11px] truncate flex-1 min-w-0">
                {todayFirst
                  ? <span className="text-zinc-200">{todayFirst}</span>
                  : prevFirst
                  ? <span className="text-amber-200/80 italic">Last time: {prevFirst}</span>
                  : <span className="text-zinc-600">Add a note…</span>}
              </span>
            </button>
          ) : (
            <div className="notes-open rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2">
              {prevNote && (
                <div className="text-[11px] text-amber-200/80 italic mb-1 flex items-start gap-1.5">
                  <StickyNote className="w-3.5 h-3.5 text-amber-400/70 mt-0.5 flex-shrink-0" />
                  <span>Last time: {prevNote}</span>
                </div>
              )}
              <textarea
                value={currentData.notes || ''}
                onChange={(e) => patchExercise(index, { notes: e.target.value })}
                placeholder="Add workout notes..."
                className="w-full text-sm text-white"
                style={{ background: 'transparent', border: 'none' }}
                rows={3}
                autoFocus
              />
              <button onClick={() => setNotesOpen(null)} className="text-[10px] text-zinc-500 mt-1">Done</button>
            </div>
          )}

          {/* Journal - sets to log, plus the optional one-tap rating of the last set */}
          <div style={{ marginTop: paired ? 4 : 8 }}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-zinc-500 font-medium">LOG YOUR SETS <span className="text-[9px] text-zinc-600" style={{ fontWeight: 400 }}>{exerciseConfig.assisted ? 'lbs assist' : 'lbs'} × reps</span></span>
              <EffortChips value={currentData.effort || null} onChange={(v) => patchExercise(index, { effort: v })} accent={accent} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {currentData.sets.map((set, i) => (
                <SetRow
                  key={i}
                  set={set}
                  label={setLabel(currentData.sets, i)}
                  accent={accent}
                  config={exerciseConfig}
                  onToggle={() => toggleSetComplete(index, i)}
                  onChange={(field, value) => updateSet(index, i, field, value)}
                  onCopy={i > 0 && !set.completed ? () => copyPreviousSet(index, i) : null}
                />
              ))}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="min-h-screen text-white p-3 pb-24" style={{ background: config.bgGradient }}>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center" style={{ marginBottom: 2 }}>
            <button onClick={() => setView('dayOverview')} className="text-zinc-500 p-1"><ChevronLeft className="w-5 h-5" /></button>
            <div className="text-[10px] text-zinc-600">{paired ? `${unit[0] + 1}-${lastOfUnit + 1}` : currentExerciseIndex + 1}/{dayData.exercises.length}{paired ? ' · superset, alternate sets' : ''}</div>
            {paired ? <div className="p-1"><div className="w-5 h-5" /></div> : (
              <button onClick={() => setNotesOpen(notesOpen === null ? unit[0] : null)} className="text-zinc-500 p-1">
                <StickyNote className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-0.5 bg-zinc-800 rounded-full overflow-hidden" style={{ marginBottom: 6 }}>
            <div className="h-full rounded-full" style={{ width: `${((lastOfUnit + 1) / dayData.exercises.length) * 100}%`, background: accent }} />
          </div>

          {unit.map((index, n) => (
            <React.Fragment key={index}>
              {n > 0 && <div className="bg-zinc-800" style={{ height: 1, margin: '8px 0 6px' }} />}
              {renderPanel(index)}
            </React.Fragment>
          ))}

          {/* Navigation - BIGGER buttons */}
          <div className="fixed bottom-0 left-0 right-0 pointer-events-none" style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
            <div className="max-w-md mx-auto px-4 flex justify-between items-center">
              <button
                onClick={prevExercise}
                disabled={currentExerciseIndex === 0}
                className="pointer-events-auto w-16 h-16 rounded-xl flex items-center justify-center text-4xl text-zinc-600 disabled:opacity-20 active:scale-90 bg-zinc-900/80 border border-zinc-800"
              >
                ‹
              </button>
              <button
                onClick={nextExercise}
                className="pointer-events-auto px-4 py-2 rounded-lg flex items-center gap-1.5 text-xs font-medium active:scale-95 bg-zinc-800 border border-zinc-700 text-zinc-400"
              >
                <SkipForward className="w-4 h-4" /> Skip
              </button>
              <button
                onClick={nextExercise}
                className="pointer-events-auto w-16 h-16 rounded-xl flex items-center justify-center text-4xl active:scale-90 border"
                style={{ color: accent, background: `${accent}15`, borderColor: accent }}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SUMMARY (before final completion)
  if (view === 'summary') {
    const dayData = workoutData[selectedDay];
    const accent = config.dayAccents[selectedDay];
    const completedCount = Object.values(sessionData).filter(d => d && d.sets.every(s => s.completed)).length;

    return (
      <div className="min-h-screen text-white p-4 pb-24" style={{ background: config.bgGradient }}>
        <div className="max-w-md mx-auto">
          <h1 className="text-lg font-bold text-zinc-100 mb-1">Workout Summary</h1>
          <p className="text-zinc-500 text-sm mb-4">{dayData.name}</p>

          <div className="px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800 mb-3 flex  justify-center gap-2" style={{ alignItems: 'baseline' }}>
            <span className="text-2xl font-bold" style={{ color: accent }}>{completedCount}/{dayData.exercises.length}</span>
            <span className="text-zinc-500 text-xs">exercises completed</span>
          </div>

          <button onClick={() => setAbsDone(!absDone)} className={`w-full rounded-lg px-3 py-2 mb-2 flex items-center gap-2.5 border transition-all active:scale-[0.98] ${absDone ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-zinc-800/50'}`} style={absDone ? {} : { backgroundColor: '#12121a' }}>
            <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${absDone ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-600'}`}>
              {absDone ? <Check className="w-4 h-4" /> : null}
            </div>
            <div className="flex-1 text-left">
              <div className={`text-sm font-medium ${absDone ? 'text-emerald-300' : 'text-zinc-200'}`}>Pre-workout ab routine</div>
              <div className="text-[10px] text-zinc-600">Saved with this workout</div>
            </div>
          </button>

          <div className="space-y-1.5 mb-4">
            {dayData.exercises.map((ex, i) => {
              const data = sessionData[i];
              if (!data) return null;
              const completedSets = data.sets.filter(s => s.completed).length;
              const nameParts = ex.name.split(' / ');
              const usedAlt = useAltExercise[i] && nameParts.length > 1;
              const displayName = usedAlt ? nameParts[1] : nameParts[0];

              return (
                <div key={i} className="rounded-lg px-3 py-2 border border-zinc-800/50" style={{ backgroundColor: '#12121a' }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-zinc-200">{displayName}</div>
                      <div className="text-[10px] text-zinc-500">
                        {completedSets}/{data.sets.length} sets · {(data.sets.find(s => !s.warmup) || data.sets[0])?.weight || 0} lbs
                      </div>
                    </div>
                    {completedSets === data.sets.length ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <span className="text-[10px] text-amber-500">{completedSets}/{data.sets.length}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-zinc-950 to-transparent" style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
            <div className="max-w-md mx-auto space-y-2">
              <button
                onClick={completeWorkout}
                className="w-full text-white font-semibold py-3.5 rounded-xl text-sm transition-all active:scale-[0.98]"
                style={{ background: accent }}
              >
                Complete workout, progress weight
              </button>
              <button
                onClick={() => startExercise(0)}
                className="w-full text-zinc-400 font-medium py-2 text-sm"
              >
                Review Exercises
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // COMPLETE
  if (view === 'complete') {
    const dayData = workoutData[selectedDay];
    const accent = config.dayAccents[selectedDay];
    const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
      <div className="min-h-screen text-white p-4 flex items-center justify-center" style={{ background: config.bgGradient }}>
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6" style={{ background: accent }}>
            <Trophy className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-xl font-bold text-zinc-100 mb-1">Workout Complete!</h1>
          <p className="text-zinc-500 text-sm mb-2">{dayData.name}</p>
          <p className="text-zinc-600 text-xs mb-6">{todayDate}{lastDurationMin ? ` · ${lastDurationMin} min` : ''}</p>

          {storageError && <div className="mb-6"><StorageWarning onBackup={exportBackup} /></div>}

          {completedPRs.length > 0 && (
            <div className="mb-6 space-y-2">
              <div className="text-[10px] font-semibold tracking-widest text-amber-400">PERSONAL RECORDS</div>
              {completedPRs.map((pr, i) => (
                <div key={i} className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-left flex items-center gap-3">
                  <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-zinc-100">{pr.name}</div>
                    <div className="text-[11px] text-amber-300/90">{pr.detail} <span className="text-zinc-500">(was {pr.prev})</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              setView('home');
              setSelectedDay(null);
              setSessionData({});
              setSessionDay(null);
              setWorkoutStartedAt(null);
              setCompletedPRs([]);
            }}
            className="w-full text-white font-semibold py-3.5 rounded-xl text-sm"
            style={{ background: accent }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(<WorkoutApp />);
