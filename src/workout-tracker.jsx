const { useState, useEffect } = React;

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
        ? { action: 'maintain', addWeight: true, reason: `Bodyweight × ${high}+! Time to switch to weighted` }
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
  if (easy && avgReps >= low) return { action: 'maintain', pushReps: true, reason: `Felt easy last time → push for ${high} on every set` };
  return { action: 'maintain', reason: config.cue || 'Building within rep range' };
};

// Per-exercise overrides in workout data (exercise.progression) win over the
// shared config, so the same movement can be strength-biased in one program
// and hypertrophy-biased in another without forking its logged history.
// The one-line verdict shown on the logging screen. Wording agreed with the lifter:
// four standard labels, two for assisted lifts (where the logged number is machine
// assistance and going DOWN is progress), and three that explain a special case.
const verdictFor = (p) => {
  const v = (label, glyph, tone = 'accent') => ({ label, glyph, tone });
  if (p.kind === 'light') return v(`Light day · ${Math.round(p.config.pct * 100)}%`, 'dash');
  if (p.kind === 'first') return v('First session', 'dash');
  if (p.kind === 'skipped') return v('Skipped last time', 'dash');
  if (p.config.assisted && p.action === 'decrease') return v('Less assist', 'up');
  if (p.config.assisted && p.action === 'increase') return v('More assist', 'down', 'warn');
  if (p.action === 'increase' || p.addWeight) return v('Raise weight', 'up');
  if (p.action === 'decrease' || p.action === 'regress') return v('Lower weight', 'down', 'warn');
  if (p.action === 'progress' || p.pushReps) return v('Raise reps', 'plus');
  return v('Hold', 'dash');
};

// alt = true when the alternate exercise (the name after " / ") is selected. It may
// carry its own overrides in exercise.altProgression.
const getExerciseConfig = (exercise, alt) => ({
  ...(progressionConfig[exercise.id] || defaultProgressionConfig),
  ...(exercise.progression || {}),
  ...(alt ? exercise.altProgression || {} : {})
});

// ---------------------------------------------------------------------------
// Visual system (design/handoff/HANDOFF.md). Everything is an inline style: the
// compiled stylesheet only holds the Tailwind classes that existed before the
// refresh, so a new class would be silently ignored on the phone.
// ---------------------------------------------------------------------------
const T = {
  bg: '#111318', surface: '#1a1d24', line: '#2a2f39', lineStrong: '#3a4150',
  ink: '#e3e6ec', ink2: '#b6bcc8', ink3: '#8b93a3', ink4: '#5e6676',
  accent: '#6fb3ff', warn: '#ef7d5a',
  primaryBg: '#e3e6ec', primaryInk: '#111318', primaryInk2: '#4a5160'
};
const tint = (a) => `rgba(111,179,255,${a})`;
const warnTint = (a) => `rgba(239,125,90,${a})`;
const FONT = "-apple-system, 'SF Pro Text', system-ui, sans-serif";
const DISPLAY = "'SF Pro Display', -apple-system, system-ui, sans-serif";
// Type roles
const TY = {
  screenTitle: { fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, lineHeight: '28px', letterSpacing: -0.3, color: T.ink, margin: 0 },
  rowTitle: { fontWeight: 600, fontSize: 14, lineHeight: '18px', color: T.ink },
  label: { fontWeight: 600, fontSize: 10, lineHeight: '14px', textTransform: 'uppercase', letterSpacing: 0.6, color: T.ink3 },
  accentLabel: { fontWeight: 600, fontSize: 10, lineHeight: '12px', textTransform: 'uppercase', letterSpacing: 0.6, color: T.accent },
  subtitle: { fontWeight: 400, fontSize: 12, lineHeight: '16px', color: T.ink3, margin: 0 },
  note: { fontWeight: 400, fontSize: 11, lineHeight: '16px' },
  meta: { fontWeight: 400, fontSize: 10, lineHeight: '14px', color: T.ink3 }
};
const ellipsis = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const card = { background: T.surface, border: `1px solid ${T.line}`, borderRadius: 8 };
const pressable = 'transition-all active:scale-[0.98]';
// Present for the tests and screen readers, invisible on screen
const srOnly = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' };

// Icons: one stroke style, sized in px
const Ico = ({ d, size = 16, stroke = 2, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'block', ...style }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const ChevronLeft = (p) => <Ico d="M15 19l-7-7 7-7" {...p} />;
const ChevronRight = (p) => <Ico d="M9 5l7 7-7 7" {...p} />;
const Check = (p) => <Ico d="M5 13l4 4L19 7" {...p} />;
const Dumbbell = (p) => <Ico d={['M6.5 6.5v11', 'M17.5 6.5v11', 'M3.5 9.5v5', 'M20.5 9.5v5', 'M6.5 12h11']} {...p} />;
const Trophy = (p) => <Ico d={['M6 9H4.5a2.5 2.5 0 010-5H6', 'M18 9h1.5a2.5 2.5 0 000-5H18', 'M4 22h16', 'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22', 'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22', 'M18 2H6v7a6 6 0 0012 0V2z']} {...p} />;
const RotateCcw = (p) => <Ico d={['M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8', 'M3 3v5h5']} {...p} />;
const Download = (p) => <Ico d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" {...p} />;
const Sparkles = (p) => <Ico d="M12 3l-1.9 5.8a2 2 0 01-1.3 1.3L3 12l5.8 1.9a2 2 0 011.3 1.3L12 21l1.9-5.8a2 2 0 011.3-1.3L21 12l-5.8-1.9a2 2 0 01-1.3-1.3L12 3z" {...p} />;
const Minus = (p) => <Ico d="M6 12h12" {...p} />;
const Plus = (p) => <Ico d={['M12 6v12', 'M6 12h12']} {...p} />;
const ArrowUp = (p) => <Ico d={['M12 19V5', 'M6 11l6-6 6 6']} {...p} />;
const ArrowDown = (p) => <Ico d={['M12 5v14', 'M6 13l6 6 6-6']} {...p} />;
const TrendingUp = ArrowUp;
const TrendingDown = ArrowDown;
const Pencil = (p) => <Ico d={['M12 20h9', 'M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z']} {...p} />;
const Swap = (p) => <Ico d={['M17 2l4 4-4 4', 'M3 11v-1a4 4 0 014-4h14', 'M7 22l-4-4 4-4', 'M21 13v1a4 4 0 01-4 4H3']} {...p} />;
const Copy = (p) => <Ico d={['M9 9h10a2 2 0 012 2v8a2 2 0 01-2 2H11a2 2 0 01-2-2V9z', 'M5 15H4a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2v1']} {...p} />;
const SkipForward = (p) => <Ico d={['M13 17l5-5-5-5', 'M6 17l5-5-5-5']} {...p} />;

// Page frame. The top inset (safe area + 12) comes from the `#root > div` rule in
// shell.html; screens other than the logging ones start 4 px lower (16 in total).
// Fixed bars must be direct children of the inner div: tests/measure.js reads them there.
const Page = ({ pad = 16, bottom = 0, center, children }) => (
  <div style={{ minHeight: '100vh', boxSizing: 'border-box', background: T.bg, color: T.ink, fontFamily: FONT, paddingLeft: pad, paddingRight: pad, paddingBottom: bottom, ...(center ? { display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}) }}>
    <div style={{ maxWidth: 448, width: '100%', margin: '0 auto', paddingTop: pad === 12 ? 0 : 4 }}>{children}</div>
  </div>
);
const BackLink = ({ onClick, gap = 16 }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, fontSize: 14, lineHeight: '20px', color: T.ink3, marginBottom: gap }}><ChevronLeft size={16} /> Back</button>
);
// Fixed bar that holds a screen's primary action(s) above the home indicator
const ActionBar = ({ children }) => (
  <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, padding: 12, paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))', background: `linear-gradient(to top, ${T.bg} 70%, rgba(17,19,24,0))` }}>
    <div style={{ maxWidth: 448, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
  </div>
);
const PrimaryButton = ({ onClick, height = 48, children }) => (
  <button onClick={onClick} className={pressable} style={{ width: '100%', height, borderRadius: 12, background: T.primaryBg, color: T.primaryInk, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{children}</button>
);
const SecondaryButton = ({ onClick, height = 50, children }) => (
  <button onClick={onClick} className={pressable} style={{ width: '100%', height, borderRadius: 12, background: T.surface, border: `1px solid ${T.lineStrong}`, color: T.ink, fontWeight: 600, fontSize: 14 }}>{children}</button>
);
// Checkbox row for the pre-workout ab routine (day overview and summary)
const AbRow = ({ done, onToggle, sub, gap }) => (
  <button onClick={onToggle} className={pressable} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: gap, textAlign: 'left', borderRadius: 8, background: done ? tint(0.10) : T.surface, border: `1px solid ${done ? tint(0.55) : T.line}` }}>
    <div style={{ width: 24, height: 24, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? T.accent : T.line, border: `1px solid ${done ? T.accent : T.lineStrong}`, color: T.primaryInk }}>
      {done ? <Check size={14} stroke={3.5} /> : null}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ ...TY.rowTitle, lineHeight: '20px' }}>Pre-workout ab routine</div>
      <div style={TY.meta}>{sub}</div>
    </div>
  </button>
);

