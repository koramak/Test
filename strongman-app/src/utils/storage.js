// Local storage utilities for workout logging and progression

const STORAGE_KEYS = {
  WORKOUT_LOGS: 'strongman_workout_logs',
  EXERCISE_PROGRESS: 'strongman_exercise_progress',
  CURRENT_WEEK: 'strongman_current_week',
};

// Get the current week number (ISO week)
export const getCurrentWeekNumber = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
};

// Get the current year
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

// Get week key for storage (e.g., "2024-W05")
export const getWeekKey = (year = getCurrentYear(), week = getCurrentWeekNumber()) => {
  return `${year}-W${String(week).padStart(2, '0')}`;
};

// Save a completed workout
export const saveWorkoutLog = (dayId, exercises, weekKey = getWeekKey()) => {
  const logs = getWorkoutLogs();

  if (!logs[weekKey]) {
    logs[weekKey] = {};
  }

  logs[weekKey][dayId] = {
    completedAt: new Date().toISOString(),
    exercises: exercises,
  };

  localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(logs));

  // Also update exercise progress
  updateExerciseProgress(dayId, exercises);

  return logs;
};

// Get all workout logs
export const getWorkoutLogs = () => {
  try {
    const logs = localStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS);
    return logs ? JSON.parse(logs) : {};
  } catch {
    return {};
  }
};

// Get workout log for a specific day and week
export const getWorkoutLog = (dayId, weekKey = getWeekKey()) => {
  const logs = getWorkoutLogs();
  return logs[weekKey]?.[dayId] || null;
};

// Get last week's workout for a specific day
export const getLastWeekWorkout = (dayId) => {
  const currentWeek = getCurrentWeekNumber();
  const currentYear = getCurrentYear();

  // Handle year boundary
  let lastWeek = currentWeek - 1;
  let year = currentYear;
  if (lastWeek < 1) {
    lastWeek = 52;
    year = currentYear - 1;
  }

  const lastWeekKey = getWeekKey(year, lastWeek);
  return getWorkoutLog(dayId, lastWeekKey);
};

// Update exercise progress for recommendations
export const updateExerciseProgress = (dayId, exercises) => {
  const progress = getExerciseProgress();

  exercises.forEach(exercise => {
    const key = `${dayId}-${exercise.id}`;

    if (!progress[key]) {
      progress[key] = {
        history: [],
        consecutiveSuccesses: 0,
        lastUpdated: null,
      };
    }

    // Add to history
    progress[key].history.push({
      date: new Date().toISOString(),
      sets: exercise.completedSets,
      weight: exercise.weight,
      targetReps: exercise.reps,
      allRepsHit: exercise.completedSets.every(set => set.reps >= (exercise.repLow || exercise.reps)),
    });

    // Keep only last 10 workouts
    if (progress[key].history.length > 10) {
      progress[key].history.shift();
    }

    // Track consecutive successes for progression
    const lastEntry = progress[key].history[progress[key].history.length - 1];
    if (lastEntry.allRepsHit) {
      progress[key].consecutiveSuccesses++;
    } else {
      progress[key].consecutiveSuccesses = 0;
    }

    progress[key].lastUpdated = new Date().toISOString();
  });

  localStorage.setItem(STORAGE_KEYS.EXERCISE_PROGRESS, JSON.stringify(progress));
};

// Get exercise progress
export const getExerciseProgress = () => {
  try {
    const progress = localStorage.getItem(STORAGE_KEYS.EXERCISE_PROGRESS);
    return progress ? JSON.parse(progress) : {};
  } catch {
    return {};
  }
};

// Get recommended weight for an exercise based on progression
export const getRecommendedWeight = (dayId, exercise) => {
  const progress = getExerciseProgress();
  const key = `${dayId}-${exercise.id}`;
  const exerciseProgress = progress[key];

  if (!exerciseProgress || exerciseProgress.history.length === 0) {
    return exercise.defaultWeight;
  }

  const lastWorkout = exerciseProgress.history[exerciseProgress.history.length - 1];
  const lastWeight = lastWorkout.weight;

  // Apply progression rules based on type
  switch (exercise.progressionType) {
    case 'mainLift':
      // +2.5-5 lbs weekly when all reps completed
      if (lastWorkout.allRepsHit) {
        return lastWeight + 5;
      }
      return lastWeight;

    case 'rowPull':
      // +5-10 lbs every 5 weeks, then deload to 60%
      if (exerciseProgress.consecutiveSuccesses >= 5) {
        return Math.round(lastWeight * 0.6); // Deload
      }
      if (exerciseProgress.consecutiveSuccesses > 0 && exerciseProgress.consecutiveSuccesses % 5 === 0) {
        return lastWeight + 5;
      }
      return lastWeight;

    case 'isolation':
      // When hitting top of rep range for all sets, +5 lbs
      if (lastWorkout.allRepsHit) {
        return lastWeight + 5;
      }
      return lastWeight;

    case 'carry':
      // Progress weight only after distance is mastered (handled separately)
      if (exerciseProgress.consecutiveSuccesses >= 3) {
        return lastWeight + 5;
      }
      return lastWeight;

    case 'bodyweight':
    default:
      return lastWorkout.weight || 0;
  }
};

// Get recommended reps (for ramping sets)
export const getRecommendedRampingSets = (dayId, exercise) => {
  const progress = getExerciseProgress();
  const key = `${dayId}-${exercise.id}`;
  const exerciseProgress = progress[key];

  if (!exerciseProgress || exerciseProgress.history.length === 0) {
    return exercise.rampingSets || null;
  }

  const lastWorkout = exerciseProgress.history[exerciseProgress.history.length - 1];

  // If we hit all reps, suggest increasing the top sets by 5-10 lbs
  if (lastWorkout.allRepsHit && lastWorkout.sets) {
    return lastWorkout.sets.map((set, index) => {
      // Only increase the heavy sets (lower rep sets)
      if (set.reps <= 4) {
        return { ...set, weight: set.weight + 5 };
      }
      return set;
    });
  }

  return lastWorkout.sets || exercise.rampingSets;
};

// Check if workout is completed this week
export const isWorkoutCompletedThisWeek = (dayId) => {
  const log = getWorkoutLog(dayId);
  return log !== null;
};

// Clear all data (for testing)
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.WORKOUT_LOGS);
  localStorage.removeItem(STORAGE_KEYS.EXERCISE_PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_WEEK);
};

// Export data as JSON (for backup)
export const exportData = () => {
  return {
    workoutLogs: getWorkoutLogs(),
    exerciseProgress: getExerciseProgress(),
    exportedAt: new Date().toISOString(),
  };
};

// Import data from JSON (for restore)
export const importData = (data) => {
  if (data.workoutLogs) {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(data.workoutLogs));
  }
  if (data.exerciseProgress) {
    localStorage.setItem(STORAGE_KEYS.EXERCISE_PROGRESS, JSON.stringify(data.exerciseProgress));
  }
};
