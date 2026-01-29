import React from 'react';
import { workoutDays } from '../data/workoutData';
import { isWorkoutCompletedThisWeek, getWeekKey } from '../utils/storage';
import './DaySelector.css';

const DaySelector = ({ onSelectDay }) => {
  const currentWeekKey = getWeekKey();

  return (
    <div className="day-selector">
      <header className="day-selector-header">
        <h1>Strongman Hypertrophy</h1>
        <p className="week-label">Week: {currentWeekKey}</p>
        <p className="subtitle">Power + Armor Building</p>
      </header>

      <div className="day-buttons">
        {workoutDays.map((day) => {
          const isCompleted = isWorkoutCompletedThisWeek(day.id);

          return (
            <button
              key={day.id}
              className={`day-button ${isCompleted ? 'completed' : ''}`}
              style={{ '--day-color': day.color }}
              onClick={() => onSelectDay(day.id)}
            >
              <div className="day-button-content">
                <span className="day-name">{day.name}</span>
                <span className="day-title">{day.title}</span>
                <span className="day-subtitle">{day.subtitle}</span>
                {isCompleted && (
                  <span className="completed-badge">Completed</span>
                )}
              </div>
              <div className="day-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      <footer className="day-selector-footer">
        <p>45 min sessions | 3-min rest (power) | 60-90s rest (hypertrophy)</p>
      </footer>
    </div>
  );
};

export default DaySelector;