// Epley estimate of a one-rep max from one set
const e1rm = (s) => s.weight * (1 + s.reps / 30);

// What one session is worth on the progress chart. Rep-based lifts use the best set's
// estimated 1RM, so more reps at the same weight shows as progress. Bodyweight lifts
// use best reps. Carries, sleds and assisted lifts use the load itself.
const sessionMetric = (entry, config) => {
  const sets = getPerformedSets(entry);
  if (sets.length === 0) return null;
  if (config.assisted || config.progressionType === 'distance-first' || config.progressionType === 'time-first') return { v: sets[0].weight, label: 'Load', unit: ' lb' };
  if (Math.max(...sets.map(s => s.weight)) <= 0) return { v: Math.max(...sets.map(s => s.reps)), label: 'Best reps', unit: '' };
  const best = Math.max(...sets.map(e1rm));
  return { v: best < 50 ? Math.round(best * 10) / 10 : Math.round(best), label: 'Est. 1RM', unit: ' lb' };
};

// Trend across all logged sessions. For assisted exercises the load going DOWN is progress.
const ProgressSpark = ({ entries, config, gap }) => {
  const all = entries.filter(e => !e.skipped).map(e => sessionMetric(e, config)).filter(Boolean);
  const kind = all.length ? all[all.length - 1].label : null;
  const pts = all.filter(m => m.label === kind);
  if (pts.length < 3) return null;
  const unit = pts[0].unit;
  const ws = pts.map(m => m.v);
  const min = Math.min(...ws), max = Math.max(...ws);
  const span = Math.max(max - min, 1);
  const W = 280, H = 24, P = 5;
  const x = (i) => (i / (pts.length - 1)) * W;
  const y = (w) => H - P - ((w - min) / span) * (H - 2 * P);
  const line = pts.map((m, i) => `${x(i).toFixed(1)},${y(m.v).toFixed(1)}`).join(' ');
  const delta = Math.round((ws[ws.length - 1] - ws[0]) * 10) / 10;
  const improved = config.assisted ? delta < 0 : delta > 0;
  return (
    <div className="progress-spark" style={{ height: 54, boxSizing: 'border-box', padding: '6px 12px', borderRadius: 6, background: T.surface, marginBottom: gap }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, height: 14 }}>
        <span style={{ ...TY.label, ...ellipsis, flex: 1, minWidth: 0 }}>{kind} · {pts.length} sessions{config.assisted ? ' · lower = better' : ''} · {ws[0]} → {ws[ws.length - 1]}{unit}</span>
        <span style={{ fontWeight: 700, fontSize: 11, lineHeight: '14px', color: improved ? T.accent : T.ink3, flexShrink: 0 }}>{delta === 0 ? '' : delta > 0 ? '▲ ' : '▼ '}{Math.abs(delta)}{unit}</span>
      </div>
      {/* The end ring is a div, not an SVG circle: the SVG is stretched to the card width */}
      <div style={{ position: 'relative', height: H, marginTop: 4, marginRight: 5 }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: H, overflow: 'visible' }}>
          <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke={T.line} strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
          <polyline points={line} fill="none" stroke={T.accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <div style={{ position: 'absolute', right: -5, top: y(ws[ws.length - 1]) - 5, width: 10, height: 10, boxSizing: 'border-box', borderRadius: 5, background: T.bg, border: `2px solid ${T.accent}` }} />
      </div>
    </div>
  );
};

// Last-session chips: a filled dot for a working set, a hollow one for a warm-up
const LastChips = ({ sets, tight }) => (sets || []).map((s, i) => (
  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 18, boxSizing: 'border-box', padding: tight ? '0 5px' : '0 7px', borderRadius: 9, flexShrink: 0, fontWeight: 600, fontSize: 10, fontVariantNumeric: 'tabular-nums', ...(s.warmup ? { border: `1px solid ${T.lineStrong}`, color: T.ink3 } : { background: T.line, color: T.ink }) }}>
    <span style={{ width: 5, height: 5, boxSizing: 'border-box', borderRadius: 3, ...(s.warmup ? { border: `1px solid ${T.ink3}` } : { background: s.completed ? T.accent : T.ink4 }) }} />
    {s.weight}×{s.reps}
  </span>
));

// The 44 x 44 cell on either side of a dial
const StepBtn = ({ onClick, side, dim, children }) => (
  <button onClick={onClick} className="active:scale-90" style={{ width: 44, height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 500, lineHeight: 1, color: dim ? T.ink3 : T.ink, [side === 'left' ? 'borderRight' : 'borderLeft']: `1px solid ${T.line}` }}>{children}</button>
);
// Minus, value, plus in one housing
const Dial = ({ value, tone, onMinus, onPlus, style }) => (
  <div style={{ display: 'flex', alignItems: 'center', height: 44, boxSizing: 'border-box', borderRadius: 8, overflow: 'hidden', background: T.surface, border: `1px solid ${tone === 'done' ? T.accent : tone === 'warmup' ? T.line : T.lineStrong}`, ...style }}>
    <StepBtn onClick={onMinus} side="left" dim={tone === 'warmup'}>−</StepBtn>
    <div className="set-value" style={{ flex: '1 1 auto', minWidth: 36, padding: '0 2px', textAlign: 'center', fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, lineHeight: '44px', fontVariantNumeric: 'tabular-nums', color: tone === 'warmup' ? T.ink3 : T.ink }}>{value}</div>
    <StepBtn onClick={onPlus} side="right" dim={tone === 'warmup'}>+</StepBtn>
  </div>
);

