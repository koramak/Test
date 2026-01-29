import React from 'react';
import { getDayById } from '../data/workoutData';
import './WorkoutOverview.css';

const WorkoutOverview = ({ dayId, onStartWorkout, onBack }) => {
  const day = getDayById(dayId);

  if (!day) return null;

  // Group exercises by supersets
  const groupedExercises = [];
  const processed = new Set();

  day.exercises.forEach((exercise) => {
    if (processed.has(exercise.id)) return;

    if (exercise.supersetWith) {
      const partner = day.exercises.find(e => e.id === exercise.supersetWith);
      if (partner && !processed.has(partner.id)) {
        groupedExercises.push({
          type: 'superset',
          exercises: [exercise, partner],
        });
        processed.add(exercise.id);
        processed.add(partner.id);
      } else {
        groupedExercises.push({ type: 'single', exercise });
        processed.add(exercise.id);
      }
    } else {
      groupedExercises.push({ type: 'single', exercise });
      processed.add(exercise.id);
    }
  });

  return (
    <div className="workout-overview" style={{ '--day-color': day.color }}>
      <header className="overview-header">
        <button className="back-button" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
        <div className="header-content">
          <span className="day-label">{day.name}</span>
          <h1>{day.title}</h1>
          <p>{day.subtitle}</p>
        </div>
      </header>

      <div className="exercise-list">
        {groupedExercises.map((group, index) => (
          <div key={index} className={`exercise-item ${group.type}`}>
            {group.type === 'superset' ? (
              <>
                <div className="superset-label">SUPERSET</div>
                <div className="superset-exercises">
                  {group.exercises.map((ex) => (
                    <div key={ex.id} className="exercise-row">
                      <span className="exercise-name">{ex.name}</span>
                      <span className="exercise-prescription">{ex.sets}×{ex.reps}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="exercise-row">
                <div className="exercise-info">
                  <span className="exercise-name">{group.exercise.name}</span>
                  {group.exercise.notes && (
                    <span className="exercise-note">{group.exercise.notes}</span>
                  )}
                </div>
                <span className="exercise-prescription">{group.exercise.sets}×{group.exercise.reps}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="overview-footer">
        <button className="start-button" onClick={onStartWorkout}>
          Start Workout
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5,3 19,12 5,21" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WorkoutOverview;
