import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import MuscleIllustration from './MuscleIllustration';
import RestTimer from './RestTimer';
import { getRecommendedWeight, getRecommendedRampingSets } from '../utils/storage';
import './ExerciseCard.css';

const ExerciseCard = ({
  dayId,
  dayColor,
  exercise,
  exerciseIndex,
  totalExercises,
  onComplete,
  onPrevious,
  onNext,
  savedData,
}) => {
  // Initialize with recommended or saved weight
  const recommendedWeight = getRecommendedWeight(dayId, exercise);
  const recommendedRampingSets = getRecommendedRampingSets(dayId, exercise);

  const [weight, setWeight] = useState(savedData?.weight || recommendedWeight);
  const [completedSets, setCompletedSets] = useState(
    savedData?.completedSets || []
  );
  const [currentSetIndex, setCurrentSetIndex] = useState(
    savedData?.completedSets?.length || 0
  );
  const [repsInput, setRepsInput] = useState(exercise.repHigh || exercise.reps);
  const [showWeightPicker, setShowWeightPicker] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [direction, setDirection] = useState(0);

  // For ramping sets, track individual weights
  const [rampingSets, setRampingSets] = useState(
    savedData?.rampingSets || recommendedRampingSets || exercise.rampingSets || null
  );

  const isRamping = exercise.reps === 'ramping' && rampingSets;

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (exerciseIndex < totalExercises - 1) {
        setDirection(1);
        onNext();
      }
    },
    onSwipedRight: () => {
      if (exerciseIndex > 0) {
        setDirection(-1);
        onPrevious();
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: false,
  });

  const handleLogSet = () => {
    const newSet = {
      setNumber: currentSetIndex + 1,
      weight: isRamping ? rampingSets[currentSetIndex]?.weight : weight,
      reps: isRamping ? rampingSets[currentSetIndex]?.reps : parseInt(repsInput),
      completedAt: new Date().toISOString(),
    };

    const newCompletedSets = [...completedSets, newSet];
    setCompletedSets(newCompletedSets);

    if (currentSetIndex + 1 < exercise.sets) {
      setCurrentSetIndex(currentSetIndex + 1);
      // Reset reps for next set
      if (!isRamping) {
        setRepsInput(exercise.repHigh || exercise.reps);
      }
    }

    // Save progress
    onComplete({
      ...exercise,
      weight,
      completedSets: newCompletedSets,
      rampingSets,
    });

    // Show rest timer if there are more sets
    if (currentSetIndex + 1 < exercise.sets) {
      setShowRestTimer(true);
    }
  };

  const handleUndoSet = () => {
    if (completedSets.length > 0) {
      const newCompletedSets = completedSets.slice(0, -1);
      setCompletedSets(newCompletedSets);
      setCurrentSetIndex(Math.max(0, currentSetIndex - 1));
    }
  };

  const handleWeightChange = (newWeight) => {
    setWeight(Math.max(0, newWeight));
    setShowWeightPicker(false);
  };

  const handleRampingWeightChange = (setIndex, newWeight) => {
    const newRampingSets = [...rampingSets];
    newRampingSets[setIndex] = { ...newRampingSets[setIndex], weight: newWeight };
    setRampingSets(newRampingSets);
  };

  const allSetsCompleted = completedSets.length >= exercise.sets;
  const progressPercent = (completedSets.length / exercise.sets) * 100;

  return (
    <div {...handlers} className="exercise-card" style={{ '--day-color': dayColor }}>
      {/* Header */}
      <div className="exercise-header">
        <div className="exercise-nav">
          <button
            className="nav-button"
            onClick={() => { setDirection(-1); onPrevious(); }}
            disabled={exerciseIndex === 0}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>
          <span className="exercise-counter">
            {exerciseIndex + 1} / {totalExercises}
          </span>
          <button
            className="nav-button"
            onClick={() => { setDirection(1); onNext(); }}
            disabled={exerciseIndex === totalExercises - 1}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={exercise.id}
          initial={{ x: direction * 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -100, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="exercise-content"
        >
          {/* Exercise Title */}
          <div className="exercise-title-section">
            <h2 className="exercise-name">{exercise.name}</h2>
            {exercise.supersetWith && (
              <span className="superset-badge">SUPERSET</span>
            )}
            <p className="exercise-notes">{exercise.notes}</p>
          </div>

          {/* Muscle Illustration */}
          <div className="muscle-illustration">
            <MuscleIllustration
              primaryMuscles={exercise.primaryMuscles}
              secondaryMuscles={exercise.secondaryMuscles}
              size={140}
            />
          </div>

          {/* Weight Selector */}
          {!isRamping && exercise.defaultWeight > 0 && (
            <div className="weight-section">
              <span className="section-label">Weight</span>
              <div className="weight-controls">
                <button
                  className="weight-adjust"
                  onClick={() => handleWeightChange(weight - 5)}
                >
                  -5
                </button>
                <button
                  className="weight-display"
                  onClick={() => setShowWeightPicker(true)}
                >
                  {weight} lbs
                </button>
                <button
                  className="weight-adjust"
                  onClick={() => handleWeightChange(weight + 5)}
                >
                  +5
                </button>
              </div>
              {weight !== exercise.defaultWeight && weight === recommendedWeight && (
                <span className="recommendation-badge">Recommended</span>
              )}
            </div>
          )}

          {/* Ramping Sets Display */}
          {isRamping && (
            <div className="ramping-section">
              <span className="section-label">Ramping Sets</span>
              <div className="ramping-sets">
                {rampingSets.map((set, idx) => (
                  <div
                    key={idx}
                    className={`ramping-set ${idx === currentSetIndex ? 'current' : ''} ${idx < completedSets.length ? 'completed' : ''}`}
                  >
                    <span className="set-number">Set {idx + 1}</span>
                    <div className="ramping-weight-control">
                      <button
                        className="ramping-adjust"
                        onClick={() => handleRampingWeightChange(idx, set.weight - 5)}
                        disabled={idx < completedSets.length}
                      >
                        -
                      </button>
                      <span className="ramping-weight">{set.weight}</span>
                      <button
                        className="ramping-adjust"
                        onClick={() => handleRampingWeightChange(idx, set.weight + 5)}
                        disabled={idx < completedSets.length}
                      >
                        +
                      </button>
                    </div>
                    <span className="ramping-reps">×{set.reps}</span>
                    {idx < completedSets.length && (
                      <span className="set-check">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sets & Reps for non-ramping */}
          {!isRamping && (
            <div className="sets-section">
              <div className="sets-header">
                <span className="section-label">
                  Set {currentSetIndex + 1} of {exercise.sets}
                </span>
                {completedSets.length > 0 && (
                  <button className="undo-button" onClick={handleUndoSet}>
                    Undo
                  </button>
                )}
              </div>

              <div className="reps-control">
                <span className="reps-label">Reps:</span>
                <div className="reps-buttons">
                  <button
                    className="reps-adjust"
                    onClick={() => setRepsInput(Math.max(1, repsInput - 1))}
                  >
                    -
                  </button>
                  <span className="reps-value">{repsInput}</span>
                  <button
                    className="reps-adjust"
                    onClick={() => setRepsInput(repsInput + 1)}
                  >
                    +
                  </button>
                </div>
                <span className="target-reps">Target: {exercise.reps}</span>
              </div>

              {/* Set Progress Dots */}
              <div className="set-dots">
                {Array.from({ length: exercise.sets }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`set-dot ${idx < completedSets.length ? 'completed' : ''} ${idx === currentSetIndex ? 'current' : ''}`}
                  >
                    {idx < completedSets.length ? '✓' : idx + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div className="exercise-footer">
        <button
          className={`log-set-button ${allSetsCompleted ? 'all-done' : ''}`}
          onClick={handleLogSet}
          disabled={allSetsCompleted}
        >
          {allSetsCompleted ? (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12" />
              </svg>
              All Sets Complete!
            </>
          ) : (
            <>
              Log Set {currentSetIndex + 1}
              <span className="rest-hint">
                Rest: {exercise.restSeconds >= 120 ? `${exercise.restSeconds / 60} min` : `${exercise.restSeconds}s`}
              </span>
            </>
          )}
        </button>

        {allSetsCompleted && exerciseIndex < totalExercises - 1 && (
          <button
            className="next-exercise-button"
            onClick={() => { setDirection(1); onNext(); }}
          >
            Next Exercise
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        )}
      </div>

      {/* Rest Timer Modal */}
      {showRestTimer && (
        <RestTimer
          seconds={exercise.restSeconds}
          onComplete={() => setShowRestTimer(false)}
          onDismiss={() => setShowRestTimer(false)}
        />
      )}

      {/* Weight Picker Modal */}
      {showWeightPicker && (
        <div className="weight-picker-overlay" onClick={() => setShowWeightPicker(false)}>
          <div className="weight-picker" onClick={(e) => e.stopPropagation()}>
            <h3>Select Weight</h3>
            <div className="weight-grid">
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110, 120, 130, 135, 140, 150, 160, 170, 180, 185, 190, 200, 225, 250, 275, 300, 315, 350, 405].map((w) => (
                <button
                  key={w}
                  className={`weight-option ${w === weight ? 'selected' : ''}`}
                  onClick={() => handleWeightChange(w)}
                >
                  {w}
                </button>
              ))}
            </div>
            <input
              type="number"
              className="custom-weight-input"
              placeholder="Custom weight..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleWeightChange(parseInt(e.target.value) || 0);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
