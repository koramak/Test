import React from 'react';
import { motion } from 'framer-motion';
import { getDayById } from '../data/workoutData';
import './WorkoutComplete.css';

const WorkoutComplete = ({ dayId, exerciseData, onFinish, onContinue }) => {
  const day = getDayById(dayId);

  // Calculate workout stats
  const totalSets = exerciseData.reduce((sum, ex) => sum + (ex.completedSets?.length || 0), 0);
  const totalReps = exerciseData.reduce((sum, ex) => {
    return sum + (ex.completedSets?.reduce((s, set) => s + (set.reps || 0), 0) || 0);
  }, 0);
  const totalVolume = exerciseData.reduce((sum, ex) => {
    return sum + (ex.completedSets?.reduce((s, set) => s + ((set.weight || 0) * (set.reps || 0)), 0) || 0);
  }, 0);

  // Check if all exercises are complete
  const allComplete = exerciseData.every(ex =>
    ex.completedSets?.length >= (ex.sets || 0)
  );

  const incompleteExercises = exerciseData.filter(ex =>
    (ex.completedSets?.length || 0) < (ex.sets || 0)
  );

  return (
    <div className="workout-complete" style={{ '--day-color': day?.color || '#4caf50' }}>
      <motion.div
        className="complete-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Trophy Icon */}
        <motion.div
          className="trophy-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          {allComplete ? (
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path d="M12 15C15.866 15 19 11.866 19 8V3H5V8C5 11.866 8.134 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M5 3H3V6C3 7.657 4.343 9 6 9H5" stroke="currentColor" strokeWidth="2"/>
              <path d="M19 3H21V6C21 7.657 19.657 9 18 9H19" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 15V18" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 21H16" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 18H15" stroke="currentColor" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </motion.div>

        <h1>{allComplete ? 'Workout Complete!' : 'Workout In Progress'}</h1>
        <p className="day-info">{day?.name} - {day?.title}</p>

        {/* Stats Grid */}
        <div className="stats-grid">
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="stat-value">{totalSets}</span>
            <span className="stat-label">Sets</span>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="stat-value">{totalReps}</span>
            <span className="stat-label">Reps</span>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="stat-value">{(totalVolume / 1000).toFixed(1)}k</span>
            <span className="stat-label">Volume (lbs)</span>
          </motion.div>
        </div>

        {/* Exercise Summary */}
        <div className="exercise-summary">
          <h3>Exercise Summary</h3>
          <div className="summary-list">
            {exerciseData.map((ex, idx) => {
              const completedSets = ex.completedSets?.length || 0;
              const targetSets = ex.sets || 0;
              const isComplete = completedSets >= targetSets;

              return (
                <motion.div
                  key={ex.id}
                  className={`summary-item ${isComplete ? 'complete' : 'incomplete'}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.05 }}
                >
                  <div className="summary-status">
                    {isComplete ? '✓' : `${completedSets}/${targetSets}`}
                  </div>
                  <div className="summary-info">
                    <span className="summary-name">{ex.name}</span>
                    {ex.completedSets?.length > 0 && (
                      <span className="summary-details">
                        {ex.completedSets.map(s => `${s.weight || 0}×${s.reps}`).join(', ')}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Incomplete Warning */}
        {!allComplete && (
          <div className="incomplete-warning">
            <p>{incompleteExercises.length} exercise{incompleteExercises.length > 1 ? 's' : ''} incomplete</p>
            <ul>
              {incompleteExercises.map(ex => (
                <li key={ex.id}>{ex.name} - {ex.completedSets?.length || 0}/{ex.sets} sets</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="complete-actions">
          {!allComplete && (
            <button className="continue-button" onClick={onContinue}>
              Continue Workout
            </button>
          )}
          <button className="finish-button" onClick={onFinish}>
            {allComplete ? 'Finish & Save' : 'Save & Exit'}
          </button>
        </div>

        {/* Progression Note */}
        <p className="progression-note">
          Your weights and progress have been saved. Next week's workout will use these weights as a baseline for progression.
        </p>
      </motion.div>
    </div>
  );
};

export default WorkoutComplete;
