import React, { useState } from 'react';
import { WILDFLOWERS } from './data/wildflowers';
import FlashCard from './components/FlashCard';
import styles from './App.module.css';

export default function App() {
  const [mode, setMode] = useState('learn');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [masteredIds, setMasteredIds] = useState(new Set());
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const currentFlower = WILDFLOWERS[currentIndex];

  const nextFlower = () => {
    setShowAnswer(false);
    setUserGuess('');
    setFeedback(null);
    setPhotoIndex(0);
    setImageError(false);
    setCurrentIndex((prev) => (prev + 1) % WILDFLOWERS.length);
  };

  const prevFlower = () => {
    setShowAnswer(false);
    setUserGuess('');
    setFeedback(null);
    setPhotoIndex(0);
    setImageError(false);
    setCurrentIndex((prev) => (prev - 1 + WILDFLOWERS.length) % WILDFLOWERS.length);
  };

  const toggleMastered = () => {
    setMasteredIds(prev => {
      const next = new Set(prev);
      if (next.has(currentFlower.id)) {
        next.delete(currentFlower.id);
      } else {
        next.add(currentFlower.id);
      }
      return next;
    });
  };

  const checkGuess = () => {
    const guess = userGuess.toLowerCase().trim();
    const commonName = currentFlower.commonName.toLowerCase();
    const latinName = currentFlower.latinName.toLowerCase();

    if (guess === commonName || guess === latinName ||
        (commonName.includes(guess) && guess.length > 3)) {
      setFeedback({ correct: true, message: 'Correct!' });
      setShowAnswer(true);
    } else {
      setFeedback({ correct: false, message: 'Not quite. Try again or reveal the answer.' });
    }
  };

  const cyclePhoto = () => {
    setPhotoIndex((prev) => (prev + 1) % currentFlower.photos.length);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkGuess();
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Understory</h1>
        <p className={styles.subtitle}>
          NYC Regional Wildflowers • {WILDFLOWERS.length} Species
        </p>
      </header>

      {/* Mode Selector */}
      <div className={styles.modeSelector}>
        {['learn', 'practice', 'test'].map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setShowAnswer(false); setFeedback(null); setUserGuess(''); }}
            className={`${styles.modeButton} ${mode === m ? styles.modeButtonActive : ''}`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${(masteredIds.size / WILDFLOWERS.length) * 100}%` }}
        />
      </div>
      <p className={styles.progressText}>
        {masteredIds.size} of {WILDFLOWERS.length} mastered
      </p>

      {/* Main Card */}
      <FlashCard
        flower={currentFlower}
        mode={mode}
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
        userGuess={userGuess}
        setUserGuess={setUserGuess}
        feedback={feedback}
        checkGuess={checkGuess}
        handleKeyPress={handleKeyPress}
        photoIndex={photoIndex}
        cyclePhoto={cyclePhoto}
        imageError={imageError}
        setImageError={setImageError}
        currentIndex={currentIndex}
        totalCount={WILDFLOWERS.length}
        isMastered={masteredIds.has(currentFlower.id)}
        toggleMastered={toggleMastered}
        onPrev={prevFlower}
        onNext={nextFlower}
      />

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Photos from Wikimedia Commons • CC BY-SA licensed</p>
      </footer>
    </div>
  );
}
