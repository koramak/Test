import React, { useState, useEffect } from 'react';
import DaySelector from './components/DaySelector';
import WorkoutOverview from './components/WorkoutOverview';
import ExerciseCard from './components/ExerciseCard';
import WorkoutComplete from './components/WorkoutComplete';
import { getDayById } from './data/workoutData';
import { saveWorkoutLog, getWorkoutLog, getRecommendedWeight } from './utils/storage';
import './App.css';

const VIEWS = {
  DAY_SELECT: 'daySelect',
  OVERVIEW: 'overview',
  WORKOUT: 'workout',
  COMPLETE: 'complete',
};

function App() {
  const [currentView, setCurrentView] = useState(VIEWS.DAY_SELECT);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseData, setExerciseData] = useState([]);

  // Initialize exercise data when starting a workout
  const initializeExerciseData = (dayId) => {
    const day = getDayById(dayId);
    if (!day) return [];

    // Check if there's existing data for this workout (in case user continues)
    const existingLog = getWorkoutLog(dayId);

    return day.exercises.map(exercise => {
      const existingExercise = existingLog?.exercises?.find(e => e.id === exercise.id);

      return {
        ...exercise,
        weight: existingExercise?.weight || getRecommendedWeight(dayId, exercise),
        completedSets: existingExercise?.completedSets || [],
        rampingSets: existingExercise?.rampingSets || exercise.rampingSets || null,
      };
    });
  };

  // Handle day selection
  const handleSelectDay = (dayId) => {
    setSelectedDayId(dayId);
    setCurrentView(VIEWS.OVERVIEW);
  };

  // Start workout
  const handleStartWorkout = () => {
    const data = initializeExerciseData(selectedDayId);
    setExerciseData(data);
    setCurrentExerciseIndex(0);
    setCurrentView(VIEWS.WORKOUT);
  };

  // Handle exercise completion (update data for an exercise)
  const handleExerciseComplete = (updatedExercise) => {
    setExerciseData(prev =>
      prev.map(ex =>
        ex.id === updatedExercise.id ? updatedExercise : ex
      )
    );
  };

  // Navigate to next exercise
  const handleNextExercise = () => {
    const day = getDayById(selectedDayId);
    if (currentExerciseIndex < day.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      // End of workout
      setCurrentView(VIEWS.COMPLETE);
    }
  };

  // Navigate to previous exercise
  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  // Go back from overview to day select
  const handleBackToSelect = () => {
    setSelectedDayId(null);
    setCurrentView(VIEWS.DAY_SELECT);
  };

  // Continue workout from complete screen
  const handleContinueWorkout = () => {
    // Find first incomplete exercise
    const incompleteIndex = exerciseData.findIndex(
      ex => (ex.completedSets?.length || 0) < ex.sets
    );
    setCurrentExerciseIndex(incompleteIndex >= 0 ? incompleteIndex : 0);
    setCurrentView(VIEWS.WORKOUT);
  };

  // Finish and save workout
  const handleFinishWorkout = () => {
    saveWorkoutLog(selectedDayId, exerciseData);
    setSelectedDayId(null);
    setExerciseData([]);
    setCurrentExerciseIndex(0);
    setCurrentView(VIEWS.DAY_SELECT);
  };

  // Get current exercise
  const currentExercise = exerciseData[currentExerciseIndex];
  const day = getDayById(selectedDayId);

  return (
    <div className="app">
      {currentView === VIEWS.DAY_SELECT && (
        <DaySelector onSelectDay={handleSelectDay} />
      )}

      {currentView === VIEWS.OVERVIEW && (
        <WorkoutOverview
          dayId={selectedDayId}
          onStartWorkout={handleStartWorkout}
          onBack={handleBackToSelect}
        />
      )}

      {currentView === VIEWS.WORKOUT && currentExercise && (
        <ExerciseCard
          dayId={selectedDayId}
          dayColor={day?.color}
          exercise={currentExercise}
          exerciseIndex={currentExerciseIndex}
          totalExercises={exerciseData.length}
          onComplete={handleExerciseComplete}
          onPrevious={handlePreviousExercise}
          onNext={handleNextExercise}
          savedData={exerciseData[currentExerciseIndex]}
        />
      )}

      {currentView === VIEWS.COMPLETE && (
        <WorkoutComplete
          dayId={selectedDayId}
          exerciseData={exerciseData}
          onFinish={handleFinishWorkout}
          onContinue={handleContinueWorkout}
        />
      )}
    </div>
  );
}

export default App;