// One loggable set: toggle, weight dial, reps dial, copy-previous. Shared by the
// workout screen and the history editor (copy = undefined there: no slot at all).
const SetRow = ({ set, label, config, onToggle, onChange, onCopy }) => {
  const tone = set.completed ? 'done' : set.warmup ? 'warmup' : 'working';
  return (
    <div className="set-row" style={{ height: 52, boxSizing: 'border-box', padding: '3px 6px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8, background: set.completed ? tint(0.08) : 'transparent' }}>
      <button onClick={onToggle} className="set-toggle w-9 h-11 active:scale-90" style={{ width: 36, height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ width: 24, height: 24, boxSizing: 'border-box', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', ...(set.completed ? { background: T.accent, color: T.primaryInk } : set.warmup ? { border: `1.5px dashed ${T.ink4}`, color: T.ink3, fontWeight: 600, fontSize: 10 } : { border: `2px solid ${T.ink3}`, color: T.ink, fontWeight: 600, fontSize: 11 }) }}>
          {set.completed ? <Check size={14} stroke={3.5} /> : label}
        </span>
      </button>
      <Dial value={set.weight} tone={tone} style={{ width: 128, minWidth: 'max-content', flex: '0 1 auto' }} onMinus={() => onChange('weight', stepWeight(config, set.weight, -1))} onPlus={() => onChange('weight', stepWeight(config, set.weight, 1))} />
      <div style={{ width: 1, flexShrink: 0 }} />
      <Dial value={set.reps} tone={tone} style={{ flex: '1 1 auto', minWidth: 0 }} onMinus={() => onChange('reps', Math.max(1, set.reps - 1))} onPlus={() => onChange('reps', set.reps + 1)} />
      {onCopy === undefined ? null : onCopy ? (
        <button onClick={onCopy} className="active:scale-90" title="Copy previous set" style={{ width: 32, height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3 }}><Copy size={14} /></button>
      ) : (
        <div style={{ width: 32, height: 44, flexShrink: 0 }} />
      )}
    </div>
  );
};
// Row label: W for warm-ups, otherwise the working-set number
const setLabel = (sets, i) => sets[i].warmup ? 'W' : i + 1 - sets.slice(0, i).filter(s => s.warmup).length;

// How the last set felt. Optional. Easy = 3 or more reps left, Mid = about right (the
// engine treats it like no rating), Max = nothing left. One tap to set, same tap to clear.
// compact drops the "last set" caption where three chips leave no room for it.
const EffortChips = ({ value, onChange, compact }) => (
  <div className="effort-chips" style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
    {compact ? null : <span style={{ fontWeight: 500, fontSize: 10, lineHeight: '14px', color: T.ink3 }}>last set</span>}
    {[['easy', 'Easy'], ['mid', 'Mid'], ['max', 'Max']].map(([k, label]) => (
      <button key={k} onClick={() => onChange(value === k ? null : k)} className="active:scale-90" style={{ height: 26, minWidth: 40, boxSizing: 'border-box', padding: '0 10px', borderRadius: 13, fontWeight: 600, fontSize: 11, border: `1px solid ${value === k ? T.accent : T.lineStrong}`, background: value === k ? tint(0.10) : 'transparent', color: value === k ? T.accent : T.ink2 }}>{label}</button>
    ))}
  </div>
);

// Today's recommendation as one bold line. The engine's full reason stays on the
// element as data-reason (never shown) so the tests can still check the rule that fired.
const VERDICT_GLYPH = { dash: Minus, plus: Plus, up: ArrowUp, down: ArrowDown };
const Verdict = ({ verdict, reason, inline, gap }) => {
  const Glyph = VERDICT_GLYPH[verdict.glyph];
  const color = verdict.tone === 'warn' ? T.warn : T.accent;
  const ring = inline ? 16 : 28;
  return (
    <div className="verdict" data-reason={reason || ''} style={{ display: 'flex', alignItems: 'center', boxSizing: 'border-box', marginBottom: gap, ...(inline ? { height: 18, gap: 6 } : { minHeight: 44, padding: '4px 12px', gap: 10, borderRadius: 6, background: T.surface }) }}>
      <span style={{ width: ring, height: ring, boxSizing: 'border-box', borderRadius: ring / 2, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `${inline ? 1.5 : 2}px solid ${color}`, color }}><Glyph size={inline ? 9 : 14} stroke={inline ? 3 : 2.5} /></span>
      <span style={{ ...ellipsis, fontWeight: 600, fontSize: inline ? 12 : 13, lineHeight: '18px', color: T.ink }}>{verdict.label}</span>
    </div>
  );
};

// Collapsed: last session's note (first line) so it can't be missed. Expanded: textarea.
const NoteRow = ({ open, height, today, previous, onOpen, onClose, onChange, gap }) => {
  const prev = (previous || '').trim();
  const prevFirst = prev.split('\n')[0];
  const todayFirst = (today || '').trim().split('\n')[0];
  return !open ? (
    <button onClick={onOpen} className="notes-row" style={{ width: '100%', height, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', marginBottom: gap, textAlign: 'left', borderRadius: 6, border: `1px dashed ${T.lineStrong}` }}>
      <span style={{ color: T.ink3 }}><Pencil size={14} /></span>
      <span style={{ ...TY.note, ...ellipsis, flex: 1, minWidth: 0 }}>
        {todayFirst
          ? <span style={{ color: T.ink }}>{todayFirst}</span>
          : prevFirst
          ? <span style={{ color: T.ink2 }}><span style={{ ...TY.label, marginRight: 6 }}>Last time</span>{prevFirst}</span>
          : <span style={{ color: T.ink3 }}>Add a note…</span>}
      </span>
    </button>
  ) : (
    <div className="notes-open" style={{ padding: '8px 12px', marginBottom: gap, borderRadius: 6, border: `1px solid ${T.lineStrong}`, background: T.surface }}>
      {prev && <div style={{ ...TY.note, color: T.ink2, marginBottom: 4 }}><span style={{ ...TY.label, marginRight: 6 }}>Last time</span>{prev}</div>}
      <textarea value={today || ''} onChange={(e) => onChange(e.target.value)} placeholder="Add workout notes..." rows={3} autoFocus style={{ width: '100%', background: 'transparent', border: 'none', color: T.ink, fontFamily: FONT, fontSize: 14, lineHeight: '20px' }} />
      <button onClick={onClose} style={{ fontWeight: 600, fontSize: 11, color: T.ink3, marginTop: 4 }}>Done</button>
    </div>
  );
};

// Prev / Skip / Next. Same three controls in the same order; Next names what comes next.
const BottomBar = ({ onPrev, prevDisabled, onSkip, onNext, next }) => {
  const side = { width: 64, height: 87, flexShrink: 0, boxSizing: 'border-box', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, fontWeight: 600 };
  return (
    <div className="bottom-bar" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, paddingBottom: 'env(safe-area-inset-bottom, 0px)', pointerEvents: 'none' }}>
      <div style={{ maxWidth: 448, margin: '0 auto', boxSizing: 'border-box', padding: '0 16px', height: 87, display: 'flex', gap: 10, pointerEvents: 'auto' }}>
        <button onClick={onPrev} disabled={prevDisabled} className="nav-prev active:scale-90" style={{ ...side, fontSize: 10, ...(prevDisabled ? { border: `1px solid ${T.line}`, background: 'transparent', color: T.ink4 } : { border: `1px solid ${T.lineStrong}`, background: T.surface, color: T.ink }) }}>
          <ChevronLeft size={24} />Prev
        </button>
        <button onClick={onSkip} className="nav-skip active:scale-90" style={{ ...side, fontSize: 11, border: `1px solid ${T.lineStrong}`, background: T.surface, color: T.ink }}>
          <SkipForward size={14} />Skip
        </button>
        <button onClick={onNext} className="nav-next active:scale-[0.98]" style={{ flex: 1, minWidth: 0, height: 87, boxSizing: 'border-box', borderRadius: 12, padding: '0 16px 0 18px', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left', background: T.primaryBg, color: T.primaryInk }}>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontWeight: 700, fontSize: 10, lineHeight: '12px', textTransform: 'uppercase', letterSpacing: 0.6, color: T.primaryInk2 }}>{next.label}</span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, lineHeight: '19px', margin: '2px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{next.name}</span>
            {next.detail ? <span style={{ display: 'block', ...ellipsis, fontSize: 11, lineHeight: '14px', color: T.primaryInk2 }}>{next.detail}</span> : null}
          </span>
          <ChevronRight size={30} stroke={2.5} />
        </button>
      </div>
    </div>
  );
};

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

// Shown when a write to localStorage failed (storage full or blocked)
const StorageWarning = ({ onBackup }) => (
  <button onClick={onBackup} className="storage-warning" style={{ width: '100%', marginTop: 8, padding: '8px 12px', textAlign: 'left', borderRadius: 8, fontWeight: 600, fontSize: 11, lineHeight: '16px', border: `1px solid ${warnTint(0.55)}`, background: warnTint(0.14), color: T.warn }}>
    Saving to this phone failed, so your latest workout is not stored. Tap here to download a backup now.
  </button>
);

// Spacing that the design adds on top of the old layout. Home has 10 pt of spare height and
// the day overview 19, so these are the first things to shrink if `npm run measure` fails.
const HOME_GAP = 16;
const DAY_GAPS = { back: 20, header: 20, ab: 16 };

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
  day4: { name: "Lower Size · Squat", focus: "Squat strength · light deadlift · posterior chain", mobility: [
    "Weighted knee-to-wall (KB or plate on knee) · 10/side",
    "Adductor rock-backs · 8/side",
    "Goblet deep-squat pry with a 10-25 lb plate · 3×5 breaths",
    "90/90 hip switches · 5/side",
    "Empty-bar squat ×8 with a 3 s pause at depth → first ramp set"
  ], exercises: [
    { id: "squat", name: "Barbell Squat / Front Squat", sets: 5, warmupSets: 2, reps: "4-6", defaultWeight: 155, muscles: ["quads", "glutes", "hamstrings"], notes: "2 ramp (~50%/70%), then 3 heavy · 3 min", progression: { repRange: [4, 6], incrementPct: 0.02, stallReset: true } },
    { id: "deadlift_light", name: "Light Deadlift / Trap Bar Deadlift", sets: 3, warmupSets: 1, reps: "3", defaultWeight: 175, muscles: ["hamstrings", "glutes", "lats"], notes: "Weight is set for you at ~78% of deadlift day · 2 min · reset every rep. Trap bar when the back is beat" },
    { id: "leg_press", name: "Leg Press / Bulgarian Split Squat", sets: 3, reps: "8-12", defaultWeight: 270, muscles: ["quads", "glutes"], notes: "3 at weight, no warm-up (the squats and deadlifts already did it) · 90 s", progression: { restTime: 90 } },
    { id: "back_extension", name: "45° Back Extension / Reverse Hyper", sets: 3, reps: "10-15", defaultWeight: 0, muscles: ["hamstrings", "glutes"], notes: "⇄ Superset with calves · hold a plate, full hip flexion at the bottom", superset: 1, progression: { repRange: [10, 15], restTime: 60 } },
    { id: "calf_raise", name: "Seated Calf Raise", sets: 3, reps: "12-20", defaultWeight: 90, muscles: ["calves"], notes: "⇄ Superset with back extension · plate-loaded seated machine · full range, pause at the stretch", superset: 1, description: "Seated calf raise machine, plate-loaded. Pads on your lower thighs, balls of the feet on the platform, heels hanging off. Let the heels drop to a full stretch, pause, then drive up and squeeze at the top. Log the plates you load, not counting the machine." },
  ]},
  day5: { name: "Arms + Shoulders", focus: "Dips toward bodyweight · triceps · biceps · delts · pull", mobility: [
    "Shoulder CARs, slow full circles · 3/side",
    "Band external rotation ×15 + pull-aparts ×15",
    "Wrist flexor / extensor stretch on the floor · 20 s each",
    "Overhead lat stretch · 2×20 s",
    "Light lateral raises ×15 + hammer curls ×15 → first working set"
  ], exercises: [
    { id: "dips", name: "Assisted Dips / Machine Dip", altProgression: { assisted: false }, sets: 3, reps: "6-10", defaultWeight: 60, muscles: ["triceps", "chest"], notes: "⇄ Superset with pulldown · weight = assistance, less is harder · goal: 0 = bodyweight", superset: 1, progression: { repRange: [6, 10], restTime: 90 } },
    { id: "lat_pulldown", name: "Lat Pulldown / Pull-ups", sets: 3, reps: "6-10", defaultWeight: 100, muscles: ["lats", "biceps"], notes: "⇄ Superset with dips · counts as biceps work too", superset: 1, progression: { progressionType: "load-first", repRange: [6, 10], restTime: 90 } },
    { id: "lean_tri_ext", name: "Leaning Tricep Extension / Tricep Pushdown", sets: 3, reps: "8-15", defaultWeight: 30, muscles: ["triceps"], notes: "⇄ Superset with hammer curls · face away, lean forward, press forward", superset: 2 },
    { id: "hammer_curl", name: "Hammer Curl / Cross-Body Curl", sets: 3, reps: "10-15", defaultWeight: 25, muscles: ["biceps", "forearms"], notes: "⇄ Superset with tricep extension · brachialis + grip for the log and carries", superset: 2, progression: { restTime: 75 } },
    { id: "lateral_raise", name: "Lateral Raise + Bent-Over Fly / Cable Lateral", sets: 2, reps: "7-12", defaultWeight: 10, muscles: ["sideDelts", "rearDelts"], notes: "Side raise + bent-over fly back to back = 1 set · start 7 reps, build to 12 · 60 s" }
  ]},
  day6: { name: "Strongman Conditioning", focus: "Lunges · step-ups · carries · back extension · no pressing", mobility: [
    "Ankle rocks / bodyweight knee-to-wall · 10/side",
    "Walking lunge with overhead reach · 10 steps",
    "Spiderman lunge with T-spine rotation · 5/side",
    "Cossack squats · 6/side",
    "Light farmer's carry 60 ft out and back → first lunge set"
  ], exercises: [
    { id: "walking_lunge", name: "Walking Lunges / Stationary Lunges", sets: 4, reps: "24-30 steps", defaultWeight: 25, muscles: ["quads", "glutes"], notes: "Per dumbbell · long steps, steady pace · 90 s" },
    { id: "step_up", name: "Box Step-Up / Diagonal Step-Up", sets: 3, reps: "10-12", defaultWeight: 20, muscles: ["quads", "glutes"], notes: "Per dumbbell, per leg · knee-high box, control the way down · 60 s" },
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
  'sled push': { id: 'sled_push', alt: false }, 'prowler push': { id: 'sled_push', alt: true },
  'backward sled drag': { id: 'sled_drag', alt: false }, 'sled pull': { id: 'sled_drag', alt: true },
  'seated calf': { id: 'calf_raise', alt: false },
  'lat pulldown': { id: 'lat_pulldown', alt: false }, 'pull-ups': { id: 'lat_pulldown', alt: true }, 'assisted pull-ups': { id: 'lat_pulldown', alt: true }
};

const programConfigs = {
  '4day': { name: "Strongman Hypertrophy", subtitle: "6-Day Rotation · Power + Size + Strongman", data: workoutData4Day, dayCount: 6, icon: Dumbbell },
  '3day': { name: "Peach Protocol", subtitle: "3-Day Glute & Core Sculpt", data: workoutData3Day, dayCount: 3, icon: Sparkles }
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
  // An exercise and its alternate ("Conventional Deadlift" vs "Trap Bar Deadlift") are
  // tracked separately: alt = true/false picks one variant's history, undefined takes all
  // (exercises with no alternate, and lookups that don't care).
  const variantEntries = (exerciseId, alt) => {
    if (!selectedProgram) return [];
    const all = [];
    Object.values(workoutLog[selectedProgram] || {}).forEach(dayLog => {
      (dayLog?.exercises?.[exerciseId] || []).forEach(entry => { if (alt === undefined || !!entry.usedAlt === alt) all.push(entry); });
    });
    return all.sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  // Full history, oldest first - feeds the progress chart, stall check and PR detection
  const getAllSessions = (exerciseId, alt) => variantEntries(exerciseId, alt);
  const getLastSession = (exerciseId, alt) => { const all = variantEntries(exerciseId, alt); return all.length ? all[all.length - 1] : null; };
  // Which variant is selected for the exercise at this position today
  const hasAlt = (exercise) => exercise.name.includes(' / ');
  const altOf = (exercise, index) => hasAlt(exercise) ? !!useAltExercise[index] : undefined;

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

  const calculateProgression = (exercise, alt) => { const p = computeProgression(exercise, alt); return { ...p, verdict: verdictFor(p) }; };
  const computeProgression = (exercise, alt) => {
    const config = getExerciseConfig(exercise, alt);
    const [low, high] = config.repRange;
    let lastData = getLastSession(exercise.id, alt);
    // New prescription: older sessions stay logged but stop seeding weight/reps
    if (config.restartFrom && lastData && new Date(lastData.date) < new Date(config.restartFrom)) lastData = null;
    const performed = lastData ? getPerformedSets(lastData) : [];
    const lastWeight = lastData ? (performed[0]?.weight ?? lastData.weight) : null;
    const lastAvgReps = lastData ? Math.round(avgRepsOf(performed)) : null;

    // Light second exposure: load follows the heavy lift's current working weight
    if (config.derivedFrom) {
      // Follow the heavy lift's main variant; fall back to whatever was logged
      const parentLast = getLastSession(config.derivedFrom, false) || getLastSession(config.derivedFrom);
      const prog = programConfigs[selectedProgram];
      const parentEx = prog ? Object.values(prog.data).flatMap(d => d.exercises).find(e => e.id === config.derivedFrom) : null;
      const parentBase = parentLast ? (getPerformedSets(parentLast)[0]?.weight ?? parentLast.weight) : (parentEx?.defaultWeight ?? exercise.defaultWeight);
      const derived = Math.max(5, Math.round((parentBase * config.pct) / 5) * 5);
      const parentName = (parentEx?.name || config.derivedFrom).split(' / ')[0];
      return { weight: derived, reps: lastAvgReps ?? high, suggestion: `${Math.round(config.pct * 100)}% of your ${parentName} (${parentBase} lb) — no need to push this`, action: 'maintain', kind: 'light', icon: Minus, config, lastWeight: derived, lastSession: lastData };
    }

    if (!lastData) {
      // First session of the alternate: start from its own default if it has one, otherwise
      // from the main exercise's last working weight as the nearest guess
      const other = alt ? getLastSession(exercise.id, false) : null;
      const firstWeight = alt ? (exercise.altDefaultWeight ?? (other && !other.skipped ? (getPerformedSets(other)[0]?.weight ?? other.weight) : exercise.defaultWeight)) : exercise.defaultWeight;
      return { weight: firstWeight, reps: config.startReps ?? high, suggestion: 'First time - start with suggested weight', action: 'start', kind: 'first', icon: null, config };
    }

    // If last session was skipped, don't progress - keep same weight/reps
    if (lastData.skipped) {
      return { weight: lastWeight, reps: lastAvgReps, suggestion: 'Skipped last time', action: 'maintain', kind: 'skipped', icon: Minus, config, lastWeight, lastSession: lastData };
    }

    const result = runProgression(config, lastData);

    // Reactive reset for the big lifts: three straight sessions at the same load with
    // no rep gain -> drop 10% and rebuild. No calendar deloads. A session at a lower
    // load (e.g. right after a reset) is not a stall.
    if (config.stallReset && result.action === 'maintain') {
      const hist = getAllSessions(exercise.id, alt).filter(e => !e.skipped).slice(-4);
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
    return { weight: newWeight, reps: newReps, suggestion: result.reason, action: result.action, pushReps: !!result.pushReps, addWeight: !!result.addWeight, icon, config, lastWeight, lastSession: lastData };
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
  const initialExerciseData = (exercise, alt) => {
    const progression = calculateProgression(exercise, alt);
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
      unit.forEach(i => { if (!next[i]) next[i] = initialExerciseData(exercises[i], altOf(exercises[i], i)); });
      return next;
    });
    setView('exercise');
  };

  const patchExercise = (exIndex, patch) => setSessionData(prev => ({ ...prev, [exIndex]: { ...prev[exIndex], ...(typeof patch === 'function' ? patch(prev[exIndex]) : patch) } }));
  const updateSet = (exIndex, setIndex, field, value) => patchExercise(exIndex, d => ({ sets: d.sets.map((s, i) => i === setIndex ? { ...s, [field]: value } : s) }));
  const toggleSetComplete = (exIndex, setIndex) => patchExercise(exIndex, d => ({ sets: d.sets.map((s, i) => i === setIndex ? { ...s, completed: !s.completed } : s) }));
  const copyPreviousSet = (exIndex, setIndex) => patchExercise(exIndex, d => setIndex === 0 ? {} : ({ sets: d.sets.map((s, i) => i === setIndex ? { ...s, weight: d.sets[setIndex - 1].weight, reps: d.sets[setIndex - 1].reps } : s) }));
  // Switching to the alternate swaps the name, the history and the pre-filled numbers.
  // Rows that already have a logged set are left alone so nothing typed is lost.
  const toggleAltExercise = (exIndex) => {
    const exercise = programConfigs[selectedProgram].data[selectedDay].exercises[exIndex];
    const nextAlt = !useAltExercise[exIndex];
    setUseAltExercise(prev => ({ ...prev, [exIndex]: nextAlt }));
    setSessionData(prev => {
      const cur = prev[exIndex];
      if (!cur || cur.sets.some(s => s.completed)) return prev;
      return { ...prev, [exIndex]: { ...cur, sets: initialExerciseData(exercise, nextAlt).sets } };
    });
  };

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
  const configForId = (id, usedAlt) => {
    const ex = Object.values(programConfigs[selectedProgram]?.data || {}).flatMap(d => d.exercises).find(e => e.id === id);
    return ex ? getExerciseConfig(ex, !!usedAlt && hasAlt(ex)) : (progressionConfig[id] || defaultProgressionConfig);
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
      const cfg = getExerciseConfig(exercise, usedAlt);
      const priorSets = getAllSessions(exerciseId, hasAlt(exercise) ? !!usedAlt : undefined)
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
          if (iEff >= 0 && /^(easy|mid|max)$/i.test((r[iEff] || '').trim())) g.entry.effort = r[iEff].trim().toLowerCase();
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
      <Page center>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ ...TY.screenTitle, fontSize: 24, lineHeight: '32px', marginBottom: 8 }}>Choose Your Program</h1>
          <p style={{ ...TY.subtitle, fontSize: 14, lineHeight: '20px' }}>Select a workout plan to get started</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(programConfigs).map(([key, cfg]) => (
            <button key={key} onClick={() => selectProgram(key)} className={pressable} style={{ ...card, width: '100%', padding: 20, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.accent, color: T.primaryInk }}><cfg.icon size={24} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: T.ink }}>{cfg.name}</div>
                <div style={TY.subtitle}>{cfg.subtitle}</div>
              </div>
              <span style={{ color: T.ink4 }}><ChevronRight size={20} /></span>
            </button>
          ))}
        </div>
      </Page>
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

    // Consistency: workouts per week over the last 8 weeks
    const dates = [];
    Object.values(workoutLog[selectedProgram] || {}).forEach(d => (d?.sessions || []).forEach(s => dates.push(new Date(s.date))));
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

    const ageDays = lastBackupAt ? Math.floor((Date.now() - new Date(lastBackupAt).getTime()) / 864e5) : null;
    const showNudge = dates.length >= 3 && (ageDays === null || ageDays > 21);
    const util = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0', borderRadius: 8, fontWeight: 600, fontSize: 10, lineHeight: '14px', color: T.ink3, cursor: 'pointer' };
    const filled = { background: T.surface, border: `1px solid ${T.line}` };

    return (
      <Page>
        <div style={{ textAlign: 'center', marginBottom: HOME_GAP }}>
          <button onClick={() => setView('programSelect')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, lineHeight: '16px', color: T.ink3, marginBottom: 10 }}><ChevronLeft size={12} /> Switch program</button>
          <div style={{ width: 40, height: 40, margin: '0 auto 8px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.accent, color: T.primaryInk }}><config.icon size={20} stroke={2.5} /></div>
          <h1 style={TY.screenTitle}>{config.name}</h1>
          <p style={TY.subtitle}>{config.subtitle}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(workoutData).map(([day, data]) => (
            <button key={day} onClick={() => startDay(day)} className={pressable} style={{ ...card, width: '100%', padding: '11px 16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...TY.meta, ...ellipsis, fontWeight: 500 }}><span style={{ ...TY.accentLabel, lineHeight: '14px' }}>Day {day.replace('day', '')}</span> · {data.exercises.length} exercises{ago(lastDone[day])}</div>
                <div style={{ ...TY.rowTitle, ...ellipsis }}>{data.name}</div>
              </div>
              {day === nextDay && <span className="next-up" style={{ height: 18, boxSizing: 'border-box', padding: '0 7px', borderRadius: 9, border: `1px solid ${T.accent}`, color: T.accent, fontWeight: 600, fontSize: 10, lineHeight: '16px', textTransform: 'uppercase', letterSpacing: 0.6, flexShrink: 0 }}>Next</span>}
              <span style={{ color: T.ink4 }}><ChevronRight size={16} /></span>
            </button>
          ))}
        </div>
        {dates.length > 0 && (
          <div style={{ ...card, marginTop: HOME_GAP, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={TY.label}>Last 8 weeks</span>
              <span style={TY.meta}>{weeks[7]} this week · <span style={{ color: T.ink, fontWeight: 600 }}>{dates.length} total</span></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 32 }}>
              {weeks.map((c, i) => (
                <div key={i} style={{ flex: 1, borderRadius: c === 0 ? 2 : 4, height: `${c === 0 ? 10 : 30 + (c / maxW) * 70}%`, background: c === 0 ? T.line : T.accent, opacity: c === 0 || c === maxW ? 1 : 0.55 }} />
              ))}
            </div>
          </div>
        )}
        {storageError && <StorageWarning onBackup={exportBackup} />}
        {showNudge && (
          <button onClick={exportBackup} style={{ ...ellipsis, display: 'block', width: '100%', marginTop: 8, padding: '8px 12px', textAlign: 'left', borderRadius: 8, fontWeight: 600, fontSize: 10, lineHeight: '14px', color: T.warn, background: warnTint(0.14), border: `1px solid ${warnTint(0.4)}` }}>
            {ageDays === null ? 'Never backed up' : `Last backup ${ageDays} days ago`} — your log lives only on this phone. Tap to save a backup.
          </button>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={exportBackup} style={{ ...util, ...filled }}><Download size={12} /> Backup</button>
          <label style={{ ...util, ...filled }}>
            <input type="file" accept=".json,.csv,.txt,application/json,text/csv,text/plain" className="hidden csv-import" onChange={(e) => { const f = e.target.files[0]; if (f) importAny(f); e.target.value = ''; }} />
            <RotateCcw size={12} /> Restore / Import
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button onClick={() => setView('history')} style={{ ...util, ...filled }}>History</button>
          <button onClick={exportCSV} style={{ ...util, border: `1px solid ${T.line}` }}>Export CSV</button>
          <button onClick={resetData} style={{ ...util, border: '1px solid transparent' }}>Reset</button>
        </div>
      </Page>
    );
  }

  // HISTORY: every logged workout, newest first. The one screen that scrolls.
  if (view === 'history') {
    const sessions = listSessions(workoutLog[selectedProgram]);
    return (
      <Page bottom={24}>
        <BackLink onClick={() => setView('home')} />
        <h1 style={TY.screenTitle}>History</h1>
        <p style={{ ...TY.subtitle, marginBottom: 16 }}>{sessions.length === 0 ? 'No workouts logged yet' : `${sessions.length} workouts · tap one to review or fix it`}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sessions.map(sess => {
            const done = sess.entries.filter(x => !x.entry.skipped).length;
            const prs = sess.meta?.prs?.length || 0;
            return (
              <button key={sess.day + sess.key} onClick={() => { setHistorySel({ day: sess.day, key: sess.key }); setView('historySession'); }} className={`history-row ${pressable}`} style={{ ...card, width: '100%', padding: '10px 16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...TY.accentLabel, lineHeight: '14px' }}>{new Date(sess.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div style={{ ...TY.rowTitle, ...ellipsis }}>{workoutData[sess.day]?.name || sess.day}</div>
                  <div style={TY.meta}>{done} {done === 1 ? 'exercise' : 'exercises'}{sess.meta?.durationMin ? ` · ${sess.meta.durationMin} min` : ''}{prs ? <span> · <span style={{ color: T.accent, fontWeight: 600 }}>{prs} PR</span></span> : null}</div>
                </div>
                <span style={{ color: T.ink4 }}><ChevronRight size={16} /></span>
              </button>
            );
          })}
        </div>
      </Page>
    );
  }

  // HISTORY SESSION: one logged workout, editable in place
  if (view === 'historySession') {
    const sess = historySel && listSessions(workoutLog[selectedProgram]).find(x => x.day === historySel.day && x.key === historySel.key);
    return (
      <Page bottom={24}>
        <BackLink onClick={() => setView('history')} />
        {!sess ? <p style={TY.subtitle}>This workout is no longer in the log.</p> : (
          <>
            <div style={{ ...TY.accentLabel, marginBottom: 2 }}>{new Date(sess.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <h1 style={TY.screenTitle}>{workoutData[sess.day]?.name || sess.day}</h1>
            <p style={{ ...TY.subtitle, marginBottom: 12 }}>Changes save as you make them and feed the next suggestion.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sess.entries.map(({ id, entry }) => {
                const cfg = configForId(id, entry.usedAlt);
                const edit = (fn) => editHistoryEntry(sess.day, id, entry.date, fn);
                const editSet = (i, patch) => edit(e => ({ ...e, sets: e.sets.map((x, k) => k === i ? { ...x, ...patch } : x) }));
                return (
                  <div key={id + entry.date} style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.line}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, height: 26, marginBottom: 6 }}>
                      <div style={{ ...TY.rowTitle, ...ellipsis, lineHeight: '20px', flex: 1, minWidth: 0 }}>{entry.exerciseName && entry.exerciseName !== 'x' ? entry.exerciseName : id}{entry.skipped ? <span style={{ fontSize: 10, color: T.warn }}> · skipped</span> : null}</div>
                      <EffortChips compact value={entry.effort || null} onChange={(v) => edit(e => { const { effort, ...rest } = e; return v ? { ...rest, effort: v } : rest; })} />
                    </div>
                    {entry.notes ? <div style={{ ...TY.note, fontStyle: 'italic', color: T.ink2, marginBottom: 6 }}>{entry.notes}</div> : null}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {(entry.sets || []).map((set, i) => (
                        <SetRow
                          key={i}
                          set={set}
                          label={setLabel(entry.sets, i)}
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
            <button onClick={() => { if (confirm('Delete this workout from the log? This cannot be undone.')) { deleteHistorySession(sess.day, sess.key); setView('history'); } }} style={{ width: '100%', height: 44, marginTop: 16, borderRadius: 12, border: `1px solid ${warnTint(0.55)}`, background: 'transparent', color: T.warn, fontWeight: 600, fontSize: 13 }}>Delete this workout</button>
          </>
        )}
      </Page>
    );
  }

  // DAY OVERVIEW
  if (view === 'dayOverview') {
    const dayData = workoutData[selectedDay];
    const adherence = getAbsAdherence();
    const inSession = Object.keys(sessionData).length > 0 && sessionDay === selectedDay;
    const savedForDay = (() => { const s = loadActiveSession(); return s && s.program === selectedProgram && s.day === selectedDay; })();
    const infoEx = infoExerciseId ? dayData.exercises.find(e => e.id === infoExerciseId) : null;
    const infoCfg = infoEx ? getExerciseConfig(infoEx) : (progressionConfig[infoExerciseId] || defaultProgressionConfig);
    const infoMedia = infoExerciseId ? (exerciseMedia[infoExerciseId] || exerciseMedia[progressionConfig[infoExerciseId]?.derivedFrom]) : null;
    const pill = { padding: '2px 8px', borderRadius: 9, fontWeight: 600, fontSize: 10, lineHeight: '14px', background: tint(0.10), color: T.accent };
    return (
      <Page bottom={96}>
        <BackLink onClick={() => setView('home')} gap={DAY_GAPS.back} />
        <div style={{ marginBottom: DAY_GAPS.header }}>
          <div style={{ ...TY.accentLabel, marginBottom: 2 }}>Day {selectedDay.replace('day', '')}</div>
          <h1 style={TY.screenTitle}>{dayData.name}</h1>
          <p style={TY.subtitle}>{dayData.focus}</p>
        </div>
        {dayData.mobility && (
          <div style={{ ...card, padding: '8px 12px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={TY.label}>Mobility warm-up</span>
              <span style={TY.meta}>5 min · ends in your first ramp set</span>
            </div>
            {dayData.mobility.map((m, i) => <div key={i} style={{ ...TY.meta, color: T.ink2 }}>{m}</div>)}
          </div>
        )}
        <AbRow done={absDone} onToggle={() => setAbsDone(!absDone)} gap={DAY_GAPS.ab} sub={adherence ? `Done ${adherence.done} of last ${adherence.total} workouts` : 'Tap when done — tracked with each workout'} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {dayData.exercises.map((ex, i) => {
            const variant = altOf(ex, i);
            const lastData = getLastSession(ex.id, variant);
            // Equipment taken? Tap any exercise to jump straight to it
            const doneThisSession = inSession && sessionData[i]?.sets?.some(s => s.completed && !s.warmup);
            // A superset pair reads as one block: flattened inner corners and a tick across the gap
            const pairTop = ex.superset && dayData.exercises[i + 1]?.superset === ex.superset;
            const pairBottom = ex.superset && dayData.exercises[i - 1]?.superset === ex.superset;
            return (
              <div key={`${ex.id}-${i}`} role="button" tabIndex={0} onClick={() => beginWorkout(i)} className={`exercise-row ${pressable}`} style={{ ...card, position: 'relative', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', borderRadius: pairTop ? '8px 8px 3px 3px' : pairBottom ? '3px 3px 8px 8px' : 8 }}>
                {pairTop && <div style={{ position: 'absolute', left: 25, bottom: -8, width: 2, height: 8, background: T.accent, zIndex: 1 }} />}
                <div style={{ width: 28, height: 28, boxSizing: 'border-box', borderRadius: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12, ...(doneThisSession ? { background: T.accent, color: T.primaryInk } : { border: `2px solid ${T.ink3}`, color: T.ink }) }}>
                  {doneThisSession ? <Check size={16} stroke={3.5} /> : i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...TY.rowTitle, ...ellipsis, lineHeight: '20px' }}>{ex.superset ? <span style={{ color: T.ink3 }}>⇄ </span> : null}{ex.name.split(' / ')[variant ? 1 : 0]}</div>
                  <div style={{ ...TY.meta, ...ellipsis }}>{ex.sets} × {ex.reps}{lastData ? (lastData.skipped ? ' · Skipped' : <span> · <span style={{ color: T.ink, fontWeight: 600 }}>{lastData.weight} lbs</span></span>) : ''}{doneThisSession ? <span> · <span style={{ color: T.accent }}>worked today</span></span> : null}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setInfoExerciseId(ex.id); }} className="info-btn active:scale-90" title="How to do it" style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 8, background: T.line, color: T.ink3, fontWeight: 700, fontSize: 12 }}>?</button>
                <span style={{ color: T.ink4 }}><ChevronRight size={16} /></span>
              </div>
            );
          })}
        </div>
        {infoExerciseId && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', background: 'rgba(0,0,0,0.7)' }} onClick={() => setInfoExerciseId(null)}>
            <div className="info-sheet" style={{ width: '100%', maxWidth: 448, margin: '0 auto', padding: 16, paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))', background: T.surface, borderTop: `1px solid ${T.line}`, borderRadius: '16px 16px 0 0' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ ...TY.label, marginBottom: 4 }}>How to do it</div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: '22px', color: T.ink2 }}>{infoEx?.description || infoMedia?.description || 'No description yet.'}</p>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {infoMedia?.youtube && !infoEx?.description && (
                  <a href={infoMedia.youtube} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, fontWeight: 600, fontSize: 12, background: tint(0.10), color: T.accent, textDecoration: 'none' }}>Watch form video</a>
                )}
                <span style={pill}>{infoCfg.repRange[0]}-{infoCfg.repRange[1]} reps</span>
                {infoCfg.weightIncrement > 0 && (
                  <span style={pill}>{infoCfg.assisted ? `−${infoCfg.weightIncrement} lb assist` : infoCfg.weightSteps ? 'next dumbbell up' : `+${infoCfg.weightIncrement} lb`}</span>
                )}
                {infoMedia?.source && !infoEx?.description && <span style={TY.meta}>Source: {infoMedia.source}</span>}
              </div>
              <button onClick={() => setInfoExerciseId(null)} style={{ width: '100%', marginTop: 12, padding: '8px 0', fontWeight: 600, fontSize: 12, color: T.ink3 }}>Close</button>
            </div>
          </div>
        )}
        <ActionBar>
          <PrimaryButton onClick={() => beginWorkout(0)}>{inSession ? 'Continue Workout' : savedForDay ? 'Resume Workout' : 'Begin Workout'}</PrimaryButton>
        </ActionBar>
      </Page>
    );
  }

  // EXERCISE: one exercise, or both halves of a superset on one screen
  if (view === 'exercise') {
    const dayData = workoutData[selectedDay];
    const exercises = dayData.exercises;
    const unit = unitOf(exercises, currentExerciseIndex);
    const paired = unit.length > 1;
    const lastOfUnit = unit[unit.length - 1];
    // Gaps of the single-exercise layout (design/handoff/HANDOFF.md 4.1)
    const G = { spacer: 12, title: 16, card: 10, aboveSets: 16, belowHeader: 6, rows: 8 };

    // What the Next block announces: the following exercise (or pair), or the summary
    const nextUnit = lastOfUnit < exercises.length - 1 ? unitOf(exercises, lastOfUnit + 1) : null;
    const nameOf = (i) => { const parts = exercises[i].name.split(' / '); return useAltExercise[i] && parts[1] ? parts[1] : parts[0]; };
    const nextInfo = (() => {
      if (!nextUnit) return { label: 'Next', name: 'Summary', detail: null };
      const first = nextUnit[0], lastIdx = nextUnit[nextUnit.length - 1];
      const label = `Next · ${nextUnit.length > 1 ? `${first + 1}–${lastIdx + 1}` : first + 1} of ${exercises.length}`;
      if (nextUnit.length > 1) return { label, name: nextUnit.map(nameOf).join(' + '), detail: 'Superset · alternate sets' };
      const ex = exercises[first];
      const last = getLastSession(ex.id, altOf(ex, first));
      const lastWeight = last && !last.skipped ? (getPerformedSets(last)[0]?.weight ?? last.weight) : null;
      return { label, name: nameOf(first), detail: `${ex.sets} × ${String(ex.reps).replace('-', '–')}${lastWeight !== null ? ` · last ${lastWeight} lb` : ''}` };
    })();

    const renderPanel = (index) => {
      const exercise = exercises[index];
      const variant = altOf(exercise, index);
      const progression = calculateProgression(exercise, variant);
      const exerciseConfig = progression.config;
      const nameParts = exercise.name.split(' / ');
      const hasAlt = nameParts.length > 1;
      const isUsingAlt = useAltExercise[index];
      const currentData = sessionData[index] || { sets: [], notes: '' };
      const last = progression.lastSession;
      const lastDate = last?.date ? new Date(last.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).replace(',', '') : null;
      const repUnit = exerciseConfig.progressionType === 'distance-first' ? 'feet' : exerciseConfig.progressionType === 'time-first' ? 'sec' : 'reps';
      const setRows = (gap) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap }}>
          {currentData.sets.map((set, i) => (
            <SetRow
              key={i}
              set={set}
              label={setLabel(currentData.sets, i)}
              config={exerciseConfig}
              onToggle={() => toggleSetComplete(index, i)}
              onChange={(field, value) => updateSet(index, i, field, value)}
              onCopy={i > 0 && !set.completed ? () => copyPreviousSet(index, i) : null}
            />
          ))}
        </div>
      );
      const title = (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, height: 30, marginBottom: paired ? 6 : G.title }}>
          <h1 style={{ ...ellipsis, margin: 0, flex: 1, minWidth: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: paired ? 17 : 19, lineHeight: '28px', letterSpacing: -0.2, color: T.ink }}>{isUsingAlt && hasAlt ? nameParts[1] : nameParts[0]}</h1>
          {hasAlt && (
            <button onClick={() => toggleAltExercise(index)} className={`alt-toggle ${pressable}`} title={`Switch to ${isUsingAlt ? nameParts[0] : nameParts[1]}`} style={{ height: 30, maxWidth: 160, boxSizing: 'border-box', padding: '0 10px', borderRadius: 15, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, background: T.surface, border: `1px solid ${T.line}`, color: T.ink, fontWeight: 600, fontSize: 10 }}>
              <span style={{ color: T.accent }}><Swap size={13} /></span>
              <span style={ellipsis}>{isUsingAlt ? nameParts[0] : nameParts[1]}</span>
            </button>
          )}
        </div>
      );
      const note = (height, gap) => (
        <NoteRow open={notesOpen === index} height={height} gap={gap} today={currentData.notes} previous={last?.notes} onOpen={() => setNotesOpen(index)} onClose={() => setNotesOpen(null)} onChange={(v) => patchExercise(index, { notes: v })} />
      );
      const effort = <EffortChips compact={paired} value={currentData.effort || null} onChange={(v) => patchExercise(index, { effort: v })} />;

      if (paired) {
        return (
          <div key={index} className="exercise-panel">
            {title}
            <Verdict verdict={progression.verdict} reason={progression.suggestion} inline gap={6} />
            {/* Last session on the left, effort chips on the right */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, height: 26, marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1, minWidth: 0, overflow: 'hidden' }}>
                {last && <span style={{ ...TY.label, flexShrink: 0, marginRight: 1 }}>Last</span>}
                <LastChips sets={last?.sets} tight />
              </div>
              {effort}
            </div>
            {note(30, 8)}
            {setRows(4)}
          </div>
        );
      }
      return (
        <div key={index} className="exercise-panel">
          {title}
          {last && (
            <div style={{ height: 50, boxSizing: 'border-box', padding: '7px 12px', borderRadius: 6, background: T.surface, marginBottom: G.card }}>
              <div style={{ ...TY.label, ...ellipsis }}>Last · {lastDate}{last.effort ? ` · felt ${last.effort}` : ''}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, overflow: 'hidden' }}><LastChips sets={last.sets} /></div>
            </div>
          )}
          <ProgressSpark entries={getAllSessions(exercise.id, variant)} config={exerciseConfig} gap={G.card} />
          <Verdict verdict={progression.verdict} reason={progression.suggestion} gap={G.card} />
          {note(36, G.aboveSets)}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, height: 26, marginBottom: G.belowHeader }}>
            <span><span style={TY.label}>Sets</span><span style={{ fontWeight: 500, fontSize: 11, lineHeight: '14px', color: T.ink3, marginLeft: 8 }}>{exerciseConfig.assisted ? 'lbs assist' : 'lbs'} · {repUnit}</span></span>
            {effort}
          </div>
          {setRows(G.rows)}
        </div>
      );
    };

    return (
      <Page pad={12} bottom={110}>
        {/* Nav row: back, position in the workout, notes */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 28, marginBottom: 2 }}>
          <button onClick={() => setView('dayOverview')} className="nav-back" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3 }}><ChevronLeft size={18} /></button>
          {paired ? (
            <div className="step-position" style={{ ...TY.label, ...ellipsis }}>{unit[0] + 1}–{lastOfUnit + 1} of {exercises.length} · Superset, alternate sets</div>
          ) : (
            <div className="step-position" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={srOnly}>{currentExerciseIndex + 1}/{exercises.length}</span>
              {exercises.map((_, i) => <span key={i} style={{ width: 6, height: 6, borderRadius: 3, background: i === currentExerciseIndex ? T.accent : T.line }} />)}
            </div>
          )}
          {paired ? <div style={{ width: 28, height: 28 }} /> : (
            <button onClick={() => setNotesOpen(notesOpen === null ? unit[0] : null)} className="nav-note" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3 }}><Pencil size={18} /></button>
          )}
        </div>
        <div style={{ height: 2, marginBottom: paired ? 6 : G.spacer }} />

        {unit.map((index, n) => (
          <React.Fragment key={index}>
            {n > 0 && <div style={{ height: 1, margin: '8px 0', background: T.line }} />}
            {renderPanel(index)}
          </React.Fragment>
        ))}

        <BottomBar onPrev={prevExercise} prevDisabled={currentExerciseIndex === 0} onSkip={nextExercise} onNext={nextExercise} next={nextInfo} />
      </Page>
    );
  }

  // SUMMARY (before final completion)
  if (view === 'summary') {
    const dayData = workoutData[selectedDay];
    const completedCount = Object.values(sessionData).filter(d => d && d.sets.every(s => s.completed)).length;
    return (
      <Page bottom={160}>
        <h1 style={TY.screenTitle}>Workout Summary</h1>
        <p style={{ ...TY.subtitle, fontSize: 14, lineHeight: '20px', marginBottom: 24 }}>{dayData.name}</p>

        <div style={{ ...card, height: 47, boxSizing: 'border-box', marginBottom: 16, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 28, lineHeight: '44px', color: T.accent }}>{completedCount}<span style={{ color: T.ink3, fontWeight: 600 }}>/{dayData.exercises.length}</span></span>
          <span style={TY.subtitle}>exercises completed</span>
        </div>

        <AbRow done={absDone} onToggle={() => setAbsDone(!absDone)} gap={12} sub="Saved with this workout" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dayData.exercises.map((ex, i) => {
            const data = sessionData[i];
            if (!data) return null;
            const completedSets = data.sets.filter(s => s.completed).length;
            const nameParts = ex.name.split(' / ');
            const usedAlt = useAltExercise[i] && nameParts.length > 1;
            return (
              <div key={i} style={{ ...card, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...TY.rowTitle, ...ellipsis, lineHeight: '20px' }}>{usedAlt ? nameParts[1] : nameParts[0]}</div>
                  <div style={TY.meta}>{completedSets}/{data.sets.length} sets · {(data.sets.find(s => !s.warmup) || data.sets[0])?.weight || 0} lbs</div>
                </div>
                {completedSets === data.sets.length ? (
                  <span style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.accent, color: T.primaryInk }}><Check size={14} stroke={3.5} /></span>
                ) : (
                  <span style={{ fontWeight: 700, fontSize: 12, color: T.warn }}>{completedSets}/{data.sets.length}</span>
                )}
              </div>
            );
          })}
        </div>

        <ActionBar>
          <PrimaryButton onClick={completeWorkout} height={54}>Complete workout, progress weight</PrimaryButton>
          <SecondaryButton onClick={() => startExercise(0)}>Review Exercises</SecondaryButton>
        </ActionBar>
      </Page>
    );
  }

  // COMPLETE
  if (view === 'complete') {
    const dayData = workoutData[selectedDay];
    const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    return (
      <Page center>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, margin: '0 auto 24px', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.primaryBg, color: T.primaryInk }}>
            <Trophy size={36} />
          </div>
          <h1 style={{ ...TY.screenTitle, marginBottom: 4 }}>Workout Complete!</h1>
          <p style={{ ...TY.subtitle, fontSize: 14, lineHeight: '20px', marginBottom: 8 }}>{dayData.name}</p>
          <p style={{ ...TY.subtitle, marginBottom: 24 }}>{todayDate}{lastDurationMin ? ` · ${lastDurationMin} min` : ''}</p>

          {storageError && <div style={{ marginBottom: 24 }}><StorageWarning onBackup={exportBackup} /></div>}
          {completedPRs.length > 0 && (
            <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={TY.accentLabel}>Personal records</div>
              {completedPRs.map((pr, i) => (
                <div key={i} style={{ padding: 12, borderRadius: 8, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, background: tint(0.10), border: `1px solid ${tint(0.55)}` }}>
                  <span style={{ color: T.accent }}><Trophy size={16} /></span>
                  <div>
                    <div style={{ ...TY.rowTitle, lineHeight: '20px' }}>{pr.name}</div>
                    <div style={{ ...TY.note, color: T.accent }}>{pr.detail} <span style={{ color: T.ink3 }}>(was {pr.prev})</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <PrimaryButton onClick={() => {
            setView('home');
            setSelectedDay(null);
            setSessionData({});
            setUseAltExercise({});
            setSessionDay(null);
            setWorkoutStartedAt(null);
            setCompletedPRs([]);
          }}>Done</PrimaryButton>
        </div>
      </Page>
    );
  }

  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(<WorkoutApp />);
